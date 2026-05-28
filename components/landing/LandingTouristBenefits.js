"use client";

import { motion } from "framer-motion";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS, LANDING_TOURIST_BENEFITS } from "@/lib/landingContent";

/**
 * Benefícios para turistas.
 * @returns {import('react').ReactElement}
 */
export default function LandingTouristBenefits() {
  return (
    <LandingSection id={LANDING_SECTION_IDS.turistas} className="bg-[#fafaf9]">
      <LandingSectionHeader
        eyebrow="Para quem visita"
        title="Conheça Imbituba com quem mora aqui."
        center
      />

      <motion.ul
        className="mt-16 grid gap-px overflow-hidden rounded-[1.25rem] bg-[rgba(13,31,25,0.06)] sm:grid-cols-2"
        role="list"
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        {LANDING_TOURIST_BENEFITS.map((item) => (
          <motion.li
            key={item.title}
            variants={fadeUp}
            className="bg-white p-8 sm:p-10"
          >
            <h3 className="font-display text-lg font-semibold tracking-tight text-[#0d1f19]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5c6f68]">{item.body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </LandingSection>
  );
}
