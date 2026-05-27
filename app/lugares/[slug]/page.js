import { notFound, permanentRedirect } from "next/navigation";
import JsonLdScript from "@/components/seo/JsonLdScript";
import LugarPageClient from "@/components/lugar/LugarPageClient";
import LugarSeoStatic from "@/components/lugar/LugarSeoStatic";
import { fetchLugarSeoBundle } from "@/lib/lugarSeoData";
import { isLugarUuidParam } from "@/lib/lugarPublicPath";
import { buildLugarMetadata } from "@/lib/seo";
import { buildLugarBreadcrumbJsonLd, buildLugarJsonLd, toJsonLdGraph } from "@/lib/seoJsonLd";
import { createClient } from "@/lib/supabase/server";

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 * @returns {Promise<import('next').Metadata>}
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { lugar } = await fetchLugarSeoBundle(supabase, slug);

  if (!lugar) {
    return {
      title: `Lugar não encontrado | Guia de Bolso`,
      robots: { index: false, follow: false },
    };
  }

  return buildLugarMetadata(lugar);
}

/**
 * Detalhe público do lugar — URL canônica por slug; UUID legado redireciona 301.
 * @param {{ params: Promise<{ slug: string }>, searchParams: Promise<Record<string, string|string[]|undefined>> }} props
 * @returns {Promise<import('react').ReactElement>}
 */
export default async function LugarPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { lugar, localizacao, rating, error } = await fetchLugarSeoBundle(supabase, slug);

  if (error) {
    console.error("[lugares] fetch:", error.message);
    notFound();
  }

  if (!lugar) notFound();

  if (isLugarUuidParam(slug) && lugar.slug) {
    const target = new URL(
      `/lugares/${encodeURIComponent(lugar.slug)}`,
      "http://local"
    );
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => target.searchParams.append(key, v));
      } else {
        target.searchParams.set(key, value);
      }
    }
    const path = `${target.pathname}${target.search}`;
    permanentRedirect(path);
  }

  const jsonLd = toJsonLdGraph([
    buildLugarJsonLd(lugar, localizacao, rating ?? undefined),
    buildLugarBreadcrumbJsonLd(lugar),
  ]);

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <LugarSeoStatic
        nome={lugar.nome}
        descricao={lugar.descricao || lugar.descricao_longa}
        categoria={lugar.categoria}
      />
      <LugarPageClient lugarId={lugar.id} />
    </>
  );
}
