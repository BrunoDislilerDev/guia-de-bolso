"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
 * @param {string|null} props.heroBackdrop
 * @returns {import('react').ReactElement}
 */
export default function LandingHero({
  stats,
  hasLiveData,
  showcase = [],
  parceiros = [],
  categorias = [],
  heroBackdrop = null,
}) {
  const HERO_VIDEO_URL =
    "https://rsdjbqzjdyeaedyqwrvc.supabase.co/storage/v1/object/public/hero-video/202605281010.mp4";
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const ambientY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const [useVideoBackground, setUseVideoBackground] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const heroImages = showcase.filter((p) => p.capa);
  const backdropUrl = heroBackdrop ?? heroImages[0]?.capa ?? null;
  const heroPosterUrl = backdropUrl ?? heroImages[1]?.capa ?? null;
  const heroStats = [
    { label: "Lugares", value: 18 },
    { label: "Categorias", value: 4 },
    { label: "Parceiros", value: 2 },
  ];

  useEffect(() => {
    const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mediaMobile = window.matchMedia("(max-width: 900px)").matches;
    const saveData = navigator.connection?.saveData === true;
    const shouldUseVideo = !mediaReduced && !mediaMobile && !saveData;
    setUseVideoBackground(shouldUseVideo);
  }, []);

  useEffect(() => {
    if (!useVideoBackground || videoFailed || !videoRef.current) return;
    const playPromise = videoRef.current.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        setVideoFailed(true);
      });
    }
  }, [useVideoBackground, videoFailed]);

  return (
    <section
      ref={ref}
      className={`relative overflow-x-clip ${LANDING.heroMinH} pt-[5.5rem] pb-20 sm:pt-32 sm:pb-28 lg:pb-32`}
      aria-labelledby="landing-hero-title"
    >
      {heroPosterUrl ? (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ y: bgY, scale: bgScale }}
          aria-hidden
        >
          {useVideoBackground && !videoFailed ? (
            <video
              ref={videoRef}
              className="landing-hero-video-frame h-full w-full object-cover object-center saturate-[1.04] contrast-[1.01]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroPosterUrl}
              onError={() => setVideoFailed(true)}
            >
              <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={heroPosterUrl}
              alt=""
              fill
              priority
              className="landing-hero-video-frame object-cover object-[center_40%] saturate-[1.04] contrast-[1.01]"
              sizes="100vw"
            />
          )}
          <div className="landing-cinematic-overlay-video absolute inset-0" />
          <div className="landing-hero-vignette absolute inset-0" />
          <motion.div className="landing-hero-light-pass absolute inset-0" style={{ y: ambientY }} />
          <div className="landing-hero-ambient absolute inset-0" />
          <div className="landing-noise absolute inset-0 opacity-25" />
        </motion.div>
      ) : (
        <LandingAmbient variant="hero" />
      )}

      {!heroPosterUrl ? null : <LandingAmbient variant="hero" className="opacity-35" />}

      <div className="relative mx-auto flex w-full max-w-[76rem] flex-col px-5 sm:px-8 lg:px-12">
        <div className="grid flex-1 items-center gap-14 lg:grid-cols-[1fr_minmax(0,300px)] lg:gap-12 xl:grid-cols-[1.05fr_minmax(0,320px)] xl:gap-16">
          <motion.div
            className="order-2 lg:order-1 landing-hero-content-block"
            style={{ y: textY }}
            initial="hidden"
            animate="visible"
            variants={staggerHero}
          >
            <motion.p
              variants={fadeUpHero}
              className="landing-glass-dark inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[12px] font-medium tracking-wide text-white"
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
              className="landing-display mt-8 max-w-[12ch] text-[clamp(2.75rem,8vw,4.5rem)] font-semibold leading-[0.98] text-white xl:text-[4.75rem]"
            >
              <span className="block">{LANDING_HERO.line1}</span>
              <span className="mt-1 block bg-gradient-to-br from-[#dff8ea] via-[#9de3c2] to-[#6ec89d] bg-clip-text text-transparent">
                {LANDING_HERO.line2}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpHero}
              className="mt-6 max-w-md text-lg leading-relaxed text-white/85 sm:text-xl sm:leading-relaxed"
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
              className="mt-14 grid grid-cols-3 gap-3 border-t border-white/20 pt-9 sm:gap-4"
            >
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="landing-hero-stat-card rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4"
                >
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/64">
                    {item.label}
                  </dt>
                  <dd className="landing-display mt-1.5 text-[1.9rem] font-semibold leading-none tabular-nums text-white sm:text-[2.3rem]">
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
