"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import { useLandingRevealMotion } from "@/components/landing/useLandingRichMotion";
import { useLandingNav } from "@/hooks/useLandingNav";
import { LANDING_SECTION_IDS } from "@/lib/landingContent";
import { NEGOCIOS_CONTACT_MAILTO, NEGOCIOS_HERO } from "@/lib/negociosContent";

/**
 * CTA final da página para anunciantes.
 * @returns {import('react').ReactElement}
 */
export default function NegociosFinalCta() {
  const { reveal, viewport } = useLandingRevealMotion();
  const { sectionHref } = useLandingNav();

  return (
    <section className="landing-section-flow py-20 sm:py-28">
      <motion.div
        className="mx-auto max-w-3xl px-5 text-center sm:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
      >
        <h2 className="landing-display text-[clamp(1.75rem,5vw,2.75rem)] font-semibold tracking-tight text-[#0a1612]">
          Pronto para aparecer no guia?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#5c6f68] sm:text-lg">
          Fale com nossa equipe — respondemos em até 1 dia útil com a proposta do plano Parceiro.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LandingButton href={NEGOCIOS_CONTACT_MAILTO} variant="primary" external>
            {NEGOCIOS_HERO.ctaPrimary}
          </LandingButton>
          <LandingButton href={sectionHref(LANDING_SECTION_IDS.negocios)} variant="ghost">
            Ver na página inicial
          </LandingButton>
        </div>
      </motion.div>
    </section>
  );
}
