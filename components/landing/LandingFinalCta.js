"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import { fadeUp, defaultViewport } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS, landingContactMailto } from "@/lib/landingContent";

/**
 * CTA final — verde.
 * @returns {import('react').ReactElement}
 */
export default function LandingFinalCta() {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="landing-final-cta">
      <motion.div
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a4a3a] via-[#2d6b54] to-[#1a4a3a] px-8 py-14 text-center shadow-2xl shadow-[#1a4a3a]/25 sm:px-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#7fd4ae]/30 blur-2xl"
            aria-hidden
          />

          <h2
            id="landing-final-cta"
            className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Faça parte do Guia de Bolso
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#d4ede8]/90">
            Cadastre seu negócio hoje. O app para explorar a região chega em breve nas lojas
            oficiais.
          </p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LandingButton
              href={landingContactMailto("Quero fazer parte do Guia de Bolso")}
              variant="mint"
              external
            >
              Cadastrar Estabelecimento
            </LandingButton>
            <LandingButton href={`#${LANDING_SECTION_IDS.usuarios}`} variant="outlineLight">
              Ver curadoria
            </LandingButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
