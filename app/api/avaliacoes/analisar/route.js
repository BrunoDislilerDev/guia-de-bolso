import { NextResponse } from "next/server";
import { getClaudeModel } from "@/lib/anthropicConfig";
import { checkIaRateLimit } from "@/lib/iaRateLimit";
import { reportError } from "@/lib/observability";
import { parseJsonObjectFromText } from "@/lib/parseModelJson";
import { getAuthUser } from "@/lib/premiumServer";
import { buildApiErrorBody } from "@/lib/userMessages";

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
 * Pré-análise de avaliação com Claude após envio pelo usuário.
 * @param {import("next/server").NextRequest} request
 * @returns {Promise<import("next/server").NextResponse>}
 */
export async function POST(request) {
  try {
    const { avaliacao_id } = await request.json();

    if (!avaliacao_id) {
      return NextResponse.json(
        { ...buildApiErrorBody("VALIDATION"), error: "Identificador da avaliação é obrigatório." },
        { status: 400 }
      );
    }

    const { user, supabase } = await getAuthUser();
    if (!user) {
      return NextResponse.json(buildApiErrorBody("UNAUTHORIZED"), { status: 401 });
    }

    const rate = checkIaRateLimit(request, user.id);
    if (!rate.allowed) {
      return NextResponse.json(buildApiErrorBody("RATE_LIMITED"), {
        status: 429,
        headers: rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : undefined,
      });
    }

    const { data: avaliacao, error: fetchError } = await supabase
      .from("avaliacoes")
      .select("*, lugares(nome, categoria)")
      .eq("id", avaliacao_id)
      .single();

    if (fetchError || !avaliacao) {
      return NextResponse.json(buildApiErrorBody("NOT_FOUND"), { status: 404 });
    }

    if (avaliacao.user_id !== user.id) {
      return NextResponse.json(buildApiErrorBody("FORBIDDEN"), { status: 403 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
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
        model: getClaudeModel(),
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
      reportError(new Error(`Claude HTTP ${claudeResponse.status}`), {
        route: "POST /api/avaliacoes/analisar",
      });
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
    }

    const claudeData = JSON.parse(claudeRaw);
    const text = claudeData.content?.[0]?.text ?? "";
    const resultado = parseJsonObjectFromText(text);

    if (!resultado) {
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
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
      reportError(updateError, { route: "POST /api/avaliacoes/analisar update" });
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    reportError(err, { route: "POST /api/avaliacoes/analisar" });
    return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
  }
}
