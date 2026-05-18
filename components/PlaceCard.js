"use client";

import Link from "next/link";
import { getStatusFuncionamento } from "@/lib/horarios";

function IconPin({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

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

export default function PlaceCard({ lugar, isFavorito = false, onFavoritar }) {
  const status = getStatusFuncionamento(lugar.horarios);
  const distancia = lugar.distancia_calculada || lugar.distancia;

  return (
    <article className="relative min-h-[380px] overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lugar.imagem_url}
        alt={lugar.nome}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <span className="absolute left-3 top-3 rounded-full bg-[#d4ede8] px-3 py-1 text-xs font-semibold text-[#1a4a3a]">
        {lugar.categoria}
      </span>
      <span
        className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
          status.aberto ? "bg-[#1a4a3a]" : "bg-[#d9534f]"
        }`}
      >
        {status.label}
      </span>

      <Link
        href={`/lugares/${lugar.id}`}
        className="absolute inset-0 flex flex-col justify-end p-5 pr-16"
      >
        <div>
          <h3 className="text-2xl font-bold leading-tight text-white">
            {lugar.nome}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
            {lugar.descricao}
          </p>
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
