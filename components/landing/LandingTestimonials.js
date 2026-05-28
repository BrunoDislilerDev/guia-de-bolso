"use client";

import { motion } from "framer-motion";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS, LANDING_TESTIMONIALS } from "@/lib/landingContent";

/**
 * Depoimentos — editorial.
 * @returns {import('react').ReactElement}
 */
export default function LandingTestimonials() {
  return (
    <LandingSection id={LANDING_SECTION_IDS.depoimentos} className="bg-white">
      <LandingSectionHeader eyebrow="Depoimentos" title="Quem usa, recomenda." center />

      <motion.ul
        className="mt-16 grid gap-6 md:grid-cols-3"
        role="list"
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        {LANDING_TESTIMONIALS.map((t) => (
          <motion.li
            key={t.name}
            variants={fadeUp}
            className="flex flex-col rounded-[1.25rem] bg-[#fafaf9] p-8 ring-1 ring-[rgba(13,31,25,0.05)]"
          >
            <p className="flex-1 font-display text-lg font-medium leading-snug tracking-tight text-[#0d1f19]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="mt-8 border-t border-[#1a4a3a]/8 pt-6">
              <cite className="not-italic">
                <span className="block text-sm font-semibold text-[#0d1f19]">{t.name}</span>
                <span className="mt-0.5 block text-xs text-[#8a9b94]">{t.role}</span>
              </cite>
            </footer>
          </motion.li>
        ))}
      </motion.ul>
    </LandingSection>
  );
}
