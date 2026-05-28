"use client";

import { motion } from "framer-motion";
import {
  defaultViewport,
  fadeUp,
  fadeUpCinematic,
  staggerCinematic,
  staggerContainer,
} from "@/components/landing/landingMotion";

/**
 * Entrada suave ao entrar no viewport — reveal premium.
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.stagger]
 * @param {boolean} [props.cinematic]
 * @returns {import('react').ReactElement}
 */
export default function LandingReveal({
  children,
  className = "",
  stagger = false,
  cinematic = false,
}) {
  const variants = cinematic ? fadeUpCinematic : fadeUp;
  const staggerVariants = cinematic ? staggerCinematic : staggerContainer;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={stagger ? staggerVariants : variants}
    >
      {children}
    </motion.div>
  );
}
