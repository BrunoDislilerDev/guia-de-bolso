/** Cache CDN para respostas públicas de catálogo (segundos). */
export const LUGARES_API_S_MAXAGE = 300;
export const LUGARES_API_STALE = 600;

/**
 * Headers Cache-Control para GET /api/lugares.
 * @returns {HeadersInit}
 */
export function lugaresApiCacheHeaders() {
  return {
    "Cache-Control": `public, s-maxage=${LUGARES_API_S_MAXAGE}, stale-while-revalidate=${LUGARES_API_STALE}`,
  };
}
