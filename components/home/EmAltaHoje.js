"use client";

import EmAltaCard from "@/components/home/EmAltaCard";
import HomeSectionHeader from "@/components/home/HomeSectionHeader";
import { HOME_CAROUSEL_TRACK_CLASS } from "@/components/home/homeTokens";

/**
 * EmAltaHoje - Horizontal carousel of trending places for today.
 */
export default function EmAltaHoje({ lugares = [] }) {
  if (!lugares.length) return null;

  return (
    <section className="mb-10 home-reveal overflow-visible" style={{ animationDelay: "80ms" }}>
      <HomeSectionHeader eyebrow="Tendências" title="🔥 Em alta hoje" />
      <div className={`${HOME_CAROUSEL_TRACK_CLASS} -mx-4 px-4`}>
        {lugares.map((lugar, index) => (
          <EmAltaCard key={lugar.id} lugar={lugar} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}
