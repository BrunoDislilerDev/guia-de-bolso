"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import LandingButton from "@/components/landing/LandingButton";
import LandingPhoneMockup from "@/components/landing/LandingPhoneMockup";
import { fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import {
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";

/**
 * Hero premium — headline editorial, mockup iPhone, prova social.
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const heroImages = showcase.filter((p) => p.capa).slice(0, 3);

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pb-28"
      aria-labelledby="landing-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[#fafaf9]" />
        <div className="absolute -left-[20%] top-0 h-[70%] w-[70%] rounded-full bg-[#7fd4ae]/12 blur-[100px]" />
        <div className="absolute -right-[10%] bottom-0 h-[50%] w-[50%] rounded-full bg-[#1a4a3a]/6 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* iPhone — primeiro no mobile para aparecer acima da dobra */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <LandingPhoneMockup
              screen="home"
              size="hero"
              emAlta={showcase}
              parceiros={parceiros}
              categorias={categorias}
            />
          </div>

          {/* Texto */}
          <motion.div
            className="order-2 lg:order-1"
            style={{ y }}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {hasLiveData && stats.totalLugares > 0 && (
              <motion.p
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-[#1a4a3a]/10 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-[#1a4a3a] shadow-sm backdrop-blur-md"
              >
                <span className="flex -space-x-1" aria-hidden>
                  {heroImages.slice(0, 3).map((p) => (
                    <span
                      key={p.id}
                      className="relative inline-block h-5 w-5 overflow-hidden rounded-full ring-2 ring-white"
                    >
                      {p.capa && (
                        <Image src={p.capa} alt="" fill className="object-cover" sizes="20px" />
                      )}
                    </span>
                  ))}
                </span>
                {stats.totalLugares}+ lugares curados · Imbituba, SC
              </motion.p>
            )}

            <motion.h1
              id="landing-hero-title"
              variants={fadeUp}
              className="mt-6 max-w-[14ch] font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#0d1f19] sm:text-6xl lg:text-[4.25rem]"
            >
              Descubra Imbituba como um local.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md text-lg leading-relaxed text-[#5c6f68] sm:text-xl"
            >
              O guia mais refinado de Imbituba — curadoria real, horários ao vivo e experiências
              que valem o dia.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <LandingButton href={`#${LANDING_SECTION_IDS.categorias}`} variant="primary">
                Ver categorias
              </LandingButton>
              <LandingButton
                href={landingContactMailto("Cadastrar meu negócio")}
                variant="secondary"
                external
              >
                Cadastrar meu negócio
              </LandingButton>
            </motion.div>

            <motion.dl
              variants={fadeUp}
              className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-[#1a4a3a]/8 pt-8"
            >
              {[
                { label: "Lugares", value: hasLiveData ? stats.totalLugares : "—" },
                { label: "Categorias", value: hasLiveData ? stats.categoriasComLugares : "—" },
                { label: "Parceiros", value: hasLiveData ? stats.parceirosCount : "—" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-[#8a9b94]">
                    {item.label}
                  </dt>
                  <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums tracking-tight text-[#0d1f19]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
