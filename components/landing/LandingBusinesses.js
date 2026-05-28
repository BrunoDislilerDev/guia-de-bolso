"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import SectionReveal from "@/components/landing/SectionReveal";
import { scaleIn, fadeUp, defaultViewport } from "@/components/landing/landingMotion";
import {
  LANDING_BUSINESS_BENEFITS,
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";

/**
 * Seção para estabelecimentos — verde.
 * @returns {import('react').ReactElement}
 */
export default function LandingBusinesses() {
  return (
    <SectionReveal
      id={LANDING_SECTION_IDS.estabelecimentos}
      className="relative overflow-hidden bg-gradient-to-b from-[#1a4a3a] to-[#0f3028] py-20 text-white sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      >
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#7fd4ae]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7fd4ae]">
            Para estabelecimentos
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Coloque seu negócio no mapa
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#d4ede8]/90">
            Restaurantes, pousadas, lojas e serviços: apareça no guia oficial entre Garopaba e
            Imbituba e receba turistas com perfil completo.
          </p>

          <ul className="mt-8 space-y-4" role="list">
            {LANDING_BUSINESS_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-3">
                <span
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7fd4ae] text-xs font-bold text-[#0c241c]"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-sm leading-relaxed sm:text-base text-[#f0f4f3]/95">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <LandingButton
              href={landingContactMailto("Cadastrar meu estabelecimento")}
              variant="mint"
              external
            >
              Cadastrar meu Estabelecimento
            </LandingButton>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-sm"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={scaleIn}
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[2rem] bg-[#7fd4ae]/20 p-3 ring-1 ring-[#7fd4ae]/30"
          >
            <div className="overflow-hidden rounded-[1.6rem] bg-[#f0f4f3]">
              <div className="flex items-center justify-between border-b border-[#1a4a3a]/10 bg-white px-4 py-3">
                <span className="text-xs font-bold text-[#1a4a3a]">Guia de Bolso</span>
                <span className="h-2 w-2 rounded-full bg-[#7fd4ae]" />
              </div>
              <div className="space-y-3 p-4">
                <div className="h-28 rounded-xl bg-gradient-to-br from-[#1a4a3a] to-[#7fd4ae]/60" />
                <p className="font-display text-sm font-bold text-[#1a2e28]">Seu negócio aqui</p>
                <span className="inline-block rounded-full bg-[#7fd4ae] px-3 py-1 text-[10px] font-bold text-[#0c241c]">
                  Parceiro verificado
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-lg bg-[#d4ede8]" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
