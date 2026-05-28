"use client";

import { motion } from "framer-motion";
import { LandingSectionHeader } from "@/components/landing/LandingSection";
import LandingSection from "@/components/landing/LandingSection";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS, LANDING_STEPS } from "@/lib/landingContent";

/**
 * Como funciona — 3 passos, layout editorial.
 * @returns {import('react').ReactElement}
 */
export default function LandingHowItWorks() {
  return (
    <LandingSection id={LANDING_SECTION_IDS.comoFunciona} className="relative bg-white">
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
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        {LANDING_STEPS.map((step) => (
          <motion.li
            key={step.step}
            variants={fadeUp}
            className="landing-card-hover landing-surface-soft relative rounded-[1.25rem] p-8"
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
