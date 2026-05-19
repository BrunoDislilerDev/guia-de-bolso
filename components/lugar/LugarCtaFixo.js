"use client";

/**
 * Barra fixa inferior com botão principal (ex.: "IR AGORA").
 * @param {object} props
 * @param {string} props.label - Texto do botão.
 * @param {() => void} props.onClick - Ação ao tocar (navegação, sheet de mapas, etc.).
 * @returns {import("react").JSX.Element}
 */
export default function LugarCtaFixo({ label, onClick }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4a3a] py-4 text-base font-bold text-white shadow-[0_-4px_24px_rgba(26,74,58,0.35)] active:scale-[0.99] active:opacity-95"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          {label}
        </button>
      </div>
    </div>
  );
}
