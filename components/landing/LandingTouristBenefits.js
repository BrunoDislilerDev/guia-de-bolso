"use client";

import { motion } from "framer-motion";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { useLandingRevealMotion } from "@/components/landing/useLandingRichMotion";
import { LANDING_SECTION_IDS, LANDING_TOURIST_BENEFITS } from "@/lib/landingContent";

/**
 * Benefícios para turistas.
 * @returns {import('react').ReactElement}
 */
export default function LandingTouristBenefits() {
  const { reveal, stagger, viewport } = useLandingRevealMotion();

  return (
    <LandingSection id={LANDING_SECTION_IDS.turistas} tone="mist" bridge={false}>
      <LandingSectionHeader
        eyebrow="Turistas"
        title="Explore como um local."
        subtitle="Menos busca, mais vivência — com informação que importa na hora."
        center
      />

      <motion.ul
        className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-5"
        role="list"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        {LANDING_TOURIST_BENEFITS.map((item) => (
          <motion.li
            key={item.title}
            variants={reveal}
            className="landing-card-hover landing-fluid-panel p-8 sm:p-10"
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
