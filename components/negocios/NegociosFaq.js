"use client";

import { motion } from "framer-motion";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { useLandingRevealMotion } from "@/components/landing/useLandingRichMotion";
import { NEGOCIOS_FAQ, NEGOCIOS_ONBOARDING_STEPS } from "@/lib/negociosContent";

/**
 * Passo a passo de onboarding B2B.
 * @returns {import('react').ReactElement}
 */
export function NegociosHowItWorks() {
  const { reveal, stagger, viewport } = useLandingRevealMotion();

  return (
    <LandingSection id="como-funciona" tone="canvas" bridge={false}>
      <LandingSectionHeader
        eyebrow="Simples"
        title="Do contato à publicação."
        subtitle="Nossa equipe cuida do cadastro — você foca no atendimento."
        center
      />

      <motion.ol
        className="mt-14 grid gap-6 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        {NEGOCIOS_ONBOARDING_STEPS.map((step) => (
          <motion.li
            key={step.step}
            variants={reveal}
            className="landing-fluid-panel rounded-[1.35rem] p-8 text-center"
          >
            <span className="landing-display text-3xl font-semibold text-[#1a4a3a]/25">
              {step.step}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-[#0a1612]">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6f68]">{step.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </LandingSection>
  );
}

/**
 * FAQ para anunciantes.
 * @returns {import('react').ReactElement}
 */
export default function NegociosFaq() {
  const { reveal, stagger, viewport } = useLandingRevealMotion();

  return (
    <LandingSection id="faq" tone="mist" bridge={false}>
      <LandingSectionHeader
        eyebrow="Dúvidas"
        title="Perguntas frequentes."
        subtitle="Tudo o que estabelecimentos costumam perguntar antes de anunciar."
        center
      />

      <motion.dl
        className="mx-auto mt-14 max-w-3xl space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        {NEGOCIOS_FAQ.map((item) => (
          <motion.div
            key={item.pergunta}
            variants={reveal}
            className="landing-fluid-panel rounded-[1.25rem] p-6"
          >
            <dt className="font-display text-base font-semibold text-[#0a1612]">{item.pergunta}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[#5c6f68]">{item.resposta}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </LandingSection>
  );
}
