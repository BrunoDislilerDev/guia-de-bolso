import { fetchPublicSitemapEntries } from "@/lib/sitemapData";
import { getSiteUrl } from "@/lib/siteUrl";
import { SITE_PUBLIC_URL } from "@/lib/siteContact";

/**
 * Sitemap público: em produção inclui hubs SEO, categorias, lugares e rotas.
 * @returns {Promise<import('next').MetadataRoute.Sitemap>}
 */
export default async function sitemap() {
  const base = getSiteUrl();
  const now = new Date();
  const isMarketingProduction = base === SITE_PUBLIC_URL;

  if (isMarketingProduction) {
    return fetchPublicSitemapEntries();
  }

  /** Preview/local: marketing + entradas SEO (mesmo conjunto). */
  const entries = await fetchPublicSitemapEntries();
  const hasLanding = entries.some((e) => e.url === `${base}/landing`);
  if (!hasLanding) {
    entries.push({
      url: `${base}/landing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }
  return entries;
}
