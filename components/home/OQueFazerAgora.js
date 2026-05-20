"use client";

import Link from "next/link";
import { getCapaFromLugar } from "@/lib/fotos";
import { getTempoExperiencia, isEmAlta } from "@/lib/homeContext";

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
 * @param {string} props.label
 * @param {import('react').ReactNode} props.icon
 * @param {string} props.value
 * @returns {import('react').ReactElement}
 */
function MetricBlock({ label, icon, value }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
      <p className="flex items-center gap-1 text-white/70">
        <span className="inline-flex shrink-0 opacity-90" aria-hidden>
          {icon}
        </span>
        {label}
      </p>
      <p className="mt-0.5 font-semibold text-white">{value}</p>
    </div>
  );
}

/** @returns {import('react').ReactElement} */
function IconPin() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

/** @returns {import('react').ReactElement} */
function IconClock() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm1 11H7v-2h4V7h2v7z" />
    </svg>
  );
}

/** @returns {import('react').ReactElement} */
function IconSun() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9.24-2.16l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.8zM20 13h3v-2h-3v2zM6.76 19.16l-1.42 1.42 1.79 1.8 1.41-1.41-1.78-1.81zM12 6a6 6 0 100 12 6 6 0 000-12z" />
    </svg>
  );
}

/** @returns {import('react').ReactElement} */
function IconCar() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v7c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-7l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

/**
 * OQueFazerAgora - Hero suggestion card for the top contextual place pick.
 * @param {object} props
 * @param {object|null} props.lugar - Featured place record, or null while loading.
 * @param {Set<string>|string[]} props.popularIds - IDs of places trending today.
 * @param {number|null} [props.temperatura] - Temperatura atual da região (Open-Meteo na home).
 * @param {(lugar: object) => void} [props.onFavoritar] - Favorite toggle handler.
 * @param {(lugar: object) => boolean} [props.isFavorito] - Returns whether the place is favorited.
 * @returns {import('react').ReactElement}
 */
export default function OQueFazerAgora({
  lugar,
  popularIds,
  temperatura = null,
  onFavoritar,
  isFavorito,
}) {
  if (!lugar) {
    return (
      <section className="mb-8 mt-6">
        <h2 className="mb-3 text-lg font-bold text-[#1a2e28]">O que fazer agora</h2>
        <div className="rounded-3xl bg-white p-6 text-center text-sm text-[#5a6b66] shadow-sm">
          Carregando sugestão para você...
        </div>
      </section>
    );
  }

  const distancia = lugar.distancia_calculada || lugar.distancia;
  const distanciaKm = parseDistanciaKm(distancia);
  const tempoCarro = getTempoCarro(distanciaKm);
  const tempNum = Number(temperatura);
  const temperaturaExibicao = Number.isFinite(tempNum)
    ? `${Math.round(tempNum)}°C`
    : "--°C";
  const emAlta = isEmAlta(lugar.id, popularIds);
  const favorito = isFavorito?.(lugar);

  return (
    <section className="mb-8 mt-6">
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
            <MetricBlock
              label="Distância"
              icon={<IconPin />}
              value={distancia || "—"}
            />
            <MetricBlock
              label="Tempo da experiência"
              icon={<IconClock />}
              value={getTempoExperiencia(lugar)}
            />
            <MetricBlock
              label="Temperatura"
              icon={<IconSun />}
              value={temperaturaExibicao}
            />
            <MetricBlock
              label="De carro"
              icon={<IconCar />}
              value={tempoCarro || "—"}
            />
          </div>

          <Link
            href={`/lugares/${lugar.id}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-bold text-white shadow-lg transition-transform active:scale-[0.98]"
          >
            EXPLORAR
            <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
