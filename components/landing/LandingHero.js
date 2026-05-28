"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LandingButton from "@/components/landing/LandingButton";
import LandingStatsBar from "@/components/landing/LandingStatsBar";
import { fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING } from "@/components/landing/landingTheme";
import { LANDING_SECTION_IDS, landingContactMailto } from "@/lib/landingContent";

/**
 * Hero — verde escuro, stats dinâmicos, animações.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingPageData['stats']} props.stats
 * @param {boolean} props.hasLiveData
 * @returns {import('react').ReactElement}
 */
export default function LandingHero({ stats, hasLiveData }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20"
      aria-labelledby="landing-hero-title"
      style={{ background: LANDING.gradientHero }}
    >
      <motion.div
        style={{ y: yBg, opacity }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#7fd4ae]/15 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#2d6b54]/40 blur-3xl" />
        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#7fd4ae]/10 blur-2xl"
        />
      </motion.div>

      <motion.div
        className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-[#7fd4ae]/30 bg-[#7fd4ae]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#7fd4ae]"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7fd4ae]" aria-hidden />
          Garopaba · Imbituba · SC
        </motion.p>

        <motion.h1
          id="landing-hero-title"
          variants={fadeUp}
          className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          O guia verde do litoral{" "}
          <span className="bg-gradient-to-r from-[#7fd4ae] to-[#d4ede8] bg-clip-text text-transparent">
            catarinense
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg leading-relaxed text-[#d4ede8]/90 sm:text-xl"
        >
          Curadoria real de praias, gastronomia e serviços — para quem visita e para quem
          empreende na região.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          <LandingButton
            href={landingContactMailto("Quero cadastrar meu negócio")}
            variant="mint"
            external
          >
            Cadastrar meu negócio
          </LandingButton>
          <LandingButton href={`#${LANDING_SECTION_IDS.usuarios}`} variant="outlineLight">
            Ver lugares do guia
          </LandingButton>
        </motion.div>
      </motion.div>

      <div className="relative -mb-8 mt-14 sm:-mb-12 sm:mt-16">
        <LandingStatsBar stats={stats} hasLiveData={hasLiveData} />
      </div>
    </section>
  );
}
