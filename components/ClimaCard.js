"use client";

import { useEffect, useState } from "react";
import ClimaSheet from "@/components/ClimaSheet";
import {
  fetchClimaApis,
  formatNumber,
  getUvLabel,
  normalizePraias,
} from "@/lib/clima";
import { canViewClimaDetalhes } from "@/lib/premium";
import { createClient } from "@/lib/supabase";

/**
 * Returns Tailwind classes for the sea-bathing status badge.
 * @param {'good'|'rough'|string} tone - Bathing condition tone key.
 * @returns {string} CSS class string.
 */
function bathBadgeClass(tone) {
  if (tone === "good") return "bg-emerald-100 text-emerald-800";
  if (tone === "rough") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

/**
 * ClimaCardSkeleton - Loading placeholder for the beach weather card.
 * @returns {import('react').ReactElement}
 */
function ClimaCardSkeleton() {
  return (
    <section className="mb-6 animate-pulse rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex gap-2 overflow-hidden">
        <div className="h-8 w-20 shrink-0 rounded-full bg-[#e3e9e6]" />
        <div className="h-8 w-24 shrink-0 rounded-full bg-[#e3e9e6]" />
        <div className="h-8 w-28 shrink-0 rounded-full bg-[#e3e9e6]" />
      </div>
      <div className="mt-4 h-5 w-2/3 rounded-lg bg-[#e3e9e6]" />
      <div className="mt-3 h-10 w-1/3 rounded-lg bg-[#e3e9e6]" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="h-12 rounded-xl bg-[#e3e9e6]" />
        <div className="h-12 rounded-xl bg-[#e3e9e6]" />
        <div className="h-12 rounded-xl bg-[#e3e9e6]" />
      </div>
    </section>
  );
}

/**
 * ClimaCard - Beach weather summary with beach selector and premium detail gate.
 * @param {object} props
 * @param {object|null} props.user - Authenticated Supabase user, or null.
 * @param {object|null} props.usage - Premium usage limits from the API.
 * @param {boolean} [props.usageLoading] - Whether usage data is still loading.
 * @param {() => void} [props.onLoginRequired] - Called when login is required.
 * @param {() => void} [props.onPremiumRequired] - Called when premium is required.
 * @returns {import('react').ReactElement|null}
 */
export default function ClimaCard({
  user,
  usage,
  usageLoading = false,
  onLoginRequired,
  onPremiumRequired,
}) {
  const [praias, setPraias] = useState([]);
  const [praiaSelecionada, setPraiaSelecionada] = useState(null);
  const [clima, setClima] = useState(null);
  const [loadingPraias, setLoadingPraias] = useState(true);
  const [loadingClima, setLoadingClima] = useState(false);
  const [erro, setErro] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    /**
     * Fetches active beach places from Supabase.
     * @returns {Promise<void>}
     */
    async function loadPraias() {
      setLoadingPraias(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("lugares")
        .select("id, nome, localizacoes(latitude, longitude)")
        .eq("categoria", "Natureza")
        .ilike("nome", "%praia%")
        .eq("status", "ativo");

      if (cancelled) return;

      if (error) {
        console.error("Erro ao buscar praias:", error);
        setPraias([]);
        setLoadingPraias(false);
        return;
      }

      const lista = normalizePraias(data);
      setPraias(lista);
      setPraiaSelecionada(lista[0] ?? null);
      setLoadingPraias(false);
    }

    loadPraias();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!praiaSelecionada) return undefined;

    let cancelled = false;

    /**
     * Loads weather data for the selected beach.
     * @returns {Promise<void>}
     */
    async function loadClima() {
      setLoadingClima(true);
      setErro(false);

      try {
        const dados = await fetchClimaApis(
          praiaSelecionada.latitude,
          praiaSelecionada.longitude
        );

        if (!cancelled) {
          setClima(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar clima:", error);
        if (!cancelled) {
          setClima(null);
          setErro(true);
        }
      } finally {
        if (!cancelled) {
          setLoadingClima(false);
        }
      }
    }

    loadClima();

    return () => {
      cancelled = true;
    };
  }, [praiaSelecionada]);

  /**
   * Opens the detail sheet or triggers login/premium callbacks as needed.
   * @returns {void}
   */
  function handleVerDetalhes() {
    if (!user) {
      onLoginRequired?.();
      return;
    }

    if (usageLoading) return;

    const access = canViewClimaDetalhes(usage, true);
    if (access.code === "PREMIUM_REQUIRED") {
      onPremiumRequired?.();
      return;
    }
    setSheetOpen(true);
  }

  if (!user) {
    return (
      <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-base font-bold text-[#1a2e28]">Clima nas praias</h2>
        <p className="mt-2 text-sm text-[#5a6b66]">
          Faça login para ver temperatura, ondas e condições do mar em tempo real.
        </p>
        <button
          type="button"
          onClick={onLoginRequired}
          className="mt-4 w-full rounded-xl bg-[#1a4a3a] py-3 text-sm font-semibold text-white"
        >
          Entrar para ver o clima
        </button>
      </section>
    );
  }

  if (loadingPraias) {
    return <ClimaCardSkeleton />;
  }

  if (!praias.length) {
    return null;
  }

  const uv = clima ? getUvLabel(clima.uvIndex) : null;
  const carregando = loadingClima && !clima;

  return (
    <>
      <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
          {praias.map((praia) => {
            const selected = praiaSelecionada?.id === praia.id;

            return (
              <button
                key={praia.id}
                type="button"
                onClick={() => setPraiaSelecionada(praia)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selected
                    ? "bg-[#1a4a3a] text-white"
                    : "bg-[#f0f4f3] text-[#1a4a3a] hover:bg-[#e3e9e6]"
                }`}
              >
                {praia.nome}
              </button>
            );
          })}
        </div>

        {carregando ? (
          <div className="mt-4 animate-pulse space-y-3">
            <div className="h-5 w-2/3 rounded-lg bg-[#e3e9e6]" />
            <div className="h-8 w-1/3 rounded-lg bg-[#e3e9e6]" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 rounded-xl bg-[#e3e9e6]" />
              <div className="h-12 rounded-xl bg-[#e3e9e6]" />
              <div className="h-12 rounded-xl bg-[#e3e9e6]" />
            </div>
          </div>
        ) : erro || !clima ? (
          <p className="mt-4 text-sm text-[#5a6b66]">
            Dados indisponíveis no momento
          </p>
        ) : (
          <>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1a2e28]">
                  {praiaSelecionada.nome}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>
                    {clima.weatherEmoji}
                  </span>
                  <span className="text-2xl font-bold text-[#1a4a3a]">
                    {formatNumber(clima.temperature, 0)}°C
                  </span>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${bathBadgeClass(
                  clima.bathStatus.tone
                )}`}
              >
                {clima.bathStatus.label}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-[#f0f4f3] px-2 py-2.5">
                <p className="text-[#5a6b66]">🌊 Ondas</p>
                <p className="mt-1 font-semibold text-[#1a2e28]">
                  {formatNumber(clima.waveHeight)}m
                </p>
              </div>
              <div className="rounded-xl bg-[#f0f4f3] px-2 py-2.5">
                <p className="text-[#5a6b66]">💨 Vento</p>
                <p className="mt-1 font-semibold text-[#1a2e28]">
                  {formatNumber(clima.windSpeed, 0)} km/h {clima.windCompass}
                </p>
              </div>
              <div className="rounded-xl bg-[#f0f4f3] px-2 py-2.5">
                <p className="text-[#5a6b66]">☀️ UV</p>
                <p className="mt-1 font-semibold text-[#1a2e28]">
                  {formatNumber(clima.uvIndex, 0)} — {uv?.label ?? clima.uvLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerDetalhes}
              className="mt-4 w-full text-left text-sm font-semibold text-[#1a4a3a] transition-opacity hover:opacity-80"
            >
              {usage?.premium ? "Ver detalhes →" : "Ver detalhes completos →"}
            </button>
          </>
        )}
      </section>

      <ClimaSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        praia={praiaSelecionada}
        clima={clima}
      />
    </>
  );
}
