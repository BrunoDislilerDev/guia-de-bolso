import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CLAUDE_MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Você é um assistente do app Guia de Bolso, um guia local de Garopaba e Imbituba.
Com base nos lugares disponíveis, retorne os IDs dos lugares mais relevantes
para a busca do usuário. Responda APENAS com um array JSON de IDs, ex: ["uuid-1", "uuid-2"].
Use exatamente os IDs fornecidos na lista de lugares. Se nenhum lugar for relevante, retorne [].`;

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

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({ lugares: [] });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY ausente — verifique .env.local");
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const { data: lugares, error } = await supabase.from("lugares").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const lugaresResumo = (lugares ?? []).map((l) => ({
      id: l.id,
      nome: l.nome,
      descricao: l.descricao,
      categoria: l.categoria,
    }));

    const requestBody = {
      model: process.env.ANTHROPIC_MODEL ?? CLAUDE_MODEL,
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Lugares disponíveis:\n${JSON.stringify(lugaresResumo)}\n\nBusca do usuário: ${query.trim()}`,
        },
      ],
    };

    console.log("Claude request model:", requestBody.model);

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

    console.log("Claude response status:", claudeResponse.status);
    console.log("Claude response body:", claudeRaw);

    if (!claudeResponse.ok) {
      return NextResponse.json(
        { error: "Erro ao consultar a Claude API" },
        { status: 500 }
      );
    }

    const claudeData = JSON.parse(claudeRaw);
    const text = claudeData.content?.[0]?.text ?? "[]";
    const ids = parseIds(text);

    console.log("Claude parsed IDs:", ids);

    const lugaresPorId = new Map((lugares ?? []).map((l) => [String(l.id), l]));
    const filtrados = ids
      .map((id) => lugaresPorId.get(String(id)))
      .filter(Boolean);

    console.log("Lugares retornados:", filtrados.length);

    return NextResponse.json({ lugares: filtrados });
  } catch (err) {
    console.error("Buscar error:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar a busca" },
      { status: 500 }
    );
  }
}
