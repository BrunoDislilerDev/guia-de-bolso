import { SITE_PUBLIC_URL } from "./siteContact.js";

const DEFAULT_SITE_URL = SITE_PUBLIC_URL;

/**
 * Base URL do app (QR, redirects, links absolutos).
 * @param {string|null|undefined} [requestOrigin] - `request.nextUrl.origin` em Route Handlers.
 * @returns {string}
 */
export function getSiteUrl(requestOrigin) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (requestOrigin) return String(requestOrigin).replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  return DEFAULT_SITE_URL;
}

/**
 * Origem para uso no client (admin QR preview).
 * @returns {string}
 */
export function getClientSiteUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  return getSiteUrl();
}
