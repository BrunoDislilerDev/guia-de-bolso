"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { useLandingRevealMotion } from "@/components/landing/useLandingRichMotion";
import { landingContactMailto } from "@/lib/landingContent";
import { NEGOCIOS_PLANO_PARCEIRO } from "@/lib/negociosContent";

/**
 * Card do plano Parceiro — sem preço (geração de leads).
 * @returns {import('react').ReactElement}
 */
export default function NegociosPlans() {
  const { reveal, viewport } = useLandingRevealMotion();
  const plano = NEGOCIOS_PLANO_PARCEIRO;

  return (
    <LandingSection id="planos" tone="white" bridge={false}>
      <LandingSectionHeader
        eyebrow="Plano Parceiro"
        title="Visibilidade premium no guia oficial."
        subtitle="Para estabelecimentos que querem ser a primeira escolha do turista em Imbituba. Valores sob consulta."
        center
      />

      <motion.div
        className="mx-auto mt-14 max-w-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
      >
        <article className="landing-card-hover flex flex-col rounded-[1.5rem] bg-gradient-to-br from-[#0f2e24] to-[#1a4a3a] p-8 text-white ring-2 ring-[#f5e6b8]/40 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">{plano.nome}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{plano.descricao}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#f5e6b8]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7a6520]">
              Para negócios
            </span>
          </div>

          <p className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-[#f5e6b8]">
            {plano.notaLead}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2" role="list">
            {plano.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm text-white/85">
                <span className="shrink-0 font-bold text-[#7fd4ae]" aria-hidden>
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <LandingButton
            href={landingContactMailto(plano.mailtoSubject)}
            variant="secondary"
            className="mt-10 w-full !text-[#0d1f19]"
            external
          >
            {plano.cta}
          </LandingButton>
        </article>

        <p className="mt-6 text-center text-sm text-[#5c6f68]">
          O app é <strong>gratuito para turistas</strong>. Parceiros são estabelecimentos com plano
          comercial no guia.
        </p>
      </motion.div>
    </LandingSection>
  );
}
