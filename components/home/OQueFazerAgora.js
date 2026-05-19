"use client";

import Link from "next/link";
import { getCapaFromLugar } from "@/lib/fotos";
import {
  getMelhorHorario,
  getTempoExperiencia,
  isEmAlta,
} from "@/lib/homeContext";

export default function OQueFazerAgora({ lugar, popularIds, onFavoritar, isFavorito }) {
  if (!lugar) {
    return (
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-[#1a2e28]">O que fazer agora</h2>
        <div className="rounded-3xl bg-white p-6 text-center text-sm text-[#5a6b66] shadow-sm">
          Carregando sugestão para você...
        </div>
      </section>
    );
  }

  const distancia = lugar.distancia_calculada || lugar.distancia;
  const emAlta = isEmAlta(lugar.id, popularIds);
  const favorito = isFavorito?.(lugar);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1a4a3a]">
            Sugestão do momento
          </p>
          <h2 className="text-xl font-bold text-[#1a2e28]">O que fazer agora</h2>
        </div>
      </div>

      <article className="relative min-h-[440px] overflow-hidden rounded-[28px] shadow-lg ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getCapaFromLugar(lugar)}
          alt={lugar.nome}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f1a] via-[#0b1f1a]/55 to-[#0b1f1a]/25" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {emAlta && (
              <span className="rounded-full bg-[#f5d76e] px-3 py-1 text-xs font-bold text-[#5c4200]">
                Em alta hoje 🔥
              </span>
            )}
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {lugar.categoria}
            </span>
          </div>
          {onFavoritar && (
            <button
              type="button"
              onClick={() => onFavoritar(lugar)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
              aria-label={favorito ? "Remover dos favoritos" : "Favoritar"}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill={favorito ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
          <h3 className="text-2xl font-extrabold leading-tight text-white">{lugar.nome}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/85">
            {lugar.descricao}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-md">
              <p className="text-white/70">Distância</p>
              <p className="mt-0.5 font-semibold text-white">{distancia || "—"}</p>
            </div>
            <div className="rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-md">
              <p className="text-white/70">Melhor horário</p>
              <p className="mt-0.5 font-semibold text-white">{getMelhorHorario(lugar)}</p>
            </div>
            <div className="col-span-2 rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-md">
              <p className="text-white/70">Tempo da experiência</p>
              <p className="mt-0.5 font-semibold text-white">{getTempoExperiencia(lugar)}</p>
            </div>
          </div>

          <Link
            href={`/lugares/${lugar.id}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7fd4ae] py-4 text-center text-sm font-bold text-[#0b2e24] shadow-lg transition-transform active:scale-[0.98]"
          >
            Começar este plano
            <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
