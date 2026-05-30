/** Caminho da landing marketing (home pública). */
export function getMarketingHomePath() {
  if (process.env.NODE_ENV === "development") return "/landing";
  return "/";
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function isLandingHomePath(pathname) {
  return pathname === "/" || pathname === "/landing";
}

/**
 * Href de seção da landing — relativo na home, absoluto em subpáginas (ex.: /para-negocios).
 * @param {string} pathname
 * @param {string} sectionId
 * @returns {string}
 */
export function resolveLandingSectionHref(pathname, sectionId) {
  if (isLandingHomePath(pathname)) return `#${sectionId}`;
  return `${getMarketingHomePath()}#${sectionId}`;
}

/** @typedef {{ label: string, href?: string, sectionId?: string }} LandingNavItem */

/** @type {LandingNavItem[]} */
export const LANDING_NAV_ITEMS = [
  { label: "Explorar", sectionId: "categorias" },
  { label: "Experiência", sectionId: "app" },
  { label: "Anunciantes", href: "/para-negocios" },
  { label: "Parceiros", sectionId: "parceiros" },
];

/**
 * @param {string} pathname
 * @param {LandingNavItem} item
 * @returns {string}
 */
export function resolveLandingNavHref(pathname, item) {
  if (item.href) return item.href;
  if (item.sectionId) return resolveLandingSectionHref(pathname, item.sectionId);
  return getMarketingHomePath();
}

/**
 * @param {string} pathname
 * @param {string} [sectionId]
 * @returns {string}
 */
export function resolveMarketingHomeHref(pathname, sectionId) {
  if (sectionId) return resolveLandingSectionHref(pathname, sectionId);
  return getMarketingHomePath();
}
