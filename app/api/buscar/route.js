import { NextResponse } from "next/server";
import {
  FILTRO_STATUS_BUSCA,
  buildLugarBuscaResumo,
  filtrarLugaresPorStatus,
  getFiltroStatusLabel,
} from "@/lib/busca";
import { checkBuscaAccess, getAuthUser } from "@/lib/premiumServer";
import { supabase } from "@/lib/supabase";

const CLAUDE_MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Você é um assistente do app Guia de Bolso, um guia local de Imbituba, Santa Catarina.
Com base nos lugares disponíveis, retorne os IDs dos lugares mais relevantes para a busca do usuário.
Responda APENAS com um array JSON de IDs, ex: ["uuid-1", "uuid-2"].
Use exatamente os IDs fornecidos na lista de lugares. Se nenhum lugar for relevante, retorne [].

Cada lugar inclui "abertoAgora" (true/false) com base no horário atual em America/Sao_Paulo.
- Se a busca pedir lugares abertos, retorne só IDs com abertoAgora=true.
- Se a busca pedir lugares fechados, retorne só IDs com abertoAgora=false.
- Caso contrário, priorize relevância e não exclua por horário.`;

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
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const { data: lugares, error } = await supabase
      .from("lugares")
      .select("*, localizacoes(*), lugares_tags(tags(*))")
      .eq("status", "ativo");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const lugaresAtivos = lugares ?? [];
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
        } - ${resumo.descricao} - categoria: ${resumo.categoria}`,
        abertoAgora: resumo.abertoAgora,
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
      return NextResponse.json(
        { error: "Erro ao consultar a Claude API" },
        { status: 500 }
      );
    }

    const claudeData = JSON.parse(claudeRaw);
    const text = claudeData.content?.[0]?.text ?? "[]";
    const ids = parseIds(text);

    const lugaresPorId = new Map(lugaresAtivos.map((l) => [String(l.id), l]));
    let filtrados = ids
      .map((id) => lugaresPorId.get(String(id)))
      .filter(Boolean);

    filtrados = filtrarLugaresPorStatus(filtrados, filtroStatus);

    return NextResponse.json({
      lugares: filtrados,
      usage: access.usage ?? null,
      filtroStatus,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao processar a busca" },
      { status: 500 }
    );
  }
}
