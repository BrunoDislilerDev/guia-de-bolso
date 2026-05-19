"use client";

/**
 * Lista persuasiva "Por que ir agora" com emoji e texto por item.
 * @param {object} props
 * @param {Array<{ text: string, emoji: string }>} props.bullets - Itens de copy; vazio oculta a seção.
 * @returns {import("react").JSX.Element|null}
 */
export default function LugarPorQueIrAgora({ bullets }) {
  if (!bullets?.length) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-sm font-bold text-[#1a2e28]">Por que ir agora</h2>
      <ul className="space-y-2.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8eeee]">
        {bullets.map((item) => (
          <li key={item.text} className="flex items-start gap-3 text-sm text-[#1a2e28]">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eef6f2] text-base"
              aria-hidden
            >
              {item.emoji}
            </span>
            <span className="pt-1 font-medium leading-snug">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
