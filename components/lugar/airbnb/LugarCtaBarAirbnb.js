"use client";

/**
 * Barra fixa inferior estilo Airbnb: contexto à esquerda, CTA à direita.
 * @param {{ label: string, subtitle?: string|null, onClick: () => void }} props
 * @returns {import("react").JSX.Element}
 */
export default function LugarCtaBarAirbnb({ label, subtitle, onClick }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e8eeee] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          {subtitle && (
            <p className="truncate text-xs font-medium text-[#5a6b66]">{subtitle}</p>
          )}
          <p className="text-sm font-semibold text-[#1a2e28]">Imbituba · Guia de Bolso</p>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="shrink-0 rounded-lg bg-[#1a4a3a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
