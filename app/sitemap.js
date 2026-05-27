import { CATEGORIAS_EXPLORE, getCategoriaHref } from "@/lib/categorias";
import { getLugarPublicPath } from "@/lib/lugarPublicPath";
import { getSiteUrl } from "@/lib/siteUrl";
import { getAnonServerClient } from "@/lib/supabaseAnonServer";

/** @type {import('next').MetadataRoute.Sitemap} */
export default async function sitemap() {
  const base = getSiteUrl();
  const now = new Date();

  /** @type {import('next').MetadataRoute.Sitemap} */
  const entries = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/categorias`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/imbituba`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/landing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/rotas`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const cat of CATEGORIAS_EXPLORE) {
    entries.push({
      url: `${base}${getCategoriaHref(cat.nome)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  const supabase = getAnonServerClient();
  if (supabase) {
    const { data: lugares } = await supabase
      .from("lugares")
      .select("id, slug, created_at")
      .eq("status", "ativo")
      .limit(500);

    for (const lugar of lugares ?? []) {
      entries.push({
        url: `${base}${getLugarPublicPath(lugar)}`,
        lastModified: lugar.created_at ? new Date(lugar.created_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    const { data: rotas } = await supabase
      .from("rotas")
      .select("id, created_at")
      .eq("ativa", true)
      .limit(200);

    for (const rota of rotas ?? []) {
      entries.push({
        url: `${base}/rotas/${rota.id}`,
        lastModified: rota.created_at ? new Date(rota.created_at) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
