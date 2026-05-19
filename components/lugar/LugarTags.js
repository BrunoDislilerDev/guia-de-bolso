"use client";

/**
 * Carrossel horizontal de tags/comodidades do lugar.
 * @param {object} props
 * @param {Array<{ id: string|number, nome: string, icone?: string }>} props.tags - Tags vinculadas ao lugar.
 * @returns {import("react").JSX.Element|null}
 */
export default function LugarTags({ tags }) {
  if (!tags?.length) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2.5 text-sm font-bold text-[#1a2e28]">Comodidades</h2>
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide snap-x snap-mandatory">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="shrink-0 snap-start rounded-full bg-[#d4ede8] px-3 py-1.5 text-xs font-semibold text-[#1a4a3a]"
          >
            {tag.icone && <span className="mr-1">{tag.icone}</span>}
            {tag.nome}
          </span>
        ))}
      </div>
    </section>
  );
}
