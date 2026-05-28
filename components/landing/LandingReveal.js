"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/components/landing/landingMotion";
import { useLandingRevealMotion } from "@/components/landing/useLandingRichMotion";

/**
 * Entrada suave ao entrar no viewport — reveal premium.
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.useStagger]
 * @param {boolean} [props.cinematic]
 * @returns {import('react').ReactElement}
 */
export default function LandingReveal({
  children,
  className = "",
  useStagger = false,
  cinematic = false,
}) {
  const { reveal, stagger: staggerVariants, viewport } = useLandingRevealMotion();
  const variants = cinematic ? reveal : fadeUp;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={useStagger ? staggerVariants : variants}
    >
      {children}
    </motion.div>
  );
}
