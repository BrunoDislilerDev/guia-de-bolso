"use client";

import { PLANOS_RAPIDOS } from "@/lib/homeContext";

/**
 * PlanosRapidos - Horizontal list of preset experience plan cards.
 * @param {object} props
 * @param {(plano: object) => void} props.onPlanoClick - Called when a plan card is selected.
 * @returns {import('react').ReactElement}
 */
export default function PlanosRapidos({ onPlanoClick }) {
  return (
    <section className="mb-8">
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1a4a3a]">
          Experiências prontas
        </p>
        <h2 className="text-lg font-bold text-[#1a2e28]">Planos rápidos para você</h2>
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {PLANOS_RAPIDOS.map((plano) => (
          <button
            key={plano.id}
            type="button"
            onClick={() => onPlanoClick(plano)}
            className={`flex w-[168px] shrink-0 flex-col rounded-2xl bg-gradient-to-br ${plano.gradient} p-4 text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.98]`}
          >
            <span className="text-2xl" aria-hidden>
              {plano.emoji}
            </span>
            <h3 className="mt-3 text-base font-bold text-[#1a2e28]">{plano.titulo}</h3>
            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[#5a6b66]">
              {plano.descricao}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#1a4a3a]">
              Ver plano
              <span aria-hidden>→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
