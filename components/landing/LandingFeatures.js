"use client";

import { motion } from "framer-motion";
import SectionReveal from "@/components/landing/SectionReveal";
import { FEATURE_ICONS } from "@/components/landing/LandingIcons";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_FEATURES, LANDING_SECTION_IDS } from "@/lib/landingContent";

/**
 * Grid de funcionalidades do app.
 * @returns {import('react').ReactElement}
 */
export default function LandingFeatures() {
  return (
    <SectionReveal
      id={LANDING_SECTION_IDS.funcionalidades}
      className="bg-[#f8fbfa] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0d5c7a]">
            Funcionalidades
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
            O que o Guia de Bolso oferece
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">
            Tudo que você precisa para descobrir a região ou colocar seu negócio no radar de
            quem chega.
          </p>
        </div>

        <motion.ul
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {LANDING_FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.id] ?? FEATURE_ICONS.geo;
            return (
              <motion.li
                key={feature.id}
                variants={fadeUp}
                className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#0d5c7a]/8 transition-shadow hover:shadow-md"
              >
                <span
                  className="inline-flex rounded-xl bg-gradient-to-br from-[#e8f4f8] to-[#e2f0e8] p-3 text-[#0d5c7a]"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-[#1a2e28]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
                  {feature.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </SectionReveal>
  );
}
