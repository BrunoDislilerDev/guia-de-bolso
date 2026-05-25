"use client";

import Logo from "@/components/Logo";
import { HOME_CONTEXT_PILL_CLASS } from "@/components/home/homeTokens";
import { useHomeHeaderShellRef } from "@/hooks/useHomeHeaderScroll";

/**
 * Shell sticky da tela Explorar (topo + slot de busca IA, como na home).
 * @param {object} props
 * @param {boolean} props.loading
 * @param {number} props.totalLugares
 * @param {number} props.categoriasComLugares
 * @param {import('react').ReactNode} props.children - ExplorarBuscaBar
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarHeader({
  loading,
  totalLugares,
  categoriasComLugares,
  children,
}) {
  const headerShellRef = useHomeHeaderShellRef();

  const subtitulo = loading
    ? "Carregando lugares da região…"
    : `${totalLugares} lugares em ${categoriasComLugares} categorias`;

  return (
    <div ref={headerShellRef} className="explorar-header-shell -mx-4 px-4 pt-5 pb-4">
      <div className="explorar-header-top">
        <div className="mb-3 flex items-center gap-2.5">
          <Logo size="md" variant="default" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a4a3a]/70">
            Guia de Bolso
          </p>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a4a3a]/75">
          Descoberta local
        </p>
        <h1 className="mt-1 font-display text-[1.75rem] font-bold leading-[1.12] tracking-tight text-[#1a2e28]">
          Explorar
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={HOME_CONTEXT_PILL_CLASS} aria-label="Imbituba, SC">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-[#1a4a3a]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span className="truncate">Imbituba, SC</span>
          </span>
        </div>

        <p className="mt-3 mb-0 text-sm font-medium text-[#5a6b66]">{subtitulo}</p>
      </div>

      <div className="explorar-header-search-slot mt-1">
        {loading ? (
          <div
            className="home-explorar-search-section mb-6 mt-4 h-[60px] animate-pulse rounded-[24px] bg-[#e8eeee]"
            aria-hidden
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
