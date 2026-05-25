import { NextResponse } from "next/server";
import { getClaudeModel } from "@/lib/anthropicConfig";
import { buildParceiroIdSet, fetchDestaquesVigentes } from "@/lib/destaques";
import { checkIaRateLimit } from "@/lib/iaRateLimit";
import { reportError } from "@/lib/observability";
import { checkRoteiroAccess, getAuthUser } from "@/lib/premiumServer";
import { selecionarLugaresParaRoteiro } from "@/lib/roteiroLugares";
import { supabase } from "@/lib/supabase";
import { buildApiErrorBody } from "@/lib/userMessages";

const SYSTEM_PROMPT = `Você é um especialista local em Imbituba, Santa Catarina.
Monte um roteiro personalizado usando APENAS lugares da lista fornecida (use o nome EXATO de cada lugar).
Siga RIGOROSAMENTE este formato markdown — cada parada precisa das 4 linhas após o nome:

# Dia 1 — Título curto e inspirador do dia

## 🌅 Manhã
**Nome Exato do Lugar**
→ O que fazer lá (1-2 frases objetivas)
💡 Dica local curta e útil
⏱️ ~2h

## ☀️ Tarde
**Outro Lugar da Lista**
→ Atividade clara
💡 Dica prática
⏱️ ~3h

## 🌙 Noite
**Lugar da Lista**
→ Atividade
💡 Dica
⏱️ ~2h

Regras obrigatórias:
- Repita o bloco completo (## período + parada com **nome**, →, 💡, ⏱️) para cada dia solicitado.
- Não deixe períodos vazios: se não houver lugar à noite, use outro período ou omita o bloco ## daquele período.
- Não invente lugares. Não use parágrafos soltos fora do formato.
- Tom amigável, português do Brasil, emojis apenas nos títulos ## de período.`;

/**
 * Generates a personalized multi-day itinerary via Claude from active places.
 * @param {import("next/server").NextRequest} request - JSON body: `{ dias, perfil, interesses }`.
 * @returns {Promise<import("next/server").NextResponse>} Markdown itinerary and usage metadata.
 */
export async function POST(request) {
  try {
    const { dias, perfil, interesses } = await request.json();

    if (!dias?.trim() || !perfil?.trim() || !interesses?.length) {
      return NextResponse.json(buildApiErrorBody("VALIDATION"), { status: 400 });
    }

    const { user } = await getAuthUser();

    const rate = checkIaRateLimit(request, user?.id);
    if (!rate.allowed) {
      return NextResponse.json(buildApiErrorBody("RATE_LIMITED"), {
        status: 429,
        headers: rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : undefined,
      });
    }

    const access = await checkRoteiroAccess(user?.id, { increment: true, user });

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

    const [{ data: lugaresRaw, error }, destaquesVigentes] = await Promise.all([
      supabase
        .from("lugares")
        .select("id, nome, descricao, categoria, subcategoria, lugares_tags(tags(nome))")
        .eq("status", "ativo"),
      fetchDestaquesVigentes(supabase),
    ]);

    if (error) {
      reportError(error, { route: "POST /api/roteiro supabase" });
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
    }

    const parceiroIds = buildParceiroIdSet(destaquesVigentes);
    const lugaresComParceiro = (lugaresRaw ?? []).map((lugar) => ({
      ...lugar,
      ehParceiro: parceiroIds.has(String(lugar.id)),
    }));

    const lugares = selecionarLugaresParaRoteiro(lugaresComParceiro, interesses);

    const interessesTexto = Array.isArray(interesses)
      ? interesses.join(", ")
      : String(interesses);

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: getClaudeModel(),
        max_tokens: 2400,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Roteiro de ${dias} | Perfil: ${perfil} | Interesses: ${interessesTexto}
Lugares (${lugares.length}): ${JSON.stringify(lugares)}`,
          },
        ],
      }),
    });

    const claudeRaw = await claudeResponse.text();

    if (!claudeResponse.ok) {
      reportError(new Error(`Claude HTTP ${claudeResponse.status}`), {
        route: "POST /api/roteiro",
      });
      return NextResponse.json(buildApiErrorBody("ROTEIRO_ERROR"), { status: 500 });
    }

    const claudeData = JSON.parse(claudeRaw);
    const conteudo = claudeData.content?.[0]?.text?.trim() ?? "";

    const lugaresCatalog = lugares.map((lugar) => ({
      id: String(lugar.id),
      nome: lugar.nome,
    }));

    return NextResponse.json({
      conteudo,
      titulo: `Roteiro ${dias} - ${perfil}`,
      lugaresCatalog,
      usage: access.usage ?? null,
    });
  } catch (err) {
    reportError(err, { route: "POST /api/roteiro" });
    return NextResponse.json(buildApiErrorBody("ROTEIRO_ERROR"), { status: 500 });
  }
}
