"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionReveal from "@/components/landing/SectionReveal";
import { fadeUp, staggerContainer, defaultViewport } from "@/components/landing/landingMotion";
import { getCategoriaByNome } from "@/lib/categorias";

/**
 * Faixa de parceiros reais do banco.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.parceiros
 * @returns {import('react').ReactElement|null}
 */
export default function LandingPartners({ parceiros }) {
  if (!parceiros?.length) return null;

  return (
    <SectionReveal className="border-y border-[#1a4a3a]/8 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1a4a3a]">
            Parceiros do guia
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-[#1a2e28] sm:text-3xl">
            Estabelecimentos verificados
          </h2>
        </motion.div>

        <motion.ul
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {parceiros.map((p) => {
            const cat = getCategoriaByNome(p.categoria);
            return (
              <motion.li
                key={p.id}
                variants={fadeUp}
                className="flex w-[min(100%,280px)] items-center gap-3 rounded-2xl bg-[#f0f4f3] px-4 py-3 ring-1 ring-[#1a4a3a]/10"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#d4ede8]">
                  {p.capa ? (
                    <Image src={p.capa} alt="" fill className="object-cover" sizes="48px" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-lg">
                      {cat?.icone ?? "✓"}
                    </span>
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <p className="truncate font-semibold text-[#1a2e28]">{p.nome}</p>
                  <p className="text-xs text-[#5a6b66]">{p.categoria}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </SectionReveal>
  );
}
