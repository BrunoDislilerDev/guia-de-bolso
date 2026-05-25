"use client";

import Link from "next/link";
import { HOME_SURFACE_CLASS } from "@/components/home/homeTokens";

function IconSparkle({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.2 4.2L17.4 7.4 13.2 8.6 12 12.8 10.8 8.6 6.6 7.4 10.8 4.2 12 2zm7 9l.9 3.1 3.1.9-3.1.9-.9 3.1-.9-3.1-3.1-.9 3.1-.9.9-3.1zm-14 0l.7 2.4 2.4.7-2.4.7-.7 2.4-.7-2.4-2.4-.7 2.4-.7.7-2.4z" />
    </svg>
  );
}

function IconSend({ className = "h-[17px] w-[17px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.4 20.4l17.45-7.17a1 1 0 000-1.83L3.4 4.6a1 1 0 00-1.28 1.28l3.07 7.12-3.07 7.12a1 1 0 001.28 1.28z" />
    </svg>
  );
}

/**
 * Barra de busca estática — mesmo layout e ícones do SmartSearch da home.
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarBuscaBar() {
  return (
    <section className="home-explorar-search-section relative mb-6 mt-4">
      <Link
        href="/?busca=1"
        className={`home-ai-search-surface group block ${HOME_SURFACE_CLASS} shadow-none ring-[#e8eeee] transition-shadow duration-200 active:scale-[0.98]`}
        aria-label="Buscar lugares com inteligência artificial"
      >
        <div className="home-ai-search-input-row flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef6f2] text-[#1a4a3a]">
            <IconSparkle />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a4a3a]/50">
              Pergunte à IA
            </span>
            <span className="mt-0.5 block text-[16px] leading-snug text-[#9aa8a3]">
              O que você quer descobrir hoje?
            </span>
          </span>

          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1a4a3a] text-white shadow-[0_6px_20px_rgba(26,74,58,0.32)]"
            aria-hidden
          >
            <IconSend className="h-[17px] w-[17px] -rotate-45" />
          </span>
        </div>
      </Link>
    </section>
  );
}
