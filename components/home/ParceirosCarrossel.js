"use client";

import Link from "next/link";
import { getCapaFromLugar } from "@/lib/fotos";
import { getBadgeParceiroLabel } from "@/lib/destaques";

/**
 * Carrossel de estabelecimentos com destaque comercial vigente.
 * @param {object} props
 * @param {object[]} [props.lugares] - Lugares parceiros (ehParceiro).
 * @returns {import("react").ReactElement|null}
 */
export default function ParceirosCarrossel({ lugares = [] }) {
  if (!lugares.length) return null;

  return (
    <section className="mb-8" aria-labelledby="parceiros-carrossel-title">
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1a4a3a]">
          Parceiros do guia
        </p>
        <h2 id="parceiros-carrossel-title" className="text-lg font-bold text-[#1a2e28]">
          Destaques da semana
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {lugares.map((lugar) => (
          <Link
            key={lugar.id}
            href={`/lugares/${lugar.id}`}
            className="group relative flex h-[200px] w-[280px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition active:scale-[0.98]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getCapaFromLugar(lugar)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2820]/95 via-[#0d2820]/40 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-[#f5e6b8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7a6520]">
              {getBadgeParceiroLabel()}
            </span>
            <div className="relative p-4 text-white">
              <h3 className="text-lg font-bold leading-tight">{lugar.nome}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-white/85">{lugar.categoria}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
