"use client";

import Link from "next/link";
import { EXPLORAR_MOOD_CHIPS, getCategoriaHref } from "@/lib/categorias";

/**
 * Chips de intenção rápida (praia, comer, trilha…).
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarMoodChips() {
  return (
    <section aria-labelledby="explorar-mood-title">
      <h2
        id="explorar-mood-title"
        className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#5a6b66]"
      >
        Comece por aqui
      </h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {EXPLORAR_MOOD_CHIPS.map((chip) => {
          const href =
            chip.href ||
            (chip.categoria ? getCategoriaHref(chip.categoria) : "/?busca=1");

          return (
            <Link
              key={chip.id}
              href={href}
              className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-white bg-white px-4 py-2.5 text-sm font-semibold text-[#1a4a3a] shadow-sm ring-1 ring-[#e8eeee] transition active:scale-[0.97]"
            >
              <span className="text-base leading-none" aria-hidden>
                {chip.emoji}
              </span>
              {chip.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
