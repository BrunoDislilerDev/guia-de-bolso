import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/premiumServer";

const CLAUDE_MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Você é moderador de avaliações de um app de turismo local 
em Imbituba, SC. Analise a avaliação e retorne APENAS um JSON válido 
sem markdown com:
{
  "sentimento": "positivo" | "neutro" | "negativo",
  "sugestao": "aprovar" | "rejeitar" | "revisar",
  "motivo": "explicação curta em português de até 100 caracteres",
  "spam": true | false
}
Rejeitar se: spam, palavrões, conteúdo irrelevante, propaganda.
Revisar se: vago demais, suspeito mas não claramente spam.
Aprovar se: experiência genuína, mesmo que negativa.`;

/**
 * @param {string} text
 * @returns {object|null}
 */
function parseModeracaoJson(text) {
  const trimmed = String(text || "").trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // tenta extrair objeto JSON
  }

  const matches = [...trimmed.matchAll(/\{[\s\S]*?\}/g)];
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      return JSON.parse(matches[i][0]);
    } catch {
      // continua
    }
  }

  return null;
}

/**
 * Pré-análise de avaliação com Claude após envio pelo usuário.
 * @param {import("next/server").NextRequest} request
 * @returns {Promise<import("next/server").NextResponse>}
 */
export async function POST(request) {
  try {
    const { avaliacao_id } = await request.json();

    if (!avaliacao_id) {
      return NextResponse.json({ error: "avaliacao_id obrigatório" }, { status: 400 });
    }

    const { user, supabase } = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { data: avaliacao, error: fetchError } = await supabase
      .from("avaliacoes")
      .select("*, lugares(nome, categoria)")
      .eq("id", avaliacao_id)
      .single();

    if (fetchError || !avaliacao) {
      return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 });
    }

    if (avaliacao.user_id !== user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const lugar = avaliacao.lugares || {};
    const aspectos = Array.isArray(avaliacao.aspectos)
      ? avaliacao.aspectos
      : avaliacao.aspectos
        ? [avaliacao.aspectos]
        : [];

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? CLAUDE_MODEL,
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Lugar: ${lugar.nome || "Desconhecido"} (${lugar.categoria || "—"})
Nota: ${avaliacao.nota}/5
Aspectos: ${JSON.stringify(aspectos)}
Comentário: "${avaliacao.comentario || "sem comentário"}"`,
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
    const text = claudeData.content?.[0]?.text ?? "";
    const resultado = parseModeracaoJson(text);

    if (!resultado) {
      return NextResponse.json(
        { error: "Resposta da IA inválida" },
        { status: 500 }
      );
    }

    const sentimento = String(resultado.sentimento || "neutro").toLowerCase();
    const sugestao = String(resultado.sugestao || "revisar").toLowerCase();
    const motivo = String(resultado.motivo || "").slice(0, 100);
    const spam = Boolean(resultado.spam);

    const updatePayload = {
      sentimento,
      sugestao_ia: `${sugestao}: ${motivo}`,
    };

    if (spam) {
      updatePayload.status = "rejeitado";
      updatePayload.motivo_rejeicao = "Rejeitado automaticamente: spam detectado pela IA";
    }

    const { error: updateError } = await supabase
      .from("avaliacoes")
      .update(updatePayload)
      .eq("id", avaliacao_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao analisar avaliação" },
      { status: 500 }
    );
  }
}
