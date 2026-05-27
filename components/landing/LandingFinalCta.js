"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import { fadeUp } from "@/components/landing/landingMotion";
import { landingContactMailto } from "@/lib/landingContent";

/**
 * CTA final da landing.
 * @returns {import('react').ReactElement}
 */
export default function LandingFinalCta() {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="landing-final-cta">
      <motion.div
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d5c7a] via-[#1a4a3a] to-[#2d6b52] px-8 py-14 text-center shadow-xl sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            aria-hidden="true"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#7fd4ae] blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#c4a574] blur-2xl" />
          </div>

          <h2
            id="landing-final-cta"
            className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Faça parte do Guia de Bolso
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85">
            Cadastre seu negócio ou comece a explorar Garopaba e Imbituba hoje — o litoral
            catarinense merece um guia feito por quem conhece a região.
          </p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LandingButton
              href={landingContactMailto("Quero fazer parte do Guia de Bolso")}
              variant="sand"
              external
            >
              Cadastrar Estabelecimento
            </LandingButton>
            <LandingButton href="/" variant="ghost">
              Explorar o Guia
            </LandingButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
