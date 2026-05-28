"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import LandingPlaceCard from "@/components/landing/LandingPlaceCard";
import { LandingSectionHeader } from "@/components/landing/LandingSection";
import { defaultViewport, scaleIn, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS } from "@/lib/landingContent";

/** @param {object} p */
function LandingDiscoverSection({ id, className, children }) {
  return (
    <section id={id} className={`py-24 sm:py-32 lg:py-40 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">{children}</div>
    </section>
  );
}

/**
 * Experiências locais — dados reais.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.showcase
 * @param {import('@/lib/landingPageData').LandingPageData['categorias']} props.categorias
 * @param {boolean} props.hasLiveData
 * @returns {import('react').ReactElement}
 */
export default function LandingDiscover({ showcase, categorias, hasLiveData }) {
  return (
    <LandingDiscoverSection id={LANDING_SECTION_IDS.categorias} className="relative bg-[#f7f8f7]">
      <LandingSectionHeader
        eyebrow="Experiências"
        title="Lugares que valem o desvio."
        subtitle={
          hasLiveData
            ? "Do pôr do sol na praia ao jantar especial — curados para Imbituba."
            : "Em breve, os endereços essenciais da cidade."
        }
      />

      {showcase.length > 0 && (
        <motion.div
          className="mt-16 flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          role="list"
        >
          {showcase.slice(0, 6).map((lugar, i) => (
            <div
              key={lugar.id}
              className="w-[min(88vw,320px)] shrink-0 snap-center md:w-auto"
              role="listitem"
            >
              <LandingPlaceCard lugar={lugar} priority={i < 2} className="h-full" />
            </div>
          ))}
        </motion.div>
      )}

      {categorias.length > 0 && (
        <div className="mt-20">
          <p className="text-center text-sm font-medium text-[#8a9b94]">Por categoria</p>
          <motion.ul
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            {categorias.slice(0, 8).map((cat) => (
              <motion.li
                key={cat.nome}
                variants={scaleIn}
                className="group relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-[rgba(13,31,25,0.06)] transition-shadow hover:shadow-md"
              >
                {cat.capa && (
                  <div className="pointer-events-none absolute inset-0 opacity-[0.12] transition-opacity group-hover:opacity-[0.18]">
                    <Image src={cat.capa} alt="" fill className="object-cover" sizes="200px" />
                  </div>
                )}
                <span className="relative text-xl" aria-hidden>
                  {cat.icone}
                </span>
                <p className="relative mt-2 font-display text-sm font-semibold text-[#0d1f19]">
                  {cat.nome}
                </p>
                {cat.count > 0 && (
                  <p className="relative mt-0.5 text-xs text-[#8a9b94]">{cat.count} lugares</p>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </LandingDiscoverSection>
  );
}
