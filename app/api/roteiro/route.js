import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CLAUDE_MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Você é um especialista local em Imbituba, Santa Catarina.
Monte um roteiro detalhado e personalizado baseado APENAS nos lugares fornecidos.
Para cada dia sugira manhã, tarde e noite.
Para cada período: nome do lugar (exatamente como no banco), o que fazer lá, dica local e tempo sugerido.
Tom amigável, local e autêntico. Em português do Brasil.
Formato markdown com emojis. Não invente lugares fora da lista.`;

export async function POST(request) {
  try {
    const { dias, perfil, interesses } = await request.json();

    if (!dias?.trim() || !perfil?.trim() || !interesses?.length) {
      return NextResponse.json(
        { error: "Informe dias, perfil e interesses." },
        { status: 400 }
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
      .select("id, nome, descricao, categoria, subcategoria, lugares_tags(tags(nome))")
      .eq("status", "ativo");

    if (error) {
      console.error("Supabase lugares error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const lugares = (lugaresRaw ?? []).map((lugar) => ({
      id: lugar.id,
      nome: lugar.nome,
      descricao: lugar.descricao,
      categoria: lugar.categoria,
      subcategoria: lugar.subcategoria,
      tags: (lugar.lugares_tags ?? [])
        .map((item) => item.tags?.nome)
        .filter(Boolean),
    }));

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
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Monte um roteiro de ${dias} para ${perfil} com interesse em ${interessesTexto}.
Lugares disponíveis: ${JSON.stringify(lugares)}`,
          },
        ],
      }),
    });

    const claudeRaw = await claudeResponse.text();

    if (!claudeResponse.ok) {
      console.error("Claude error:", claudeResponse.status, claudeRaw);
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
    });
  } catch (err) {
    console.error("Roteiro API error:", err);
    return NextResponse.json(
      { error: "Erro interno ao gerar roteiro" },
      { status: 500 }
    );
  }
}
