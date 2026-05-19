"use client";

import EmAltaCard from "@/components/home/EmAltaCard";

export default function EmAltaHoje({ lugares = [] }) {
  if (!lugares.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-[#1a2e28]">🔥 Em alta hoje</h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {lugares.map((lugar) => (
          <EmAltaCard key={lugar.id} lugar={lugar} />
        ))}
      </div>
    </section>
  );
}
