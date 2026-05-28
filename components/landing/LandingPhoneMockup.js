"use client";

import { motion } from "framer-motion";
import LandingPhoneDeviceShell from "@/components/landing/LandingPhoneDeviceShell";
import LandingPhoneHomeScreen from "@/components/landing/LandingPhoneHomeScreen";
import LandingPhoneRotasScreen from "@/components/landing/LandingPhoneRotasScreen";
import { easePremium } from "@/components/landing/landingMotion";
import {
  getLandingPhoneMetrics,
  PHONE_OUTER_WIDTH,
} from "@/lib/landingPhoneSpecs";

/**
 * Mockup de smartphone — chassi matte, proporção 19,5:9, punch-hole.
 * @param {object} props
 * @param {'home'|'rotas'} [props.screen]
 * @param {'hero'|'showcase'} [props.size]
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} [props.emAlta]
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} [props.parceiros]
 * @param {import('@/lib/landingPageData').LandingPageData['categorias']} [props.categorias]
 * @param {import('@/lib/landingPageData').LandingRotaCard[]} [props.rotas]
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} [props.places]
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
export default function LandingPhoneMockup({
  screen = "home",
  size = "hero",
  emAlta = [],
  parceiros = [],
  categorias = [],
  rotas = [],
  places = [],
  className = "",
}) {
  const outerWidth = PHONE_OUTER_WIDTH[size] ?? PHONE_OUTER_WIDTH.hero;
  const m = getLandingPhoneMetrics(outerWidth);
  const alta = emAlta.length > 0 ? emAlta : places;

  const ariaLabel =
    screen === "rotas"
      ? "Prévia da seção de rotas do Guia de Bolso em um smartphone"
      : "Prévia da home do Guia de Bolso em um smartphone";

  const screenContent =
    screen === "rotas" ? (
      <LandingPhoneRotasScreen rotas={rotas} />
    ) : (
      <LandingPhoneHomeScreen emAlta={alta} parceiros={parceiros} categorias={categorias} />
    );

  return (
    <motion.div
      className={`relative mx-auto shrink-0 ${className}`}
      style={{
        width: m.outerWidth,
        maxWidth: `min(${m.outerWidth}px, calc(100vw - 2rem))`,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: easePremium, delay: 0.08 }}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Sombra de contato no superfície */}
      <div
        className="pointer-events-none absolute -bottom-4 left-1/2 -z-10 h-6 w-[55%] -translate-x-1/2 rounded-[100%] bg-black/20 blur-md"
        aria-hidden
      />

      <LandingPhoneDeviceShell metrics={m}>{screenContent}</LandingPhoneDeviceShell>
    </motion.div>
  );
}
