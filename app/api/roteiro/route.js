import { NextResponse } from "next/server";
import { checkRoteiroAccess, getAuthUser } from "@/lib/premiumServer";
import { selecionarLugaresParaRoteiro } from "@/lib/roteiroLugares";
import { supabase } from "@/lib/supabase";

const CLAUDE_MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Você é um especialista local em Imbituba e Garopaba, Santa Catarina.
Monte um roteiro personalizado usando APENAS os lugares da lista (nome exato).
Use EXATAMENTE este formato markdown:

# Dia 1 — Título curto do dia

## 🌅 Manhã
**Nome do Lugar**
→ O que fazer lá (1-2 frases)
💡 Dica local curta
⏱️ ~2h

## ☀️ Tarde
**Outro Lugar**
→ Atividade
💡 Dica
⏱️ ~3h

## 🌙 Noite
**Lugar**
→ Atividade
💡 Dica
⏱️ ~2h

Repita para cada dia. Tom amigável, emojis, português do Brasil. Não invente lugares.`;

/**
 * Generates a personalized multi-day itinerary via Claude from active places.
 * @param {import("next/server").NextRequest} request - JSON body: `{ dias, perfil, interesses }`.
 * @returns {Promise<import("next/server").NextResponse>} Markdown itinerary and usage metadata.
 */
export async function POST(request) {
  try {
    const { dias, perfil, interesses } = await request.json();

    if (!dias?.trim() || !perfil?.trim() || !interesses?.length) {
      return NextResponse.json(
        { error: "Informe dias, perfil e interesses." },
        { status: 400 }
      );
    }

    const { user } = await getAuthUser();
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
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const { data: lugaresRaw, error } = await supabase
      .from("lugares")
      .select("id, nome, descricao, categoria, subcategoria, destaque, lugares_tags(tags(nome))")
      .eq("status", "ativo");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const lugares = selecionarLugaresParaRoteiro(lugaresRaw, interesses);

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
        model: process.env.ANTHROPIC_MODEL ?? CLAUDE_MODEL,
        max_tokens: 1400,
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
      return NextResponse.json(
        { error: "Erro ao consultar a Claude API" },
        { status: 500 }
      );
    }

    const claudeData = JSON.parse(claudeRaw);
    const conteudo = claudeData.content?.[0]?.text ?? "";

    return NextResponse.json({
      conteudo,
      titulo: `Roteiro ${dias} - ${perfil}`,
      usage: access.usage ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao gerar roteiro" },
      { status: 500 }
    );
  }
}
