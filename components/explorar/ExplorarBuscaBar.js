"use client";

import Link from "next/link";

/**
 * Barra de busca que leva à home com foco na busca inteligente.
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarBuscaBar() {
  return (
    <Link
      href="/?busca=1"
      className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-[#e8eeee] transition-all active:scale-[0.99] hover:ring-[#1a4a3a]/20"
      aria-label="Buscar lugares com inteligência artificial"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4ede8] text-[#1a4a3a]">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l1.2 4.2L17.4 7.4 13.2 8.6 12 12.8 10.8 8.6 6.6 7.4 10.8 4.2 12 2z" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#1a2e28]">
          O que você procura?
        </span>
        <span className="block text-xs text-[#9aa8a3]">
          Busca com IA · praias, restaurantes, trilhas…
        </span>
      </span>
      <span
        className="shrink-0 rounded-full bg-[#1a4a3a] px-3 py-1.5 text-xs font-bold text-white transition group-hover:bg-[#153d30]"
        aria-hidden
      >
        Buscar
      </span>
    </Link>
  );
}
