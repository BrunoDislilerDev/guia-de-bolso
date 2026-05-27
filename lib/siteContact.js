/** Domínio público e canais oficiais do Guia de Bolso. */

export const SITE_DOMAIN = "guiadebolso.app";

export const SITE_PUBLIC_URL = `https://${SITE_DOMAIN}`;

export const SITE_CONTACT_EMAIL = "contato@guiadebolso.app";

/** @type {{ instagram: string, tiktok: string }} */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/guiadebolsoimbituba/",
  tiktok: "https://www.tiktok.com/@guiadebolsoimbituba",
};

/**
 * Hostname para exibição (PDF, rodapés).
 * @param {string} [siteUrl]
 * @returns {string}
 */
export function getSiteDisplayDomain(siteUrl = SITE_PUBLIC_URL) {
  try {
    return new URL(siteUrl).hostname.replace(/^www\./, "");
  } catch {
    return SITE_DOMAIN;
  }
}
