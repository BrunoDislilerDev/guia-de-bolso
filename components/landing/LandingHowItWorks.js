"use client";

import { motion } from "framer-motion";
import { LandingSectionHeader } from "@/components/landing/LandingSection";
import LandingSection from "@/components/landing/LandingSection";
import { useLandingRevealMotion } from "@/components/landing/useLandingRichMotion";
import { LANDING_SECTION_IDS, LANDING_STEPS } from "@/lib/landingContent";

/**
 * Como funciona — 3 passos, layout editorial.
 * @returns {import('react').ReactElement}
 */
export default function LandingHowItWorks() {
  const { reveal, stagger, viewport } = useLandingRevealMotion();

  return (
    <LandingSection id={LANDING_SECTION_IDS.comoFunciona} tone="white" bridge={false}>
      <LandingSectionHeader
        eyebrow="Como funciona"
        title="Simples. Rápido. Local."
        subtitle="Três passos até o lugar certo."
        center
      />

      <motion.ol
        className="mt-20 grid gap-8 sm:grid-cols-3 sm:gap-6"
        role="list"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        {LANDING_STEPS.map((step) => (
          <motion.li
            key={step.step}
            variants={reveal}
            className="landing-card-hover landing-fluid-panel relative rounded-[1.35rem] p-8 sm:p-9"
          >
            <span className="font-display text-sm font-semibold tracking-widest text-[#7fd4ae]">
              {step.step}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-[#0d1f19]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5c6f68]">{step.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </LandingSection>
  );
}
