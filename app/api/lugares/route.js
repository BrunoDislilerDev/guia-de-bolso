import { NextResponse } from "next/server";
import { queryLugaresAtivos, queryLugaresByIds } from "@/lib/lugaresQuery";
import { fetchDestaquesVigentes } from "@/lib/destaques";
import { fetchLugaresPopularesForClient } from "@/lib/lugaresPopulares";
import { getAnonServerClient } from "@/lib/supabaseAnonServer";

/**
 * GET /api/lugares — leitura pública de lugares ativos (role anon no servidor).
 * Query: limit, categoria, ids (csv), mode=populares
 */
export async function GET(request) {
  const supabase = getAnonServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase não configurado no servidor." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  if (mode === "destaques") {
    try {
      const destaques = await fetchDestaquesVigentes(supabase);
      return NextResponse.json({ destaques });
    } catch (err) {
      console.error("[api/lugares] destaques:", err);
      return NextResponse.json(
        { error: err?.message ?? "Erro ao carregar destaques" },
        { status: 500 }
      );
    }
  }

  if (mode === "populares") {
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 8, 1), 50);
    try {
      const lugares = await fetchLugaresPopularesForClient(supabase, limit);
      return NextResponse.json({ lugares });
    } catch (err) {
      console.error("[api/lugares] populares:", err);
      return NextResponse.json(
        { error: err?.message ?? "Erro ao carregar lugares populares" },
        { status: 500 }
      );
    }
  }

  const idsParam = searchParams.get("ids");
  if (idsParam) {
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    const { data, error } = await queryLugaresByIds(supabase, ids);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ lugares: data });
  }

  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 100);
  const categoria = searchParams.get("categoria")?.trim();
  const eq = categoria ? { categoria } : {};
  const { data, error } = await queryLugaresAtivos(supabase, { limit, eq });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lugares: data });
}
