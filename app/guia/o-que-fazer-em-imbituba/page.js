import Link from "next/link";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { CATEGORIAS_EXPLORE, getCategoriaHref } from "@/lib/categorias";
import { buildGuiaOQueFazerMetadata } from "@/lib/seo";
import { buildGuiaOQueFazerJsonLd } from "@/lib/seoJsonLd";

export const metadata = buildGuiaOQueFazerMetadata();

/**
 * Guia pilar SEO — o que fazer em Imbituba.
 * @returns {import('react').ReactElement}
 */
export default function GuiaOQueFazerPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <JsonLdScript data={buildGuiaOQueFazerJsonLd()} />
      <article className="mx-auto max-w-2xl px-6 py-10">
        <nav className="text-sm text-[#5a6b66]" aria-label="Breadcrumb">
          <Link href="/" className="text-[#1a4a3a] hover:underline">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span>Guia</span>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
          O que fazer em Imbituba, SC
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">
          Imbituba é um dos destinos mais procurados do litoral sul catarinense — entre
          praias urbanas, a região da <strong>Praia do Rosa</strong>, surf, gastronomia e
          natureza. Este guia resume o essencial; no{" "}
          <strong className="text-[#1a4a3a]">Guia de Bolso</strong> você encontra lugares
          verificados, horários e rotas atualizados.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[#1a2e28]">Melhores praias</h2>
        <p className="mt-3 text-base leading-relaxed text-[#5a6b66]">
          A <strong>Praia da Vila</strong> fica no centro e é ótima para um passeio rápido. A
          região da <strong>Praia do Rosa</strong> e <strong>Garopaba</strong> (vizinha) concentra
          paisagens e surf de nível mundial. <strong>Ibiraquera</strong> e outras praias da
          cidade oferecem águas calmas e trilhas — explore a categoria Natureza no guia.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[#1a2e28]">Gastronomia e onde comer</h2>
        <p className="mt-3 text-base leading-relaxed text-[#5a6b66]">
          De frutos do mar a cafés e bares, Imbituba tem oferta para todos os estilos. Use a
          listagem de <Link href={getCategoriaHref("Gastronomia")} className="font-semibold text-[#1a4a3a] underline-offset-2 hover:underline">Gastronomia em Imbituba</Link>{" "}
          para ver restaurantes com horário ao vivo e avaliações moderadas.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[#1a2e28]">Natureza, trilhas e aventura</h2>
        <p className="mt-3 text-base leading-relaxed text-[#5a6b66]">
          Trilhas, mirantes e experiências ao ar livre aparecem nas categorias{" "}
          <Link href={getCategoriaHref("Natureza")} className="font-semibold text-[#1a4a3a] underline-offset-2 hover:underline">Natureza</Link>{" "}
          e{" "}
          <Link href={getCategoriaHref("Aventura")} className="font-semibold text-[#1a4a3a] underline-offset-2 hover:underline">Aventura</Link>.
          Na temporada, a observação de baleias é um dos principais atrativos da região.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[#1a2e28]">Roteiro sugerido de 3 dias</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-relaxed text-[#5a6b66]">
          <li>
            <strong>Dia 1 — Praias:</strong> Praia da Vila + região do Rosa (pôr do sol).
          </li>
          <li>
            <strong>Dia 2 — Gastronomia e centro:</strong> almoço local, passeio e noite leve.
          </li>
          <li>
            <strong>Dia 3 — Natureza:</strong> trilha ou praia mais tranquila + café da manhã.
          </li>
        </ol>

        <h2 className="mt-10 text-xl font-bold text-[#1a2e28]">Explore por categoria</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {CATEGORIAS_EXPLORE.map((cat) => (
            <li key={cat.nome}>
              <Link
                href={getCategoriaHref(cat.nome)}
                className="block rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1a4a3a] ring-1 ring-[#e8eeee] hover:ring-[#1a4a3a]/20"
              >
                {cat.icone} {cat.nome}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-bold text-[#1a2e28]">Perguntas frequentes</h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-semibold text-[#1a2e28]">Guia de Bolso é o Guiabolso de finanças?</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[#5a6b66]">
              Não. Somos um app e site de <strong>turismo em Imbituba</strong>, sem relação com
              produtos financeiros.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#1a2e28]">Como achar lugares atualizados?</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[#5a6b66]">
              Abra o guia, filtre por categoria ou busque por nome — cada lugar tem mapa, horário e
              link para navegação.
            </dd>
          </div>
        </dl>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/categorias"
            className="rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-semibold text-white"
          >
            Explorar lugares
          </Link>
          <Link
            href="/imbituba"
            className="rounded-xl bg-white py-3.5 text-center text-sm font-semibold text-[#1a4a3a] ring-1 ring-[#e8eeee]"
          >
            Sobre Imbituba
          </Link>
        </div>
      </article>
    </div>
  );
}
