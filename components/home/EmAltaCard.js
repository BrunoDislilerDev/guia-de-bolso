"use client";

import Image from "next/image";
import Link from "next/link";
import { getCapaFromLugar } from "@/lib/fotos";
import { getStatusFuncionamento } from "@/lib/horarios";
import { getTagsFromLugar } from "@/lib/tags";

/**
 * Returns aggregated rating from the place record when available.
 * @param {object} lugar - Place record.
 * @returns {number|null} Average rating or null.
 */
function getRatingMedio(lugar) {
  const value = lugar.rating_medio ?? lugar.media_avaliacoes;
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : null;
}

/**
 * EmAltaCard - Compact trending place card for the home carousel.
 * @param {object} props
 * @param {object} props.lugar - Place record from Supabase.
 * @param {boolean} [props.priority] - Preload image for the first visible carousel card.
 * @returns {import('react').ReactElement}
 */
export default function EmAltaCard({ lugar, priority = false }) {
  const status = getStatusFuncionamento(lugar.horarios);
  const tags = getTagsFromLugar(lugar).slice(0, 2);
  const distancia = lugar.distancia_calculada || lugar.distancia;
  const rating = getRatingMedio(lugar);
  const imagemUrl = getCapaFromLugar(lugar);

  return (
    <Link
      href={`/lugares/${lugar.id}`}
      className="group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
    >
      <div className="relative h-28 overflow-hidden">
        {imagemUrl ? (
          <Image
            src={imagemUrl}
            alt={lugar.nome}
            width={400}
            height={300}
            sizes="200px"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54]" />
        )}
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            status.aberto ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {status.aberto ? "Aberto" : "Fechado"}
        </span>
        {rating !== null && (
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            ⭐ {rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-[#1a2e28]">{lugar.nome}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-[#5a6b66]">{distancia}</p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag.id ?? tag.nome}
                className="rounded-full bg-[#f0f4f3] px-2 py-0.5 text-[10px] font-medium text-[#1a4a3a]"
              >
                {tag.nome}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
