import { getSiteUrl } from "@/lib/siteUrl";
import { SITE_PUBLIC_URL } from "@/lib/siteContact";

/**
 * Sitemap público: no domínio de produção (guiadebolso.app) só marketing + legal.
 * @type {import('next').MetadataRoute.Sitemap}
 */
export default function sitemap() {
  const base = getSiteUrl();
  const now = new Date();
  const isMarketingProduction = base === SITE_PUBLIC_URL;

  if (isMarketingProduction) {
    return [
      { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
      { url: `${base}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
      {
        url: `${base}/privacidade`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];
  }

  /** Preview/local: mantém entradas úteis para dev (app web ainda acessível no host). */
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/landing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
