"use client";

/**
 * Bloco de seção estilo Airbnb (título + card branco).
 * @param {{ title?: string, children: import("react").ReactNode, className?: string }} props
 * @returns {import("react").ReactElement}
 */
export default function LugarSectionAirbnb({ title, children, className = "" }) {
  return (
    <section className={`py-6 ${className}`}>
      {title && (
        <h2 className="mb-4 text-[22px] font-semibold tracking-tight text-[#1a2e28]">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/**
 * Card interno com borda suave.
 * @param {{ children: import("react").ReactNode, className?: string }} props
 * @returns {import("react").ReactElement}
 */
export function LugarCardAirbnb({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-[#e8eeee] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Divisor entre seções.
 * @returns {import("react").ReactElement}
 */
export function LugarDividerAirbnb() {
  return <hr className="border-0 border-t border-[#e8eeee]" />;
}
