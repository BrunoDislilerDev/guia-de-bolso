"use client";

import { motion } from "framer-motion";
import SectionReveal from "@/components/landing/SectionReveal";
import { FEATURE_ICONS } from "@/components/landing/LandingIcons";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_FEATURES, LANDING_SECTION_IDS } from "@/lib/landingContent";

/**
 * Grid de funcionalidades — paleta verde.
 * @returns {import('react').ReactElement}
 */
export default function LandingFeatures() {
  return (
    <SectionReveal
      id={LANDING_SECTION_IDS.funcionalidades}
      className="bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1a4a3a]">
            Funcionalidades
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
            O que o Guia de Bolso oferece
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">
            Pensado para turistas e moradores — e em breve no seu bolso, nas lojas oficiais.
          </p>
        </motion.div>

        <motion.ul
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {LANDING_FEATURES.map((feature, i) => {
            const Icon = FEATURE_ICONS[feature.id] ?? FEATURE_ICONS.geo;
            return (
              <motion.li
                key={feature.id}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group rounded-2xl border border-[#1a4a3a]/8 bg-[#f0f4f3]/50 p-6 transition-shadow hover:shadow-lg hover:shadow-[#1a4a3a]/10"
              >
                <motion.span
                  className="inline-flex rounded-2xl bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54] p-3.5 text-[#7fd4ae] shadow-md"
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
                  aria-hidden
                >
                  <Icon className="h-6 w-6" />
                </motion.span>
                <h3 className="mt-4 font-display text-lg font-bold text-[#1a2e28]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
                  {feature.description}
                </p>
                <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-wider text-[#1a4a3a]/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </SectionReveal>
  );
}
