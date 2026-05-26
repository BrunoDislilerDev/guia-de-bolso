/**
 * Badges e flags de parceiro / curadoria em lugares.
 */

export const BADGE_PARCEIRO_LABEL = "Parceiro do Guia";
export const BADGE_CURADORIA_LABEL = "Curadoria do Guia";

/**
 * @param {object|null|undefined} lugar
 * @returns {boolean}
 */
export function isParceiro(lugar) {
  return Boolean(lugar?.eh_parceiro);
}

/**
 * @param {object|null|undefined} lugar
 * @returns {boolean}
 */
export function isConteudoCuradoria(lugar) {
  return Boolean(lugar?.conteudo_curadoria);
}

/**
 * @param {object|null|undefined} lugar
 * @returns {object}
 */
export function enrichLugarFlags(lugar) {
  if (!lugar) return lugar;
  const ehParceiro = isParceiro(lugar);
  const ehCuradoria = isConteudoCuradoria(lugar);
  return {
    ...lugar,
    eh_parceiro: ehParceiro,
    ehParceiro,
    conteudo_curadoria: ehCuradoria,
    ehCuradoria,
  };
}

/**
 * @param {Array<object>} [lugares]
 * @returns {Array<object>}
 */
export function enrichLugaresFlags(lugares) {
  return (lugares ?? []).map((lugar) => enrichLugarFlags(lugar));
}

/**
 * @returns {string}
 */
export function getBadgeParceiroLabel() {
  return BADGE_PARCEIRO_LABEL;
}

/**
 * @returns {string}
 */
export function getBadgeCuradoriaLabel() {
  return BADGE_CURADORIA_LABEL;
}
