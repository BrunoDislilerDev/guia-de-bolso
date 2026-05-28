import Link from "next/link";
import { LANDING_BUSINESS_BENEFITS, landingContactMailto } from "@/lib/landingContent";
import { buildParaNegociosMetadata } from "@/lib/seo";

export const metadata = buildParaNegociosMetadata();

/**
 * Landing B2B — cadastro de estabelecimentos.
 * @returns {import('react').ReactElement}
 */
export default function ParaNegociosPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0d1f19]">
      <article className="mx-auto max-w-2xl px-6 py-10">
        <nav className="text-sm text-[#5c6f68]" aria-label="Breadcrumb">
          <Link href="/" className="text-[#1a4a3a] hover:underline">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span>Para negócios</span>
        </nav>

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#1a4a3a]/75">
          Guia de Bolso · Imbituba, SC
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Cadastre seu negócio no guia turístico de Imbituba
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#5c6f68]">
          Restaurantes, pousadas, serviços e comércio: apareça quando turistas buscam o que fazer
          em Imbituba. Planos gratuitos e premium com mais visibilidade, fotos e destaque no app.
        </p>

        <ul className="mt-8 space-y-4">
          {LANDING_BUSINESS_BENEFITS.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-[rgba(13,31,25,0.06)] bg-white p-5"
            >
              <h2 className="text-base font-semibold text-[#0d1f19]">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#5c6f68]">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-[#5c6f68]">
          Também atendemos estabelecimentos na região da Praia do Rosa e litoral sul. O Guia de
          Bolso é focado em <strong>turismo local</strong> — não confundir com Guiabolso
          (finanças).
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={landingContactMailto("Cadastrar meu negócio — Guia de Bolso")}
            className="rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-semibold text-white"
          >
            Falar com a equipe
          </a>
          <Link
            href="/#negocios"
            className="rounded-xl bg-white py-3.5 text-center text-sm font-semibold text-[#1a4a3a] ring-1 ring-[rgba(13,31,25,0.08)]"
          >
            Ver planos na página inicial
          </Link>
        </div>
      </article>
    </div>
  );
}
