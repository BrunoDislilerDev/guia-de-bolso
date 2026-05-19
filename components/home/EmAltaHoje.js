"use client";

import EmAltaCard from "@/components/home/EmAltaCard";

/**
 * EmAltaHoje - Horizontal carousel of trending places for today.
 * @param {object} props
 * @param {object[]} [props.lugares] - Trending place records.
 * @returns {import('react').ReactElement|null}
 */
export default function EmAltaHoje({ lugares = [] }) {
  if (!lugares.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-[#1a2e28]">🔥 Em alta hoje</h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {lugares.map((lugar, index) => (
          <EmAltaCard key={lugar.id} lugar={lugar} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}
