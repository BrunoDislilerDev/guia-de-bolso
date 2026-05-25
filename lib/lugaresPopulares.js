import { queryLugaresAtivos, queryLugaresByIds } from "@/lib/lugaresQuery";
import { fetchLugaresFromApi } from "@/lib/fetchLugaresApi";

/**
 * Busca lugares populares via API (leitura anon no servidor).
 * @param {import('@supabase/supabase-js').SupabaseClient} [_supabase] - Mantido por compatibilidade.
 * @param {number} [limit=5]
 * @returns {Promise<Array<Object>>}
 */
export async function fetchLugaresPopulares(_supabase, limit = 5) {
  return fetchLugaresFromApi({ mode: "populares", limit });
}

/**
 * Lógica de populares no servidor (favoritos + fallback).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {number} [limit=5]
 * @returns {Promise<Array<Object>>}
 */
export async function fetchLugaresPopularesForClient(supabase, limit = 5) {
  const { data: ranked, error: rpcError } = await supabase.rpc("lugares_populares_ids", {
    p_limit: limit,
  });

  let topIds = [];
  const counts = {};

  if (!rpcError && ranked?.length) {
    ranked.forEach((row) => {
      if (!row?.lugar_id) return;
      topIds.push(row.lugar_id);
      counts[row.lugar_id] = Number(row.favoritos_count) || 0;
    });
  } else {
    if (rpcError && rpcError.code !== "PGRST202") {
      console.warn("[populares] RPC indisponível, fallback scan:", rpcError.message);
    }

    const { data: favoritos, error: favoritosError } = await supabase
      .from("favoritos")
      .select("lugar_id");

    if (favoritosError) {
      console.error("Erro ao buscar favoritos:", favoritosError);
      return fetchLugaresFallback(supabase, limit);
    }

    if (!favoritos?.length) {
      return fetchLugaresFallback(supabase, limit);
    }

    favoritos.forEach(({ lugar_id }) => {
      if (!lugar_id) return;
      counts[lugar_id] = (counts[lugar_id] || 0) + 1;
    });

    topIds = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }

  if (topIds.length === 0) {
    return fetchLugaresFallback(supabase, limit);
  }

  const { data: lugares, error: lugaresError } = await queryLugaresByIds(supabase, topIds);

  if (lugaresError) {
    console.error("Erro ao buscar lugares populares:", lugaresError);
    return fetchLugaresFallback(supabase, limit);
  }

  return lugares.sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));
}

/**
 * Fallback: lugares ativos mais recentes quando não há favoritos suficientes.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {number} limit
 * @returns {Promise<Array<Object>>}
 */
async function fetchLugaresFallback(supabase, limit) {
  const { data, error } = await queryLugaresAtivos(supabase, { limit });
  if (error) {
    console.error("Erro no fallback de lugares:", error);
    return [];
  }
  return data;
}
