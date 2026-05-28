"use client";

import { motion } from "framer-motion";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";

/**
 * Entrada suave ao entrar no viewport — reveal premium.
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.stagger]
 * @returns {import('react').ReactElement}
 */
export default function LandingReveal({ children, className = "", stagger = false }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={stagger ? staggerContainer : fadeUp}
    >
      {children}
    </motion.div>
  );
}
