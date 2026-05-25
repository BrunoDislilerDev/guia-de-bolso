"use client";

import { useEffect, useState } from "react";
import ClimaSheet from "@/components/ClimaSheet";
import {
  fetchClimaApisCached,
  formatNumber,
} from "@/lib/clima";

/**
 * Classes do badge de condição de banho/mar.
 * @param {'good'|'rough'|'moderate'|string} tone
 * @returns {string}
 */
function bathBadgeClass(tone) {
  if (tone === "good") return "bg-emerald-100 text-emerald-800";
  if (tone === "rough") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

/**
 * LugarClimaWidget - Resumo de clima/mar no detalhe do lugar; sheet completo para logados.
 * @param {object} props
 * @param {string} props.nomeLugar - Nome do lugar para título do sheet.
 * @param {number} props.latitude
 * @param {number} props.longitude
 * @param {object|null} props.user - Usuário autenticado ou null.
 * @param {() => void} [props.onLoginRequired] - Abre modal de login para ver o sheet.
 * @returns {import('react').ReactElement|null}
 */
function ChevronRight({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function LugarClimaWidget({
  nomeLugar,
  latitude,
  longitude,
  user,
  onLoginRequired,
  variant = "default",
}) {
  const isPremium = variant === "premium";
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErro(false);

      try {
        const data = await fetchClimaApisCached(latitude, longitude);
        if (!cancelled) setClima(data);
      } catch (error) {
        console.error("Erro ao buscar clima do lugar:", error);
        if (!cancelled) {
          setClima(null);
          setErro(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  const handlePress = () => {
    if (!clima || loading) return;

    if (user) {
      setSheetOpen(true);
      return;
    }

    onLoginRequired?.();
  };

  if (erro) {
    return null;
  }

  if (loading) {
    return (
      <section
        className={isPremium ? "" : "mt-5"}
        aria-busy="true"
        aria-label="Carregando condições do clima"
      >
        <div
          className={`animate-pulse rounded-2xl bg-white px-4 py-4 shadow-[0_8px_32px_rgba(26,46,40,0.06)] ring-1 ring-[#e8eeee] ${
            isPremium ? "min-h-[120px]" : ""
          }`}
        >
          <div className="h-4 w-28 rounded bg-[#e3e9e6]" />
          <div className="mt-3 h-8 w-24 rounded bg-[#e3e9e6]" />
          <div className="mt-2.5 h-5 w-4/5 rounded bg-[#e3e9e6]" />
        </div>
      </section>
    );
  }

  if (!clima) return null;

  const tempLabel = `${formatNumber(clima.temperature, 0)}°C`;
  const ctaLabel = user ? "Ver mais" : "Entrar";

  if (isPremium) {
    return (
      <>
        <section>
          <button
            type="button"
            onClick={handlePress}
            className="flex w-full flex-col gap-3 rounded-2xl bg-white px-5 py-4 text-left shadow-[0_8px_32px_rgba(26,46,40,0.07)] ring-1 ring-[#e8eeee] transition-transform active:scale-[0.995] active:bg-[#f7faf9]"
          >
            <div className="flex items-start gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d4ede8] text-3xl"
                aria-hidden
              >
                {clima.weatherEmoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6b66]">
                  Agora
                </p>
                <p className="mt-0.5 text-[32px] font-bold leading-none tracking-tight text-[#1a2e28]">
                  {tempLabel}
                </p>
                <p className="mt-1 text-sm font-medium text-[#3d4f4a]">{clima.condition}</p>
                <p className="mt-0.5 text-xs text-[#5a6b66]">
                  Ondas {formatNumber(clima.waveHeight)} m
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-0.5 pt-1 text-sm font-bold text-[#1a4a3a]">
                {ctaLabel}
                <ChevronRight />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[#eef2f0] pt-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${bathBadgeClass(
                  clima.bathStatus.tone
                )}`}
              >
                {clima.bathStatus.label}
              </span>
              <span className="text-xs font-medium text-[#5a6b66]">
                Vento {formatNumber(clima.windSpeed, 0)} km/h {clima.windCompass}
              </span>
            </div>
          </button>
        </section>

        <ClimaSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          praia={{ nome: nomeLugar }}
          clima={clima}
        />
      </>
    );
  }

  const resumoLinha = [
    tempLabel,
    clima.condition,
    `Ondas ${formatNumber(clima.waveHeight)} m`,
  ].join(" · ");

  return (
    <>
      <section className="mt-5">
        <button
          type="button"
          onClick={handlePress}
          className="flex w-full flex-col gap-2.5 rounded-2xl bg-white px-4 py-3.5 text-left shadow-sm ring-1 ring-[#e8eeee] transition-colors active:bg-[#f7faf9]"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4ede8] text-2xl"
              aria-hidden
            >
              {clima.weatherEmoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5a6b66]">
                Condições agora
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-[#1a2e28]">
                {resumoLinha}
              </p>
            </div>
            <span className="shrink-0 text-xs font-bold text-[#1a4a3a]">
              {user ? "Ver mais →" : "Entrar →"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pl-14">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${bathBadgeClass(
                clima.bathStatus.tone
              )}`}
            >
              {clima.bathStatus.label}
            </span>
            <span className="text-[11px] text-[#5a6b66]">
              Vento {formatNumber(clima.windSpeed, 0)} km/h {clima.windCompass}
            </span>
          </div>
        </button>
      </section>

      <ClimaSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        praia={{ nome: nomeLugar }}
        clima={clima}
      />
    </>
  );
}
