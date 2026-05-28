"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS } from "@/lib/landingContent";

/**
 * Parceiros reais — grid minimal.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.parceiros
 * @returns {import('react').ReactElement|null}
 */
export default function LandingPartners({ parceiros }) {
  if (!parceiros?.length) return null;

  return (
    <LandingSection id={LANDING_SECTION_IDS.parceiros} className="bg-[#fafaf9]">
      <LandingSectionHeader
        eyebrow="Parceiros"
        title="Estabelecimentos que confiam no guia."
        center
      />

      <motion.ul
        className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        {parceiros.map((p) => (
          <motion.li
            key={p.id}
            variants={fadeUp}
            className="flex items-center gap-4 rounded-[1.25rem] bg-white p-4 ring-1 ring-[rgba(13,31,25,0.06)] transition-shadow hover:shadow-md"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#e8f2ee]">
              {p.capa ? (
                <Image src={p.capa} alt="" fill className="object-cover" sizes="56px" />
              ) : (
                <span className="flex h-full items-center justify-center text-lg text-[#1a4a3a]">
                  ✓
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-[#0d1f19]">{p.nome}</p>
              <p className="text-xs text-[#8a9b94]">{p.categoria}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </LandingSection>
  );
}
