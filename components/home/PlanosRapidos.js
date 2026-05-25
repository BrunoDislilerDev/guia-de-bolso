"use client";

import { PLANOS_RAPIDOS } from "@/lib/homeContext";
import HomeSectionHeader from "@/components/home/HomeSectionHeader";
import { HOME_CAROUSEL_TRACK_CLASS } from "@/components/home/homeTokens";

/**
 * PlanosRapidos - Horizontal list of preset experience plan cards.
 */
export default function PlanosRapidos({ onPlanoClick }) {
  return (
    <section className="mb-10 home-reveal overflow-visible" style={{ animationDelay: "120ms" }}>
      <HomeSectionHeader eyebrow="Experiências prontas" title="Planos rápidos para você" />

      <div className={`${HOME_CAROUSEL_TRACK_CLASS} -mx-4 px-4`}>
        {PLANOS_RAPIDOS.map((plano) => (
          <button
            key={plano.id}
            type="button"
            onClick={() => onPlanoClick(plano)}
            className={`relative flex w-[172px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-gradient-to-br ${plano.gradient} p-4 text-left ring-1 ring-[#e8eeee]/80 transition-transform duration-300 active:scale-[0.97]`}
          >
            <span
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl"
              aria-hidden
            />
            <span className="relative text-[1.75rem] leading-none" aria-hidden>
              {plano.emoji}
            </span>
            <h3 className="relative mt-3 text-base font-bold tracking-tight text-[#1a2e28]">
              {plano.titulo}
            </h3>
            <p className="relative mt-1.5 flex-1 text-xs leading-relaxed text-[#5a6b66]">
              {plano.descricao}
            </p>
            <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1a4a3a]">
              Ver plano
              <span aria-hidden>→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
