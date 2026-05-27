import { SITE_DOMAIN } from "./siteContact.js";

/** Hostnames que exibem apenas o site de marketing (landing + legal). */
export const MARKETING_HOSTS = new Set([SITE_DOMAIN, `www.${SITE_DOMAIN}`]);

/** Rotas permitidas no domínio de marketing (sem prefixo de locale). */
export const PUBLIC_MARKETING_PATHS = new Set([
  "/",
  "/landing",
  "/termos",
  "/privacidade",
  "/robots.txt",
  "/sitemap.xml",
]);

/**
 * @param {string} [host] - Host do request (sem porta).
 * @returns {boolean}
 */
export function isMarketingHost(host) {
  if (!host) return false;
  const normalized = host.toLowerCase().split(":")[0];
  return MARKETING_HOSTS.has(normalized);
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function isPublicMarketingPath(pathname) {
  return PUBLIC_MARKETING_PATHS.has(pathname);
}

/**
 * @param {import('next/server').NextRequest} request
 * @returns {string}
 */
export function getRequestHostname(request) {
  return request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
}

/** @typedef {"rewrite-landing" | "redirect-root" | "redirect-home" | "continue"} MarketingRouteAction */

/**
 * Decide a ação do middleware no domínio de marketing.
 * @param {string} pathname
 * @returns {MarketingRouteAction}
 */
export function getMarketingRouteAction(pathname) {
  if (pathname === "/landing") return "redirect-root";
  if (pathname === "/") return "rewrite-landing";
  if (!isPublicMarketingPath(pathname)) return "redirect-home";
  return "continue";
}
