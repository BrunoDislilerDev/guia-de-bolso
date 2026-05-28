"use client";

import { motion } from "framer-motion";
import LandingAmbient from "@/components/landing/LandingAmbient";
import LandingPhoneMockup from "@/components/landing/LandingPhoneMockup";
import { floatDevice } from "@/components/landing/landingMotion";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { fadeUp, defaultViewport } from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS } from "@/lib/landingContent";

const APP_POINTS = [
  "Busca inteligente com contexto local",
  "Horários e status em tempo real",
  "Mapas, rotas e favoritos",
  "Interface pensada para o bolso",
];

/**
 * Showcase do app — mockup + bullets.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.showcase
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.parceiros
 * @param {import('@/lib/landingPageData').LandingRotaCard[]} props.rotas
 * @returns {import('react').ReactElement}
 */
export default function LandingAppShowcase({ rotas = [] }) {
  return (
    <LandingSection id={LANDING_SECTION_IDS.app} className="relative overflow-hidden bg-[#f7f8f7]">
      <LandingAmbient variant="section" />
      <div className="relative z-[1] grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <LandingSectionHeader
            eyebrow="O app"
            title="Trilhas que contam histórias."
            subtitle="Rotas curadas e roteiro com IA — planeje o dia inteiro em minutos."
          />

          <motion.ul
            className="mt-12 space-y-5"
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={fadeUp}
          >
            {APP_POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-[#5c6f68]">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1a4a3a]"
                  aria-hidden
                />
                <span className="text-base leading-relaxed">{point}</span>
              </li>
            ))}
          </motion.ul>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={fadeUp}
            className="mt-10 inline-flex rounded-full bg-[#e8f2ee] px-4 py-2 text-sm font-medium text-[#1a4a3a]"
          >
            Lançamento nas lojas em breve
          </motion.p>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="landing-device-glow pointer-events-none absolute -inset-12" aria-hidden />
          <motion.div {...floatDevice}>
            <LandingPhoneMockup screen="rotas" size="showcase" rotas={rotas} />
          </motion.div>
        </div>
      </div>
    </LandingSection>
  );
}
