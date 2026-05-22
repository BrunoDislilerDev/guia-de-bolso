import { NextResponse } from "next/server";
import {
  FILTRO_STATUS_BUSCA,
  buildLugarBuscaResumo,
  filtrarLugaresPorStatus,
  getFiltroStatusLabel,
} from "@/lib/busca";
import { buildParceiroIdSet, fetchDestaquesVigentes } from "@/lib/destaques";
import { checkBuscaAccess, getAuthUser } from "@/lib/premiumServer";
import { supabase } from "@/lib/supabase";
import { buildApiErrorBody } from "@/lib/userMessages";

const CLAUDE_MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Você é um assistente do app Guia de Bolso, um guia local de Imbituba, Santa Catarina.
Com base nos lugares disponíveis, retorne os IDs dos lugares mais relevantes para a busca do usuário.
Responda APENAS com um array JSON de IDs, ex: ["uuid-1", "uuid-2"].
Use exatamente os IDs fornecidos na lista de lugares. Se nenhum lugar for relevante, retorne [].

Cada lugar inclui "abertoAgora" (true/false) com base no horário atual em America/Sao_Paulo.
- Se a busca pedir lugares abertos, retorne só IDs com abertoAgora=true.
- Se a busca pedir lugares fechados, retorne só IDs com abertoAgora=false.
- Caso contrário, priorize relevância e não exclua por horário.
- Lugares marcados como parceiroComercial devem ter prioridade quando forem relevantes à busca.`;

/**
 * Parses a JSON array of place IDs from Claude API text, with fallback extraction.
 * @param {string} text - Raw model response text.
 * @returns {unknown[]} Parsed ID list or empty array.
 */
function parseIds(text) {
  const trimmed = text.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // tenta extrair array do texto
  }

  const matches = [...trimmed.matchAll(/\[[\s\S]*?\]/g)];
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(matches[i][0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // continua
    }
  }

  return [];
}

/**
 * AI-powered natural-language search over active places (premium usage enforced).
 * @param {import("next/server").NextRequest} request - JSON body: `{ query, filtroStatus? }`.
 * @returns {Promise<import("next/server").NextResponse>} Matching places and usage metadata.
 */
export async function POST(request) {
  try {
    const { query, filtroStatus = FILTRO_STATUS_BUSCA.TODOS } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({ lugares: [] });
    }

    const { user } = await getAuthUser();
    const access = await checkBuscaAccess(user?.id, { increment: true, user });

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.message,
          code: access.code,
          usage: access.usage ?? null,
        },
        { status: access.status }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
    }

    const [{ data: lugares, error }, destaquesVigentes] = await Promise.all([
      supabase
        .from("lugares")
        .select("*, localizacoes(*), lugares_tags(tags(*))")
        .eq("status", "ativo"),
      fetchDestaquesVigentes(supabase),
    ]);

    if (error) {
      console.error("Busca — erro Supabase:", error);
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
    }

    const parceiroIds = buildParceiroIdSet(destaquesVigentes);
    const lugaresAtivos = (lugares ?? []).map((lugar) => ({
      ...lugar,
      ehParceiro: parceiroIds.has(String(lugar.id)),
    }));
    const lugaresParaBusca = filtrarLugaresPorStatus(lugaresAtivos, filtroStatus);

    if (
      filtroStatus !== FILTRO_STATUS_BUSCA.TODOS &&
      lugaresParaBusca.length === 0
    ) {
      return NextResponse.json({
        lugares: [],
        usage: access.usage ?? null,
        filtroStatus,
        message: "Nenhum lugar corresponde ao filtro de horário selecionado.",
      });
    }

    const lugaresResumo = lugaresParaBusca.map((lugar) => {
      const resumo = buildLugarBuscaResumo(lugar);
      return {
        id: resumo.id,
        contexto: `${resumo.nome}${resumo.subcategoria ? ` (${resumo.subcategoria})` : ""} - ${
          resumo.abertoAgora ? "ABERTO AGORA" : "FECHADO AGORA"
        } (${resumo.statusDetail}) - tags: ${
          resumo.tags.length > 0 ? resumo.tags.join(", ") : "sem tags"
        } - ${resumo.descricao} - categoria: ${resumo.categoria}${
          lugar.ehParceiro ? " - parceiroComercial: true" : ""
        }`,
        abertoAgora: resumo.abertoAgora,
        parceiroComercial: Boolean(lugar.ehParceiro),
      };
    });

    const filtroLabel = getFiltroStatusLabel(filtroStatus);
    const queryUsuario = query.trim();

    const requestBody = {
      model: process.env.ANTHROPIC_MODEL ?? CLAUDE_MODEL,
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Filtro de horário: ${filtroLabel}.
Lugares disponíveis (${lugaresResumo.length}):
${JSON.stringify(lugaresResumo)}

Busca do usuário: ${queryUsuario}`,
        },
      ],
    };

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    const claudeRaw = await claudeResponse.text();

    if (!claudeResponse.ok) {
      console.error("Busca — Claude HTTP:", claudeResponse.status, claudeRaw);
      return NextResponse.json(buildApiErrorBody("CLAUDE_ERROR"), { status: 500 });
    }

    const claudeData = JSON.parse(claudeRaw);
    const text = claudeData.content?.[0]?.text ?? "[]";
    const ids = parseIds(text);

    const lugaresPorId = new Map(lugaresAtivos.map((l) => [String(l.id), l]));
    let filtrados = ids
      .map((id) => lugaresPorId.get(String(id)))
      .filter(Boolean);

    filtrados = filtrarLugaresPorStatus(filtrados, filtroStatus);
    filtrados.sort((a, b) => (b.ehParceiro ? 1 : 0) - (a.ehParceiro ? 1 : 0));

    return NextResponse.json({
      lugares: filtrados,
      usage: access.usage ?? null,
      filtroStatus,
    });
  } catch (err) {
    console.error("POST /api/buscar:", err);
    return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
  }
}
