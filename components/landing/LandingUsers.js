"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import SectionReveal from "@/components/landing/SectionReveal";
import { IconCompass } from "@/components/landing/LandingIcons";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS, LANDING_USER_BENEFITS } from "@/lib/landingContent";

/**
 * Seção para usuários finais.
 * @returns {import('react').ReactElement}
 */
export default function LandingUsers() {
  return (
    <SectionReveal
      id={LANDING_SECTION_IDS.usuarios}
      className="bg-gradient-to-b from-[#e8f4f8]/60 to-[#f5ebe0]/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2d6b52]">
              Para usuários
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
              Explore a região como um local
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">
              Turistas e moradores usam o mesmo guia: descubra o que fazer agora, planeje
              rotas e chegue lá com um toque.
            </p>
          </div>
          <LandingButton href="/" variant="primary">
            Explorar agora
          </LandingButton>
        </div>

        <motion.ul
          className="mt-12 grid gap-5 sm:grid-cols-2"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {LANDING_USER_BENEFITS.map((benefit, index) => (
            <motion.li
              key={benefit}
              variants={fadeUp}
              className="flex gap-4 rounded-2xl bg-white/80 p-5 ring-1 ring-[#0d5c7a]/10 backdrop-blur-sm"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d5c7a] text-white"
                aria-hidden="true"
              >
                {index === 0 ? (
                  <IconCompass className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </span>
              <p className="text-sm leading-relaxed text-[#1a2e28] sm:text-base">{benefit}</p>
            </motion.li>
          ))}
        </motion.ul>

        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-dashed border-[#0d5c7a]/20 bg-white/50 px-6 py-8"
          aria-label="Destaques da região"
        >
          {["Praia do Rosa", "Garopaba", "Imbituba", "Praia da Vila", "Ibiraquera"].map(
            (place) => (
              <span
                key={place}
                className="rounded-full bg-[#0d5c7a]/10 px-4 py-1.5 text-xs font-semibold text-[#0d5c7a]"
              >
                {place}
              </span>
            )
          )}
        </div>
      </div>
    </SectionReveal>
  );
}
