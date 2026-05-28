"use client";

import { motion } from "framer-motion";
import { useCountUp } from "@/components/landing/useCountUp";
import { fadeUp, staggerContainer, defaultViewport } from "@/components/landing/landingMotion";

/**
 * @param {object} props
 * @param {{ totalLugares: number, categoriasComLugares: number, parceirosCount: number, rotasCount: number }} props.stats
 * @param {boolean} [props.hasLiveData]
 * @returns {import('react').ReactElement}
 */
export default function LandingStatsBar({ stats, hasLiveData = false }) {
  const lugares = useCountUp(stats.totalLugares);
  const categorias = useCountUp(stats.categoriasComLugares);
  const parceiros = useCountUp(stats.parceirosCount);
  const rotas = useCountUp(stats.rotasCount);

  const items = [
    { label: "Lugares no guia", value: lugares, suffix: "+" },
    { label: "Categorias", value: categorias },
    { label: "Parceiros", value: parceiros },
    { label: "Rotas", value: rotas },
  ];

  return (
    <motion.div
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#7fd4ae]/25 bg-white/95 p-4 shadow-lg shadow-[#1a4a3a]/8 backdrop-blur-md sm:grid-cols-4 sm:gap-4 sm:p-6">
        {items.map((item) => (
          <motion.div key={item.label} variants={fadeUp} className="text-center sm:text-left">
            <p className="font-display text-2xl font-bold tabular-nums text-[#1a4a3a] sm:text-3xl">
              {hasLiveData ? (
                <>
                  {item.value}
                  {item.suffix ?? ""}
                </>
              ) : (
                "—"
              )}
            </p>
            <p className="mt-1 text-xs font-medium text-[#5a6b66] sm:text-sm">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
