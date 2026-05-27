import { getLugarPublicUrl as lugarPathToAbsoluteUrl } from "./lugarPublicPath.js";

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
 * URL pública do detalhe do lugar (prefere slug).
 * @param {{ id?: string, slug?: string|null }|string} lugarOrId - Lugar ou UUID legado.
 * @param {string} origin
 * @param {string|null} [ref]
 * @returns {string}
 */
export function buildLugarPublicUrl(lugarOrId, origin, ref = null) {
  const base = String(origin || "").replace(/\/$/, "");
  const lugar =
    typeof lugarOrId === "object" && lugarOrId !== null
      ? lugarOrId
      : { id: String(lugarOrId) };
  const url = lugarPathToAbsoluteUrl(lugar, base);
  if (!ref) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}ref=${encodeURIComponent(ref)}`;
}
