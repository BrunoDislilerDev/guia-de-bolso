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
          className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
            dark ? "text-[#7fd4ae]" : "text-[#1a4a3a]/70"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[2.75rem] lg:text-5xl ${
          dark ? "text-white" : "text-[#0d1f19]"
        } ${eyebrow ? "mt-3" : ""}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg sm:leading-relaxed ${
            dark ? "text-white/65" : "text-[#5c6f68]"
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
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">{children}</div>
    </section>
  );
}
