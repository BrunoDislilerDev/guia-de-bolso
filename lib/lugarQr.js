/** Categorias sem QR Code (locais públicos / natureza). */
export const CATEGORIAS_EXCLUIDAS_QR = new Set(["Natureza", "Aventura"]);

/**
 * Estabelecimento elegível para QR Code (todas categorias exceto Natureza e Aventura).
 * @param {{ categoria?: string }|null|undefined} lugar
 * @returns {boolean}
 */
export function isLugarElegivelQr(lugar) {
  if (!lugar) return false;
  return !CATEGORIAS_EXCLUIDAS_QR.has(lugar.categoria || "");
}

/**
 * URL curta impressa no QR (GET /q/{slug}).
 * @param {string} slug
 * @param {string} origin
 * @returns {string}
 */
export function buildQrUrl(slug, origin) {
  const base = String(origin || "").replace(/\/$/, "");
  return `${base}/q/${encodeURIComponent(slug)}`;
}

/**
 * URL pública do detalhe do lugar.
 * @param {string|number} id
 * @param {string} origin
 * @param {string|null} [ref]
 * @returns {string}
 */
export function buildLugarPublicUrl(id, origin, ref = null) {
  const base = String(origin || "").replace(/\/$/, "");
  const url = `${base}/lugares/${id}`;
  if (!ref) return url;
  return `${url}?ref=${encodeURIComponent(ref)}`;
}
