"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import SectionReveal from "@/components/landing/SectionReveal";
import { scaleIn } from "@/components/landing/landingMotion";
import {
  LANDING_BUSINESS_BENEFITS,
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";

/**
 * Seção para estabelecimentos.
 * @returns {import('react').ReactElement}
 */
export default function LandingBusinesses() {
  return (
    <SectionReveal
      id={LANDING_SECTION_IDS.estabelecimentos}
      className="py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c4a574]">
            Para estabelecimentos
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
            Coloque seu negócio no mapa
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">
            Restaurantes, lojas, serviços e hospedagens: apareça para quem está na região de
            Garopaba e Imbituba e construa presença digital com o guia oficial da área.
          </p>

          <ul className="mt-8 space-y-4" role="list">
            {LANDING_BUSINESS_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-3 text-[#1a2e28]">
                <span
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2d6b52] text-xs text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="text-sm leading-relaxed sm:text-base">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <LandingButton
              href={landingContactMailto("Cadastrar meu estabelecimento")}
              variant="sand"
              external
            >
              Cadastrar meu Estabelecimento
            </LandingButton>
          </div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={scaleIn}
          aria-hidden="true"
        >
          <div className="relative rounded-[2rem] bg-gradient-to-br from-[#0d5c7a] to-[#1a4a3a] p-3 shadow-2xl shadow-[#0d5c7a]/30">
            <div className="overflow-hidden rounded-[1.6rem] bg-[#f0f4f3]">
              <div className="flex items-center justify-between border-b border-[#0d5c7a]/10 bg-white px-4 py-3">
                <div className="h-2 w-12 rounded-full bg-[#0d5c7a]/20" />
                <div className="h-2 w-2 rounded-full bg-[#7fd4ae]" />
              </div>
              <div className="space-y-3 p-4">
                <div className="h-28 rounded-xl bg-gradient-to-br from-[#2d9cdb]/40 via-[#7fd4ae]/30 to-[#c4a574]/40" />
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded-md bg-[#1a2e28]/15" />
                  <div className="h-2 w-1/2 rounded-md bg-[#5a6b66]/20" />
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-[#7fd4ae]/40 px-3 py-1 text-[10px] font-semibold text-[#1a4a3a]">
                    Aberto agora
                  </span>
                  <span className="rounded-full bg-[#c4a574]/30 px-3 py-1 text-[10px] font-semibold text-[#1a2e28]">
                    ★ 4,8
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-gradient-to-br from-[#e8f4f8] to-[#e2f0e8]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#0d5c7a] shadow-lg ring-1 ring-[#0d5c7a]/10">
            Perfil completo
          </div>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
