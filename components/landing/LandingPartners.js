"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { useLandingRevealMotion } from "@/components/landing/useLandingRichMotion";
import { LANDING_SECTION_IDS } from "@/lib/landingContent";

/**
 * Parceiros reais — grid minimal.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.parceiros
 * @param {import('@/lib/landingPageData').LandingPageData['stats']} [props.stats]
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @returns {import('react').ReactElement|null}
 */
export default function LandingPartners({
  parceiros,
  stats,
  title = "Parceiros que definem o padrão.",
  subtitle = "Estabelecimentos verificados no guia oficial da cidade.",
}) {
  const { reveal, stagger, viewport } = useLandingRevealMotion();

  if (!parceiros?.length) return null;
  const partnerNames = parceiros.map((p) => p.nome).filter(Boolean);

  return (
    <LandingSection id={LANDING_SECTION_IDS.parceiros} tone="canvas" bridge={false}>
      <LandingSectionHeader
        eyebrow="Parceiros"
        title={title}
        subtitle={subtitle}
        center
      />

      <motion.div
        className="landing-fluid-panel mt-10 rounded-2xl px-4 py-3"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#5d6d67]">
          <span className="font-semibold text-[#1a4a3a]">
            {stats?.parceirosCount || parceiros.length}+ parceiros verificados
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-[#9fb7ad] sm:inline-block" />
          <span>Presença ativa nas categorias mais buscadas</span>
          <span className="hidden h-1 w-1 rounded-full bg-[#9fb7ad] sm:inline-block" />
          <span>Atualização recorrente de perfil e conteúdo</span>
        </div>
      </motion.div>

      <div className="landing-logo-rail mt-8" aria-label="Estabelecimentos parceiros em destaque">
        <div className="landing-logo-rail-track">
          {[...partnerNames, ...partnerNames].map((name, idx) => (
            <span key={`${name}-${idx}`} className="landing-logo-pill">
              {name}
            </span>
          ))}
        </div>
      </div>

      <motion.ul
        className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        {parceiros.map((p) => (
          <motion.li
            key={p.id}
            variants={reveal}
            className="landing-card-hover flex items-center gap-4 rounded-[1.35rem] bg-white/80 p-4 ring-1 ring-[rgba(13,31,25,0.05)] backdrop-blur-sm"
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
