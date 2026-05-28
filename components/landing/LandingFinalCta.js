"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import { fadeUp, defaultViewport } from "@/components/landing/landingMotion";
import {
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";

/**
 * CTA final.
 * @returns {import('react').ReactElement}
 */
export default function LandingFinalCta() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40" aria-labelledby="landing-final-cta">
      <motion.div
        className="mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-[#1a4a3a] px-8 py-16 text-center sm:px-16 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,212,174,0.25),transparent_55%)]"
            aria-hidden
          />

          <h2
            id="landing-final-cta"
            className="relative font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl"
          >
            Pronto para conhecer Imbituba como um local?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base text-white/70 sm:text-lg">
            Cadastre seu negócio ou acompanhe o lançamento do app nas lojas.
          </p>

          <div className="relative mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <LandingButton href={`#${LANDING_SECTION_IDS.categorias}`} variant="secondary">
              Ver categorias
            </LandingButton>
            <LandingButton
              href={landingContactMailto("Cadastrar negócio")}
              variant="primary"
              external
              className="!bg-white !text-[#1a4a3a] hover:!bg-[#f0f4f3]"
            >
              Cadastrar meu negócio
            </LandingButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
