"use client";

/**
 * Ícone de relógio para o resumo de horários.
 * @param {object} props
 * @param {string} [props.className] - Classes Tailwind do SVG.
 * @returns {import("react").JSX.Element}
 */
function IconClock({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm1 11H7v-2h4V7h2v7z" />
    </svg>
  );
}

/**
 * Card compacto de horário com atalho para o bottom sheet completo.
 * @param {object} props
 * @param {string} props.resumo - Texto do horário do dia (ex.: "Aberto · fecha às 18h").
 * @param {boolean} props.aberto - Destaque visual de aberto vs fechado.
 * @param {() => void} props.onVerCompletos - Abre a grade semanal de horários.
 * @returns {import("react").JSX.Element}
 */
export default function LugarHorariosCompact({ resumo, aberto, onVerCompletos }) {
  return (
    <section className="mt-5">
      <button
        type="button"
        onClick={onVerCompletos}
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-[#e8eeee] transition-colors active:bg-[#f7faf9]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              aberto ? "bg-[#d4ede8] text-[#1a4a3a]" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            <IconClock />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1a2e28]">{resumo}</p>
            <p className="text-xs text-[#5a6b66]">Toque para ver horários completos</p>
          </div>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[#1a4a3a]">→</span>
      </button>
    </section>
  );
}
