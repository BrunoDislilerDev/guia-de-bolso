const LUGAR_SELECT = "*, localizacoes(*), lugares_tags(tags(*))";

/**
 * Busca lugares mais favoritados; faz fallback para os mais recentes se não houver dados.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {number} [limit=5] - Quantidade máxima de lugares.
 * @returns {Promise<Array<Object>>}
 */
export async function fetchLugaresPopulares(supabase, limit = 5) {
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

  const counts = {};
  favoritos.forEach(({ lugar_id }) => {
    if (!lugar_id) return;
    counts[lugar_id] = (counts[lugar_id] || 0) + 1;
  });

  const topIds = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) {
    return fetchLugaresFallback(supabase, limit);
  }

  const { data: lugares, error: lugaresError } = await supabase
    .from("lugares")
    .select(LUGAR_SELECT)
    .in("id", topIds)
    .eq("status", "ativo");

  if (lugaresError) {
    console.error("Erro ao buscar lugares populares:", lugaresError);
    return [];
  }

  return (lugares ?? []).sort(
    (a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)
  );
}

/**
 * Fallback: lugares ativos mais recentes quando não há favoritos suficientes.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {number} limit
 * @returns {Promise<Array<Object>>}
 */
async function fetchLugaresFallback(supabase, limit) {
  const { data } = await supabase
    .from("lugares")
    .select(LUGAR_SELECT)
    .eq("status", "ativo")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
