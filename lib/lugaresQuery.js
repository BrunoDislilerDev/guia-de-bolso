/** Select completo com joins usados na home e listagens. */
export const LUGAR_SELECT_FULL = "*, localizacoes(*), lugares_tags(tags(*))";

/** Select enxuto para cards e listagens (menos payload). */
export const LUGAR_SELECT_LIST =
  "id, nome, descricao, categoria, subcategoria, imagem_url, fotos, status, eh_parceiro, conteudo_curadoria, created_at, localizacoes(latitude, longitude, endereco), lugares_tags(tags(id, nome))";

/** Select mínimo se join/RLS de tabelas relacionadas falhar. */
export const LUGAR_SELECT_BASE = "*";

/**
 * Busca lugares ativos; tenta select completo e faz fallback para `*`.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{ limit?: number, eq?: Record<string, string> }} [options]
 * @returns {Promise<{ data: object[], error: import('@supabase/supabase-js').PostgrestError | null }>}
 */
export async function queryLugaresAtivos(
  supabase,
  { limit = 50, eq = {}, select = LUGAR_SELECT_LIST } = {}
) {
  let query = supabase
    .from("lugares")
    .select(select)
    .eq("status", "ativo")
    .limit(limit);

  for (const [column, value] of Object.entries(eq)) {
    query = query.eq(column, value);
  }

  const full = await query;
  if (!full.error) {
    return { data: full.data ?? [], error: null };
  }

  console.warn("[lugares] select enxuto falhou:", full.error.message);

  const fullJoin = await supabase
    .from("lugares")
    .select(LUGAR_SELECT_FULL)
    .eq("status", "ativo")
    .limit(limit);

  if (!fullJoin.error) {
    return { data: fullJoin.data ?? [], error: null };
  }

  console.warn("[lugares] select com joins falhou, usando *:", fullJoin.error.message);

  let fallbackQuery = supabase
    .from("lugares")
    .select(LUGAR_SELECT_BASE)
    .eq("status", "ativo")
    .limit(limit);

  for (const [column, value] of Object.entries(eq)) {
    fallbackQuery = fallbackQuery.eq(column, value);
  }

  const basic = await fallbackQuery;
  return { data: basic.data ?? [], error: basic.error };
}

/**
 * Busca lugares ativos por lista de ids (ex.: populares por favoritos).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {Array<string|number>} ids
 * @returns {Promise<{ data: object[], error: import('@supabase/supabase-js').PostgrestError | null }>}
 */
export async function queryLugaresByIds(supabase, ids) {
  const idList = ids.filter((id) => id !== null && id !== undefined);
  if (idList.length === 0) {
    return { data: [], error: null };
  }

  const full = await supabase
    .from("lugares")
    .select(LUGAR_SELECT_FULL)
    .in("id", idList)
    .eq("status", "ativo");

  if (!full.error) {
    return { data: full.data ?? [], error: null };
  }

  const basic = await supabase
    .from("lugares")
    .select(LUGAR_SELECT_BASE)
    .in("id", idList)
    .eq("status", "ativo");

  return { data: basic.data ?? [], error: basic.error };
}
