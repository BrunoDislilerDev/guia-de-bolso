"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionReveal from "@/components/landing/SectionReveal";
import { easeOut, fadeUp, defaultViewport } from "@/components/landing/landingMotion";
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
 * Como funciona — tabs animados, verde.
 * @returns {import('react').ReactElement}
 */
export default function LandingHowItWorks() {
  const [active, setActive] = useState("business");
  const steps = active === "business" ? LANDING_STEPS_BUSINESS : LANDING_STEPS_USER;

  return (
    <SectionReveal
      id={LANDING_SECTION_IDS.comoFunciona}
      className="bg-[#f0f4f3] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1a4a3a]">
            Como funciona
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
            Simples para todos
          </h2>
        </motion.div>

        <div
          className="mx-auto mt-10 flex max-w-md rounded-2xl bg-white p-1 shadow-sm ring-1 ring-[#1a4a3a]/10"
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
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  selected
                    ? "bg-[#1a4a3a] text-white shadow-md"
                    : "text-[#5a6b66] hover:text-[#1a4a3a]"
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            {steps.map((step, i) => (
              <motion.li
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl bg-white p-6 ring-1 ring-[#1a4a3a]/8"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1a4a3a] to-[#7fd4ae] text-lg font-bold text-white">
                  {step.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-[#1a2e28]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </SectionReveal>
  );
}
