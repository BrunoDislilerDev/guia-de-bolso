import Link from "next/link";
import GuiaRelatedNav from "@/components/guia/GuiaRelatedNav";
import { getGuiaIndexLinks } from "@/lib/guiaCatalog";
import { buildGuiaIndexMetadata } from "@/lib/seo";

export const metadata = buildGuiaIndexMetadata();

/**
 * Índice de guias SEO — turismo em Imbituba.
 * @returns {import('react').ReactElement}
 */
export default function GuiaIndexPage() {
  const guides = getGuiaIndexLinks();

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <article className="mx-auto max-w-2xl px-6 py-10">
        <nav className="text-sm text-[#5a6b66]" aria-label="Breadcrumb">
          <Link href="/" className="text-[#1a4a3a] hover:underline">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span>Guias</span>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
          Guias de turismo em Imbituba
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">
          Artigos para planejar sua viagem ao litoral sul de Santa Catarina — praias, Praia do
          Rosa, gastronomia e roteiros. Curadoria do{" "}
          <strong className="text-[#1a4a3a]">Guia de Bolso Imbituba</strong> (app de turismo
          local, sem relação com Guiabolso finanças).
        </p>

        <GuiaRelatedNav title="Todos os guias" links={guides} className="mt-10" />

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/guia/o-que-fazer-em-imbituba"
            className="rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-semibold text-white"
          >
            Começar: o que fazer em Imbituba
          </Link>
          <Link
            href="/categorias"
            className="rounded-xl bg-white py-3.5 text-center text-sm font-semibold text-[#1a4a3a] ring-1 ring-[#e8eeee]"
          >
            Explorar lugares
          </Link>
          <Link
            href="/sobre"
            className="rounded-xl bg-white py-3.5 text-center text-sm font-semibold text-[#1a4a3a] ring-1 ring-[#e8eeee]"
          >
            Sobre o Guia de Bolso
          </Link>
        </div>
      </article>
    </div>
  );
}
