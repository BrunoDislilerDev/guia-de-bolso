"use client";

import Image from "next/image";
import Link from "next/link";
import { getStatusFuncionamento } from "@/lib/horarios";
import { getCapaFromLugar } from "@/lib/fotos";
import { getBadgeParceiroLabel } from "@/lib/destaques";
import { getTagsFromLugar } from "@/lib/tags";

/**
 * IconPin - Location pin icon for distance display.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconPin({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

/**
 * FavoriteIcon - Heart icon reflecting favorite state.
 * @param {object} props
 * @param {boolean} props.active - Whether the place is favorited.
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function FavoriteIcon({ active, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

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
 * PlaceCard - Full-height place card with image, status, and optional favorite action.
 * @param {object} props
 * @param {object} props.lugar - Place record from Supabase.
 * @param {boolean} [props.isFavorito] - Whether the current user favorited this place.
 * @param {(lugar: object) => void} [props.onFavoritar] - Called when the favorite button is pressed.
 * @param {boolean} [props.priority] - Preload image for above-the-fold cards.
 * @returns {import('react').ReactElement}
 */
export default function PlaceCard({
  lugar,
  isFavorito = false,
  onFavoritar,
  priority = false,
}) {
  const status = getStatusFuncionamento(lugar.horarios, lugar.mostrar_horarios);
  const distancia = lugar.distancia_calculada || lugar.distancia;
  const tags = lugar.ehParceiro ? getTagsFromLugar(lugar).slice(0, 2) : [];
  const rating = getRatingMedio(lugar);
  const imagemUrl = getCapaFromLugar(lugar);

  return (
    <article className="relative min-h-[380px] overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
      {imagemUrl ? (
        <Image
          src={imagemUrl}
          alt={lugar.nome}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
        {rating !== null && (
          <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            ⭐ {rating.toFixed(1)}
          </span>
        )}
        <span className="rounded-full bg-[#d4ede8] px-3 py-1 text-xs font-semibold text-[#1a4a3a]">
          {lugar.categoria}
        </span>
        {lugar.ehParceiro && (
          <span className="rounded-full bg-[#f5e6b8] px-3 py-1 text-xs font-bold text-[#7a6520]">
            {getBadgeParceiroLabel()}
          </span>
        )}
      </div>
      {status && (
        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
            status.aberto ? "bg-[#1a4a3a]" : "bg-[#d9534f]"
          }`}
          title={status.resumo || status.detail || status.label}
        >
          {status.label}
        </span>
      )}

      <Link
        href={`/lugares/${lugar.id}`}
        className="absolute inset-0 flex flex-col justify-end p-4 pr-16"
      >
        <div>
          <h3 className="text-2xl font-bold leading-tight text-white">
            {lugar.nome}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
            {lugar.descricao}
          </p>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1a2e28] shadow-sm"
                >
                  {tag.icone && <span className="mr-1">{tag.icone}</span>}
                  {tag.nome}
                </span>
              ))}
            </div>
          )}
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-white">
            <IconPin className="h-4 w-4 text-white" />
            {distancia}
          </p>
        </div>
      </Link>

      {onFavoritar && (
        <button
          type="button"
          onClick={() => onFavoritar(lugar)}
          className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur-md"
          aria-label={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <FavoriteIcon active={isFavorito} />
        </button>
      )}
    </article>
  );
}
