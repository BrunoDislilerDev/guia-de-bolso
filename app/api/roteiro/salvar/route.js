import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    if (!titulo?.trim() || !dias?.trim() || !perfil?.trim() || !conteudo?.trim()) {
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
        dias: dias.trim(),
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
