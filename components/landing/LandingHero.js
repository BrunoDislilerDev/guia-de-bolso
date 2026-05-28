"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import LandingAmbient from "@/components/landing/LandingAmbient";
import LandingButton from "@/components/landing/LandingButton";
import LandingHeroFloatingCards from "@/components/landing/LandingHeroFloatingCards";
import LandingPhoneMockup from "@/components/landing/LandingPhoneMockup";
import { LANDING } from "@/components/landing/landingTheme";
import {
  fadeUpHero,
  floatDevice,
  scaleIn,
  staggerHero,
} from "@/components/landing/landingMotion";
import {
  LANDING_HERO,
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";

/**
 * Hero cinematográfico — lifestyle, profundidade, mockup refinado.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingPageData['stats']} props.stats
 * @param {boolean} props.hasLiveData
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.showcase
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.parceiros
 * @param {import('@/lib/landingPageData').LandingPageData['categorias']} props.categorias
 * @returns {import('react').ReactElement}
 */
export default function LandingHero({
  stats,
  hasLiveData,
  showcase = [],
  parceiros = [],
  categorias = [],
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const heroImages = showcase.filter((p) => p.capa);
  const heroBackdrop = heroImages[0]?.capa ?? null;

  return (
    <section
      ref={ref}
      className={`relative overflow-x-clip ${LANDING.heroMinH} pt-[5.5rem] pb-20 sm:pt-32 sm:pb-28 lg:pb-32`}
      aria-labelledby="landing-hero-title"
    >
      {heroBackdrop ? (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ y: bgY, scale: bgScale }}
          aria-hidden
        >
          <Image
            src={heroBackdrop}
            alt=""
            fill
            priority
            className="object-cover object-[center_32%] saturate-[1.05] contrast-[1.02]"
            sizes="100vw"
          />
          <div className="landing-cinematic-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-[#1a4a3a]/[0.07] mix-blend-multiply" />
          <div className="landing-noise absolute inset-0 opacity-25" />
        </motion.div>
      ) : (
        <LandingAmbient variant="hero" />
      )}

      {!heroBackdrop ? null : <LandingAmbient variant="hero" className="opacity-60" />}

      <div className="relative mx-auto flex w-full max-w-[76rem] flex-col px-5 sm:px-8 lg:px-12">
        <div className="grid flex-1 items-center gap-14 lg:grid-cols-[1fr_minmax(0,300px)] lg:gap-12 xl:grid-cols-[1.05fr_minmax(0,320px)] xl:gap-16">
          <motion.div
            className="order-2 lg:order-1"
            style={{ y: textY }}
            initial="hidden"
            animate="visible"
            variants={staggerHero}
          >
            <motion.p
              variants={fadeUpHero}
              className="landing-glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[12px] font-medium tracking-wide text-[#1a4a3a]"
            >
              {hasLiveData && heroImages.length > 0 ? (
                <span className="flex -space-x-1.5" aria-hidden>
                  {heroImages.slice(0, 3).map((p) => (
                    <span
                      key={p.id}
                      className="relative inline-block h-6 w-6 overflow-hidden rounded-full ring-2 ring-white"
                    >
                      <Image src={p.capa} alt="" fill className="object-cover" sizes="24px" />
                    </span>
                  ))}
                </span>
              ) : null}
              <span>
                {hasLiveData && stats.totalLugares > 0
                  ? `${stats.totalLugares}+ experiências · ${LANDING_HERO.eyebrow}`
                  : LANDING_HERO.eyebrow}
              </span>
            </motion.p>

            <motion.h1
              id="landing-hero-title"
              variants={fadeUpHero}
              className="landing-display mt-8 max-w-[12ch] text-[clamp(2.75rem,8vw,4.5rem)] font-semibold leading-[0.98] text-[#0a1612] xl:text-[4.75rem]"
            >
              <span className="block">{LANDING_HERO.line1}</span>
              <span className="mt-1 block bg-gradient-to-br from-[#1a4a3a] via-[#2d6b54] to-[#0f2e24] bg-clip-text text-transparent">
                {LANDING_HERO.line2}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpHero}
              className="mt-6 max-w-md text-lg leading-relaxed text-[#4a5c56] sm:text-xl sm:leading-relaxed"
            >
              {LANDING_HERO.subtitle}
            </motion.p>

            <motion.div
              variants={fadeUpHero}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <LandingButton href={`#${LANDING_SECTION_IDS.categorias}`} variant="primary" size="lg">
                {LANDING_HERO.ctaExplore}
              </LandingButton>
              <LandingButton
                href={landingContactMailto("Cadastrar meu negócio")}
                variant="secondary"
                size="lg"
                external
              >
                {LANDING_HERO.ctaBusiness}
              </LandingButton>
            </motion.div>

            <motion.dl
              variants={fadeUpHero}
              className="mt-14 grid grid-cols-3 gap-6 border-t border-[#1a4a3a]/10 pt-10 sm:gap-10"
            >
              {[
                { label: "Lugares", value: hasLiveData ? stats.totalLugares : "—" },
                { label: "Categorias", value: hasLiveData ? stats.categoriasComLugares : "—" },
                { label: "Parceiros", value: hasLiveData ? stats.parceirosCount : "—" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a8b85]">
                    {item.label}
                  </dt>
                  <dd className="landing-display mt-1 text-2xl font-semibold tabular-nums text-[#0a1612] sm:text-3xl">
                    {item.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
            style={{ y: phoneY }}
            initial="hidden"
            animate="visible"
            variants={scaleIn}
          >
            <div className="relative">
              <LandingHeroFloatingCards places={showcase} />
              <div
                className="landing-device-glow pointer-events-none absolute -inset-20 -z-10 sm:-inset-24"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7fd4ae]/15 blur-[60px]"
                aria-hidden
              />
              <motion.div {...floatDevice}>
                <LandingPhoneMockup
                  screen="home"
                  size="hero"
                  emAlta={showcase}
                  parceiros={parceiros}
                  categorias={categorias}
                  className="relative z-[1] [filter:drop-shadow(0_36px_72px_rgba(10,22,18,0.16))]"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
