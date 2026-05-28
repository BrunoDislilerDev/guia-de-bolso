import Link from "next/link";
import Logo from "@/components/Logo";
import { IconInstagram, IconMail, IconTikTok } from "@/components/landing/LandingIcons";
import {
  LANDING_CONTACT_EMAIL,
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";
import { SITE_DOMAIN, SOCIAL_LINKS } from "@/lib/siteContact";

const SOCIAL_LINKS_LIST = [
  { label: "Instagram do Guia de Bolso", href: SOCIAL_LINKS.instagram, Icon: IconInstagram },
  { label: "TikTok do Guia de Bolso", href: SOCIAL_LINKS.tiktok, Icon: IconTikTok },
];

/**
 * Rodapé da landing — verde escuro.
 * @returns {import('react').ReactElement}
 */
export default function LandingFooter() {
  return (
    <footer
      id={LANDING_SECTION_IDS.contato}
      className="border-t border-[#7fd4ae]/15 bg-[#071612] text-[#d4ede8]"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo size="md" variant="light" showWordmark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#a8bdb8]">
              Guia de Bolso — descoberta local entre Garopaba e Imbituba, com curadoria
              catarinense e dados reais da região.
            </p>
            <p className="mt-3 text-sm">
              <a
                href={`https://${SITE_DOMAIN}`}
                className="font-medium text-[#7fd4ae] hover:text-white"
                rel="noopener noreferrer"
              >
                {SITE_DOMAIN}
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#7fd4ae]">
              Legal e contato
            </h2>
            <ul className="mt-4 space-y-2 text-sm" role="list">
              <li>
                <Link href="/termos" className="text-[#c8ddd8] transition-colors hover:text-white">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-[#c8ddd8] transition-colors hover:text-white"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a
                  href={landingContactMailto()}
                  className="inline-flex items-center gap-2 text-[#c8ddd8] transition-colors hover:text-white"
                >
                  <IconMail className="h-4 w-4" aria-hidden />
                  Contato
                </a>
              </li>
            </ul>
            <p className="mt-3 text-xs text-[#7a9a94]">
              <a href={`mailto:${LANDING_CONTACT_EMAIL}`} className="hover:text-[#7fd4ae]">
                {LANDING_CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#7fd4ae]">
              Redes sociais
            </h2>
            <ul className="mt-4 flex gap-3" role="list" aria-label="Redes sociais">
              {SOCIAL_LINKS_LIST.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-xl bg-[#7fd4ae]/10 p-2.5 text-[#7fd4ae] transition-colors hover:bg-[#7fd4ae]/20 hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-[#7a9a94]">
          © {new Date().getFullYear()} Guia de Bolso · Garopaba e Imbituba, SC
        </p>
      </div>
    </footer>
  );
}
