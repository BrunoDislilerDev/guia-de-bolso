"use client";

import { motion } from "framer-motion";
import LandingPhoneHomeScreen from "@/components/landing/LandingPhoneHomeScreen";
import LandingPhoneRotasScreen from "@/components/landing/LandingPhoneRotasScreen";
import { easePremium } from "@/components/landing/landingMotion";
import {
  getLandingPhoneMetrics,
  PHONE_OUTER_WIDTH,
} from "@/lib/landingPhoneSpecs";

const deviceShadow = [
  "0 1px 2px rgba(0,0,0,0.04)",
  "0 4px 12px rgba(0,0,0,0.06)",
  "0 16px 36px rgba(0,0,0,0.07)",
  "0 28px 56px rgba(13,31,25,0.09)",
].join(", ");

const frameHighlight = [
  "inset 0 1px 0 rgba(255,255,255,0.65)",
  "inset 0 -1px 0 rgba(0,0,0,0.12)",
  "inset 1px 0 0 rgba(255,255,255,0.2)",
  "inset -1px 0 0 rgba(0,0,0,0.08)",
].join(", ");

const buttonMetal = {
  background: "linear-gradient(90deg, #7a7a7f 0%, #b8b8bd 45%, #6e6e73 100%)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.2)",
};

/**
 * @param {object} props
 * @param {string} props.side
 * @param {string} props.className
 * @returns {import('react').ReactElement}
 */
function SideButton({ side, className }) {
  const rounded = side === "left" ? "rounded-l-[2px]" : "rounded-r-[2px]";
  return (
    <div
      className={`absolute z-20 w-[2px] ${rounded} ${className}`}
      style={buttonMetal}
      aria-hidden
    />
  );
}

/**
 * Mockup iPhone com proporção fixa 393×852 e prévia home ou rotas.
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

  const titaniumFrame = {
    background:
      "linear-gradient(165deg, #f5f5f7 0%, #d8d8dc 12%, #b8b8bd 28%, #ececef 42%, #a8a8ad 58%, #c4c4c9 72%, #9a9a9f 88%, #b0b0b5 100%)",
    boxShadow: `${deviceShadow}, ${frameHighlight}`,
  };

  const ariaLabel =
    screen === "rotas"
      ? "Prévia da seção de rotas do Guia de Bolso em um iPhone"
      : "Prévia da home do Guia de Bolso em um iPhone";

  return (
    <motion.div
      className={`relative mx-auto shrink-0 ${className}`}
      style={{
        width: m.outerWidth,
        maxWidth: `min(${m.outerWidth}px, calc(100vw - 2rem))`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easePremium, delay: 0.1 }}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[14%] -z-10 h-[78%] w-[68%] -translate-x-1/2 rounded-[2.75rem] bg-black/[0.05] blur-[28px]"
        aria-hidden
      />

      <div className="relative" style={{ width: m.outerWidth }}>
        <SideButton side="left" className="-left-[1.5px] top-[19%] h-[16px]" />
        <SideButton side="left" className="-left-[1.5px] top-[26%] h-[24px]" />
        <SideButton side="left" className="-left-[1.5px] top-[33%] h-[24px]" />
        <SideButton side="right" className="-right-[1.5px] top-[28%] h-[40px]" />

        <div
          className="relative p-[3px]"
          style={{ borderRadius: m.deviceRadius, ...titaniumFrame }}
        >
          <div
            className="relative bg-[#0a0a0a] p-[2px]"
            style={{
              borderRadius: m.deviceRadius - 3,
              boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="relative overflow-hidden bg-[#0a0a0a]"
              style={{
                width: m.screenWidth,
                height: m.screenHeight,
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: m.screenRadius,
                boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center justify-end gap-1 bg-black pr-1.5"
                style={{
                  top: m.island.top,
                  width: m.island.w,
                  height: m.island.h,
                  borderRadius: 999,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.5), inset 0 0.5px 0 rgba(255,255,255,0.06)",
                }}
                aria-hidden
              >
                <span
                  className="rounded-full bg-[#1c1c1e]"
                  style={{
                    width: Math.max(5, Math.round(m.island.h * 0.38)),
                    height: Math.max(5, Math.round(m.island.h * 0.38)),
                    boxShadow:
                      "inset 0 0 1px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(60,60,67,0.5)",
                  }}
                />
              </div>

              <div
                className="relative z-0 flex h-full flex-col overflow-hidden bg-[#f0f4f3]"
                style={{
                  borderRadius: m.screenRadius,
                  paddingTop: m.safeTop,
                }}
              >
                <div className="min-h-0 flex-1 overflow-hidden">
                  {screen === "rotas" ? (
                    <LandingPhoneRotasScreen rotas={rotas} />
                  ) : (
                    <LandingPhoneHomeScreen
                      emAlta={alta}
                      parceiros={parceiros}
                      categorias={categorias}
                    />
                  )}
                </div>

                <div className="relative z-10 flex shrink-0 justify-center bg-[#f0f4f3] pb-2 pt-0.5">
                  <div
                    className="rounded-full bg-black/25"
                    style={{ width: m.homeIndicator.w, height: m.homeIndicator.h }}
                    aria-hidden
                  />
                </div>
              </div>

              <div
                className="pointer-events-none absolute inset-0 z-[25] rounded-[inherit]"
                style={{
                  boxShadow:
                    "inset 0 0 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[30] rounded-[inherit]"
                style={{
                  background: [
                    "linear-gradient(125deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 16%, transparent 40%)",
                    "linear-gradient(210deg, transparent 58%, rgba(255,255,255,0.025) 80%, transparent 100%)",
                  ].join(", "),
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[28] rounded-[inherit] ring-1 ring-inset ring-white/[0.07]"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
