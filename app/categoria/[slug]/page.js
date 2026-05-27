import { notFound } from "next/navigation";
import CategoriaPageClient from "@/components/categoria/CategoriaPageClient";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getCategoriaByNome, getCategoriaHref } from "@/lib/categorias";
import { queryLugaresAtivos } from "@/lib/lugaresQuery";
import { buildCategoriaMetadata } from "@/lib/seo";
import { buildCategoriaJsonLd } from "@/lib/seoJsonLd";
import { createClient } from "@/lib/supabase/server";

/**
 * @param {string} raw
 * @returns {string}
 */
function decodeCategoriaSlug(raw) {
  try {
    return decodeURIComponent(String(raw ?? "").trim());
  } catch {
    return String(raw ?? "").trim();
  }
}

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 * @returns {Promise<import('next').Metadata>}
 */
export async function generateMetadata({ params }) {
  const categoria = decodeCategoriaSlug((await params).slug);
  const meta = getCategoriaByNome(categoria);

  if (!meta) {
    return {
      title: `Categoria | Guia de Bolso`,
      robots: { index: false, follow: false },
    };
  }

  return buildCategoriaMetadata(categoria);
}

/**
 * Listagem pública por categoria — SSR inicial + metadata.
 * @param {{ params: Promise<{ slug: string }> }} props
 * @returns {Promise<import('react').ReactElement>}
 */
export default async function CategoriaPage({ params }) {
  const categoria = decodeCategoriaSlug((await params).slug);
  const meta = getCategoriaByNome(categoria);

  if (!meta) notFound();

  const supabase = await createClient();

  const [{ data: lugares, error: lugaresError }, { data: subcategorias }] = await Promise.all([
    queryLugaresAtivos(supabase, { eq: { categoria }, limit: 100 }),
    supabase.from("subcategorias").select("*").eq("categoria", categoria).order("nome"),
  ]);

  if (lugaresError) {
    console.error("[categoria] lugares:", lugaresError.message);
  }

  const countLabel = `${(lugares ?? []).length} locais em ${categoria}, Imbituba`;

  return (
    <>
      <JsonLdScript data={buildCategoriaJsonLd(categoria, meta.descricao)} />
      <CategoriaPageClient
        categoria={categoria}
        categoriaDescricao={meta.descricao}
        lugaresCount={(lugares ?? []).length}
        initialLugares={lugares ?? []}
        initialSubcategorias={subcategorias ?? []}
        seoHeader={
          <header className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-[#1a2e28]">{categoria} em Imbituba</h1>
            <p className="mt-1 text-sm leading-relaxed text-[#5a6b66]">{meta.descricao}</p>
            <p className="mt-2 text-sm font-medium text-[#1a4a3a]">{countLabel}</p>
          </header>
        }
      />
    </>
  );
}
