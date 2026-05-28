import Link from "next/link";
import GuiaPlacesList from "@/components/guia/GuiaPlacesList";
import GuiaRelatedNav from "@/components/guia/GuiaRelatedNav";

/**
 * @typedef {import('@/lib/guiaCatalog').GuiaGuide} GuiaGuide
 * @typedef {import('@/lib/guiaPageData').GuiaPlaceCard} GuiaPlaceCard
 */

/**
 * Artigo de guia SEO — layout compartilhado.
 * @param {object} props
 * @param {GuiaGuide} props.guide
 * @param {GuiaPlaceCard[]} [props.places]
 * @returns {import('react').ReactElement}
 */
export default function GuiaArticle({ guide, places = [] }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-10">
      <nav className="text-sm text-[#5a6b66]" aria-label="Breadcrumb">
        <Link href="/" className="text-[#1a4a3a] hover:underline">
          Início
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guia" className="text-[#1a4a3a] hover:underline">
          Guias
        </Link>
        <span className="mx-2">/</span>
        <span className="line-clamp-1">{guide.title}</span>
      </nav>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">{guide.intro}</p>

      {guide.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e28]">{section.heading}</h2>
          {section.paragraphs.map((para) => (
            <p key={para.slice(0, 40)} className="mt-3 text-base leading-relaxed text-[#5a6b66]">
              {para}
            </p>
          ))}
          {section.links && section.links.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#1a4a3a] ring-1 ring-[#e8eeee] hover:ring-[#1a4a3a]/25"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {places.length > 0 && (
        <GuiaPlacesList
          title={`Lugares no Guia de Bolso${guide.listPlacesCategory ? ` · ${guide.listPlacesCategory}` : ""}`}
          places={places}
        />
      )}

      {guide.faq && guide.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e28]">Perguntas frequentes</h2>
          <dl className="mt-4 space-y-4">
            {guide.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-[#1a2e28]">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#5a6b66]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <GuiaRelatedNav title="Outros guias" links={guide.relatedGuides} className="mt-10" />

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href={guide.ctaPrimary.href}
          className="rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-semibold text-white"
        >
          {guide.ctaPrimary.label}
        </Link>
        {guide.ctaSecondary && (
          <Link
            href={guide.ctaSecondary.href}
            className="rounded-xl bg-white py-3.5 text-center text-sm font-semibold text-[#1a4a3a] ring-1 ring-[#e8eeee]"
          >
            {guide.ctaSecondary.label}
          </Link>
        )}
      </div>
    </article>
  );
}
