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
    <LandingSection id={LANDING_SECTION_IDS.turistas} className="relative bg-white">
      <LandingSectionHeader
        eyebrow="Turistas"
        title="Explore como um local."
        subtitle="Menos busca, mais vivência — com informação que importa na hora."
        center
      />

      <motion.ul
        className="landing-surface-soft mt-16 grid gap-px overflow-hidden rounded-[1.5rem] bg-[rgba(13,31,25,0.04)] sm:grid-cols-2"
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
            className="landing-card-hover bg-white/80 p-8 backdrop-blur-sm sm:p-10"
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
