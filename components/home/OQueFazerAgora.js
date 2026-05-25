"use client";

import { useState } from "react";
import Link from "next/link";
import { getCapaFromLugar } from "@/lib/fotos";
import { getBadgeParceiroLabel } from "@/lib/destaques";
import { getTempoExperiencia, isEmAlta } from "@/lib/homeContext";
import HomeSectionHeader from "@/components/home/HomeSectionHeader";

/**
 * Extrai distância em km a partir do texto formatado ("2.3km de você", "500m de você").
 * @param {string} [texto]
 * @returns {number|null}
 */
function parseDistanciaKm(texto) {
  if (!texto || typeof texto !== "string") return null;

  const kmMatch = texto.match(/([\d.,]+)\s*km/i);
  if (kmMatch) {
    const km = Number(kmMatch[1].replace(",", "."));
    return Number.isFinite(km) ? km : null;
  }

  const mMatch = texto.match(/([\d.,]+)\s*m\b/i);
  if (mMatch) {
    const metros = Number(mMatch[1].replace(",", "."));
    return Number.isFinite(metros) ? metros / 1000 : null;
  }

  return null;
}

/**
 * Estima tempo de carro em cidade (30 km/h), arredondado ao múltiplo de 5 min.
 * @param {number|null} distanciaKm
 * @returns {string|null}
 */
function getTempoCarro(distanciaKm) {
  if (!Number.isFinite(distanciaKm) || distanciaKm <= 0) return null;

  const minutos = (distanciaKm / 30) * 60;
  const arredondado = Math.round(minutos / 5) * 5;
  const final = Math.max(5, arredondado);

  return `~${final} min`;
}

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.icon
 * @param {string} props.value
 * @returns {import('react').ReactElement}
 */
function MetricPill({ icon, value }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-2 backdrop-blur-md">
      <span className="inline-flex shrink-0 text-white/90" aria-hidden>
        {icon}
      </span>
      <span className="text-xs font-semibold tabular-nums text-white">{value}</span>
    </div>
  );
}

function IconPin() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm1 11H7v-2h4V7h2v7z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9.24-2.16l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.8zM20 13h3v-2h-3v2zM6.76 19.16l-1.42 1.42 1.79 1.8 1.41-1.41-1.78-1.81zM12 6a6 6 0 100 12 6 6 0 000-12z" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v7c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-7l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

function HeroSkeleton() {
  return (
    <section className="mb-10 home-reveal">
      <HomeSectionHeader eyebrow="Sugestão do momento" title="O que fazer agora" />
      <div className="relative min-h-[440px] overflow-hidden rounded-[32px] bg-[#e8eeee] shadow-[0_12px_40px_rgba(26,46,40,0.08)] ring-1 ring-[#e8eeee]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#d8e8e2] to-[#eef2f0]" />
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
          <div className="h-7 w-2/3 rounded-xl bg-white/40" />
          <div className="h-4 w-full rounded-lg bg-white/30" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 rounded-full bg-white/25" />
            ))}
          </div>
          <div className="h-12 rounded-2xl bg-[#1a4a3a]/20" />
        </div>
      </div>
    </section>
  );
}

/**
 * OQueFazerAgora - Hero suggestion card for the top contextual place pick.
 */
export default function OQueFazerAgora({
  lugar,
  popularIds,
  temperatura = null,
  onFavoritar,
  isFavorito,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!lugar) {
    return <HeroSkeleton />;
  }

  const distancia = lugar.distancia_calculada || lugar.distancia;
  const distanciaKm = parseDistanciaKm(distancia);
  const tempoCarro = getTempoCarro(distanciaKm);
  const tempNum = Number(temperatura);
  const temperaturaExibicao = Number.isFinite(tempNum)
    ? `${Math.round(tempNum)}°`
    : "--°";
  const emAlta = isEmAlta(lugar.id, popularIds);
  const favorito = isFavorito?.(lugar);
  const capa = getCapaFromLugar(lugar);

  return (
    <section className="mb-10 home-reveal">
      <HomeSectionHeader eyebrow="Sugestão do momento" title="O que fazer agora" />

      <article className="group relative min-h-[460px] overflow-hidden rounded-[32px] shadow-[0_16px_48px_rgba(11,31,26,0.22)] ring-1 ring-black/8 transition-shadow duration-300 hover:shadow-[0_20px_56px_rgba(11,31,26,0.28)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={capa}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className={`home-image-fade absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            imgLoaded ? "is-loaded" : ""
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061612] via-[#061612]/70 to-[#061612]/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/25" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {lugar.ehParceiro && (
              <span className="rounded-full bg-[#f5e6b8]/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#7a6520] shadow-sm">
                {getBadgeParceiroLabel()}
              </span>
            )}
            {emAlta && !lugar.ehParceiro && (
              <span className="rounded-full bg-[#f5d76e]/95 px-3 py-1.5 text-[10px] font-bold text-[#5c4200] shadow-sm">
                Em alta hoje 🔥
              </span>
            )}
            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
              {lugar.categoria}
            </span>
          </div>
          {onFavoritar && (
            <button
              type="button"
              onClick={() => onFavoritar(lugar)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur-md transition-transform active:scale-90"
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
          <h3 className="font-display text-[1.65rem] font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-sm">
            {lugar.nome}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/90">
            {lugar.descricao}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <MetricPill icon={<IconPin />} value={distancia || "—"} />
            <MetricPill icon={<IconClock />} value={getTempoExperiencia(lugar)} />
            <MetricPill icon={<IconSun />} value={temperaturaExibicao} />
            <MetricPill icon={<IconCar />} value={tempoCarro || "—"} />
          </div>

          <Link
            href={`/lugares/${lugar.id}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4a3a] py-4 text-center text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_24px_rgba(26,74,58,0.45)] transition-transform active:scale-[0.98]"
          >
            Explorar
            <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
