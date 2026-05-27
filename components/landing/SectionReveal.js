"use client";

import { motion } from "framer-motion";
import { defaultViewport, fadeUp } from "@/components/landing/landingMotion";

/**
 * Wrapper com animação ao entrar no viewport.
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @returns {import('react').ReactElement}
 */
export default function SectionReveal({
  children,
  className = "",
  id,
  as: Tag = "section",
}) {
  const Component = motion[Tag] ?? motion.section;

  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeUp}
    >
      {children}
    </Component>
  );
}
