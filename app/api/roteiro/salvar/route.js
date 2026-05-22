import { NextResponse } from "next/server";
import { parseDiasViagem } from "@/lib/roteiroDias";
import { createClient } from "@/lib/supabase/server";

/**
 * Persists a generated itinerary for the authenticated user.
 * @param {import("next/server").NextRequest} request - JSON body with titulo, dias, perfil, interesses, conteudo.
 * @returns {Promise<import("next/server").NextResponse>} Saved roteiro or error.
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Faça login para salvar o roteiro." }, { status: 401 });
    }

    const { titulo, dias, perfil, interesses, conteudo } = await request.json();

    const diasNumero = parseDiasViagem(dias);

    if (!titulo?.trim() || diasNumero === null || !perfil?.trim() || !conteudo?.trim()) {
      return NextResponse.json(
        { error: "Dados incompletos para salvar o roteiro." },
        { status: 400 }
      );
    }

    const { data: roteiro, error } = await supabase
      .from("roteiros")
      .insert({
        user_id: user.id,
        titulo: titulo.trim(),
        dias: diasNumero,
        perfil: perfil.trim(),
        interesses: Array.isArray(interesses) ? interesses : [],
        conteudo: conteudo.trim(),
      })
      .select("id, titulo, dias, perfil, interesses, conteudo, created_at")
      .single();

    if (error) {
      console.error("Erro ao salvar roteiro:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, roteiro });
  } catch (err) {
    console.error("Salvar roteiro error:", err);
    return NextResponse.json(
      { error: "Erro interno ao salvar roteiro" },
      { status: 500 }
    );
  }
}
