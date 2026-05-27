"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import { easeOut, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS, landingContactMailto } from "@/lib/landingContent";

/**
 * Hero da landing — gradiente litorâneo, sem imagens externas.
 * @returns {import('react').ReactElement}
 */
export default function LandingHero() {
  return (
    <section
      className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28"
      aria-labelledby="landing-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4f8] via-[#f5ebe0] to-[#e2f0e8]" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#2d9cdb]/20 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#7fd4ae]/25 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-[#c4a574]/20 blur-2xl" />
        <svg
          className="absolute bottom-0 left-0 right-0 text-[#0d5c7a]/8"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,64 C240,120 480,0 720,48 C960,96 1200,32 1440,72 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-bold uppercase tracking-[0.2em] text-[#0d5c7a]"
        >
          Garopaba · Imbituba · Santa Catarina
        </motion.p>

        <motion.h1
          id="landing-hero-title"
          variants={fadeUp}
          className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-[#1a2e28] sm:text-5xl lg:text-6xl"
        >
          O guia local que conecta{" "}
          <span className="text-[#0d5c7a]">negócios</span> e{" "}
          <span className="text-[#2d6b52]">quem explora</span> o litoral
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-[#5a6b66] sm:text-xl"
        >
          Guia de Bolso reúne praias, restaurantes, serviços e rotas da região — com
          curadoria local, horários em tempo real e busca inteligente para turistas e
          moradores.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          <LandingButton
            href={landingContactMailto("Quero cadastrar meu negócio")}
            variant="primary"
            external
          >
            Quero Cadastrar meu Negócio
          </LandingButton>
          <LandingButton href={`#${LANDING_SECTION_IDS.usuarios}`} variant="secondary">
            Conhecer o app
          </LandingButton>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-14 grid gap-4 sm:grid-cols-3"
          transition={{ delay: 0.2, ease: easeOut }}
        >
          {[
            { label: "Curadoria local", value: "Lugares verificados" },
            { label: "Para negócios", value: "Cadastro gratuito" },
            { label: "Para visitantes", value: "Busca e rotas" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/60 px-4 py-3 ring-1 ring-[#0d5c7a]/10 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0d5c7a]">
                {item.label}
              </p>
              <p className="mt-0.5 text-sm font-medium text-[#1a2e28]">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
