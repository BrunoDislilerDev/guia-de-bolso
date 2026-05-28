"use client";

import { motion } from "framer-motion";
import { defaultViewport, fadeUpCinematic } from "@/components/landing/landingMotion";
import { LANDING } from "@/components/landing/landingTheme";

/**
 * Cabeçalho de seção editorial.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {boolean} [props.center]
 * @param {import('react').ReactNode} [props.children]
 * @returns {import('react').ReactElement}
 */
export function LandingSectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
  dark = false,
}) {
  const headerAlign = center ? "mx-auto max-w-3xl text-center" : "max-w-2xl";
  const subtitleAlign = center ? "mx-auto text-center" : "";

  return (
    <motion.header
      className={headerAlign}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeUpCinematic}
    >
      {eyebrow && (
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-[#7fd4ae]" : "text-[#1a4a3a]/65"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`landing-display text-[clamp(1.875rem,5vw,3rem)] font-semibold leading-[1.08] sm:text-[2.75rem] lg:text-[3.25rem] ${
          dark ? "text-white" : "text-[#0a1612]"
        } ${eyebrow ? "mt-4" : ""}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 max-w-xl text-base leading-relaxed text-[#4a5c56] sm:text-lg ${subtitleAlign} ${
            dark ? "!text-white/70" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}

/**
 * Wrapper de seção com espaçamento premium.
 * @param {object} props
 * @param {string} [props.id]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
/**
 * @param {object} props
 * @param {string} [props.id]
 * @param {string} [props.className]
 * @param {boolean} [props.bridge]
 * @param {"canvas"|"white"|"mist"|"none"} [props.tone]
 * @param {import('react').ReactNode} props.children
 */
export default function LandingSection({
  id,
  className = "",
  children,
  bridge = true,
  tone = "none",
}) {
  const toneClass =
    tone === "canvas"
      ? "landing-section-flow landing-section-flow--canvas"
      : tone === "white"
        ? "landing-section-flow landing-section-flow--white"
        : tone === "mist"
          ? "landing-section-flow landing-section-flow--mist"
          : "landing-section-flow";

  return (
    <section
      id={id}
      className={`relative ${LANDING.sectionPy} ${bridge ? "landing-section-bridge" : ""} ${toneClass} ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-0 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#1a4a3a]/8 to-transparent" />
      </div>
      <div className="relative z-[1] mx-auto w-full max-w-[76rem] px-5 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
