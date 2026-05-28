"use client";

import { motion } from "framer-motion";
import LandingButton from "@/components/landing/LandingButton";
import LandingSection, { LandingSectionHeader } from "@/components/landing/LandingSection";
import { defaultViewport, fadeUp, staggerContainer } from "@/components/landing/landingMotion";
import {
  LANDING_BUSINESS_BENEFITS,
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";

/**
 * Benefícios para negócios.
 * @returns {import('react').ReactElement}
 */
export default function LandingBusinessBenefits() {
  return (
    <LandingSection id={LANDING_SECTION_IDS.negocios} className="bg-[#0d1f19] text-white">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-end">
        <LandingSectionHeader
          eyebrow="Para negócios"
          title="Seu endereço no mapa de Imbituba."
          subtitle="Alcance turistas no momento em que decidem onde ir na cidade."
          dark
        />

        <div className="lg:pb-2 lg:text-right">
          <LandingButton
            href={landingContactMailto("Cadastrar estabelecimento")}
            variant="secondary"
            external
            className="!text-[#0d1f19]"
          >
            Cadastrar meu negócio
          </LandingButton>
        </div>
      </div>

      <motion.ul
        className="mt-16 grid gap-6 sm:grid-cols-2"
        role="list"
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        {LANDING_BUSINESS_BENEFITS.map((item) => (
          <motion.li
            key={item.title}
            variants={fadeUp}
            className="rounded-[1.25rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
          >
            <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </LandingSection>
  );
}
