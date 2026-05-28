"use client";

import { motion } from "framer-motion";
import { fadeUp, defaultViewport } from "@/components/landing/landingMotion";
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
  const align = center ? "mx-auto text-center" : "max-w-2xl";

  return (
    <motion.header
      className={align}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeUp}
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
          className={`mt-5 max-w-xl text-base leading-relaxed text-[#4a5c56] sm:text-lg ${
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
export default function LandingSection({ id, className = "", children }) {
  return (
    <section id={id} className={`${LANDING.sectionPy} ${className}`.trim()}>
      <div className="relative mx-auto w-full max-w-[76rem] px-5 sm:px-8 lg:px-12">{children}</div>
    </section>
  );
}
