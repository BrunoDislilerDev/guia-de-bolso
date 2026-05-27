import { AVALIACAO_STATUS_APROVADOS } from "@/lib/avaliacoes";
import { fetchLugarAtivoByRouteParam } from "@/lib/lugarPublicPath";

const LUGAR_SEO_SELECT = "*, localizacoes(*)";

/**
 * @param {object} lugar
 * @returns {object|null}
 */
export function getLocalizacaoFromLugar(lugar) {
  const loc = lugar?.localizacoes;
  if (Array.isArray(loc)) return loc[0] ?? null;
  return loc ?? null;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} lugarId
 * @returns {Promise<{ media: number, count: number }|null>}
 */
export async function fetchLugarRatingSummary(supabase, lugarId) {
  const { data, error } = await supabase
    .from("avaliacoes")
    .select("nota")
    .eq("lugar_id", lugarId)
    .in("status", AVALIACAO_STATUS_APROVADOS);

  if (error || !data?.length) return null;

  const count = data.length;
  const sum = data.reduce((acc, row) => acc + (Number(row.nota) || 0), 0);
  return { count, media: sum / count };
}

/**
 * Lugar + localização + resumo de avaliações para SEO/JSON-LD.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} routeParam
 */
export async function fetchLugarSeoBundle(supabase, routeParam) {
  const { data: lugar, error } = await fetchLugarAtivoByRouteParam(
    supabase,
    routeParam,
    LUGAR_SEO_SELECT
  );

  if (error) {
    return { lugar: null, localizacao: null, rating: null, error };
  }

  if (!lugar) {
    return { lugar: null, localizacao: null, rating: null, error: null };
  }

  const localizacao = getLocalizacaoFromLugar(lugar);
  const rating = await fetchLugarRatingSummary(supabase, lugar.id);

  return { lugar, localizacao, rating, error: null };
}
