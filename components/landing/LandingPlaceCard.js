"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getCategoriaByNome } from "@/lib/categorias";
import { getStatusFuncionamento } from "@/lib/horarios";
import { scaleIn } from "@/components/landing/landingMotion";
import { LANDING } from "@/components/landing/landingTheme";

/**
 * Card de lugar real (vitrine — sem link para o app web).
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingLugarCard} props.lugar
 * @param {number} [props.index]
 * @param {boolean} [props.priority]
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
export default function LandingPlaceCard({ lugar, index = 0, priority = false, className = "" }) {
  const cat = getCategoriaByNome(lugar.categoria);
  const status = getStatusFuncionamento(lugar.horarios, lugar.mostrarHorarios);

  return (
    <motion.article
      variants={scaleIn}
      custom={index}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#1a4a3a]/10 ${LANDING.shadow} ${className}`}
      style={{ boxShadow: LANDING.shadow }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d4ede8]">
        {lugar.capa ? (
          <Image
            src={lugar.capa}
            alt={lugar.nome}
            fill
            sizes="(max-width: 768px) 85vw, 320px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
          />
        ) : (
          <div
            className="h-full w-full bg-gradient-to-br from-[#1a4a3a] to-[#7fd4ae]/40"
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071612]/80 via-transparent to-transparent" />
        {status && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md ${
              status.aberto ? "bg-[#7fd4ae] text-[#0c241c]" : "bg-white/90 text-[#1a2e28]"
            }`}
          >
            {status.aberto ? "Aberto agora" : "Fechado"}
          </span>
        )}
        {lugar.ehParceiro && (
          <span className="absolute right-3 top-3 rounded-full bg-[#1a4a3a]/90 px-2.5 py-1 text-[10px] font-bold text-[#7fd4ae] backdrop-blur-sm">
            Parceiro
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight text-[#1a2e28]">
            {lugar.nome}
          </h3>
          {cat && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.chipClass}`}>
              {cat.icone}
            </span>
          )}
        </div>
        {lugar.categoria && (
          <p className="mt-0.5 text-xs font-medium text-[#1a4a3a]">{lugar.categoria}</p>
        )}
        {lugar.descricao && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5a6b66]">
            {lugar.descricao}
          </p>
        )}
        {lugar.endereco && (
          <p className="mt-2 truncate text-xs text-[#5a6b66]/90">📍 {lugar.endereco}</p>
        )}
        {lugar.tags?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
            {lugar.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-[#f0f4f3] px-2 py-0.5 text-[10px] font-medium text-[#1a4a3a]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}
