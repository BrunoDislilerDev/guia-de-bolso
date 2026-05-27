"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionReveal from "@/components/landing/SectionReveal";
import { easeOut } from "@/components/landing/landingMotion";
import {
  LANDING_SECTION_IDS,
  LANDING_STEPS_BUSINESS,
  LANDING_STEPS_USER,
} from "@/lib/landingContent";

const TABS = [
  { id: "business", label: "Estabelecimentos" },
  { id: "user", label: "Usuários" },
];

/**
 * Como funciona — tabs para negócios e usuários.
 * @returns {import('react').ReactElement}
 */
export default function LandingHowItWorks() {
  const [active, setActive] = useState("business");
  const steps = active === "business" ? LANDING_STEPS_BUSINESS : LANDING_STEPS_USER;

  return (
    <SectionReveal id={LANDING_SECTION_IDS.comoFunciona} className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0d5c7a]">
            Como funciona
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
            Simples para todos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#5a6b66]">
            Escolha seu perfil e veja o passo a passo.
          </p>
        </div>

        <div
          className="mx-auto mt-10 flex max-w-md rounded-2xl bg-[#e8f4f8] p-1"
          role="tablist"
          aria-label="Fluxo"
        >
          {TABS.map((tab) => {
            const selected = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-white text-[#0d5c7a] shadow-sm"
                    : "text-[#5a6b66] hover:text-[#1a2e28]"
                }`}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.ol
            key={active}
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            className="mt-12 grid gap-6 sm:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {steps.map((step) => (
              <li
                key={step.step}
                className="relative rounded-2xl bg-white p-6 ring-1 ring-[#0d5c7a]/10"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0d5c7a] to-[#2d6b52] text-lg font-bold text-white"
                  aria-hidden="true"
                >
                  {step.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-[#1a2e28]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
                  {step.description}
                </p>
              </li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </SectionReveal>
  );
}
