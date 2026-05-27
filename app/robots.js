import { getSiteUrl } from "@/lib/siteUrl";

/** @type {import('next').MetadataRoute.Robots} */
export default function robots() {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/perfil/", "/login", "/favoritos", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
