import { notFound } from "next/navigation";
import GuiaArticle from "@/components/guia/GuiaArticle";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getAllGuiaSlugs, getGuiaBySlug } from "@/lib/guiaCatalog";
import { fetchGuiaPlacesByCategoria } from "@/lib/guiaPageData";
import { buildGuiaMetadata } from "@/lib/seo";
import { buildGuiaArticleJsonLd } from "@/lib/seoJsonLd";

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 * @returns {Promise<import('next').Metadata>}
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuiaBySlug(slug);

  if (!guide) {
    return { title: "Guia não encontrado | Guia de Bolso", robots: { index: false, follow: false } };
  }

  return buildGuiaMetadata(guide);
}

/** @returns {Promise<{ slug: string }[]>} */
export async function generateStaticParams() {
  return getAllGuiaSlugs().map((slug) => ({ slug }));
}

/**
 * Artigo de guia SEO — /guia/[slug]
 * @param {{ params: Promise<{ slug: string }> }} props
 * @returns {Promise<import('react').ReactElement>}
 */
export default async function GuiaSlugPage({ params }) {
  const { slug } = await params;
  const guide = getGuiaBySlug(slug);

  if (!guide) notFound();

  const places = guide.listPlacesCategory
    ? await fetchGuiaPlacesByCategoria(guide.listPlacesCategory, guide.listPlacesLimit ?? 10)
    : [];

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <JsonLdScript data={buildGuiaArticleJsonLd(guide)} />
      <GuiaArticle guide={guide} places={places} />
    </div>
  );
}
