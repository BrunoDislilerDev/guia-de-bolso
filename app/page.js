"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import LoginModal from "@/components/LoginModal";
import Onboarding from "@/components/Onboarding";
import DailyLimitCountdown from "@/components/DailyLimitCountdown";
import PremiumPaywallSheet from "@/components/PremiumPaywallSheet";
import EmAltaHoje from "@/components/home/EmAltaHoje";
import HomeContextHeader from "@/components/home/HomeContextHeader";
import OQueFazerAgora from "@/components/home/OQueFazerAgora";
import ParceirosCarrossel from "@/components/home/ParceirosCarrossel";
import PertoDeVoce from "@/components/home/PertoDeVoce";
import PlanosRapidos from "@/components/home/PlanosRapidos";
import SupabaseConfigAlert from "@/components/SupabaseConfigAlert";
import SearchBrowsePanel from "@/components/home/SearchBrowsePanel";
import SearchResultsPanel from "@/components/home/SearchResultsPanel";
import SearchStatusFilter from "@/components/home/SearchStatusFilter";
import SmartSearch from "@/components/home/SmartSearch";
import { useStickyShellRef } from "@/hooks/useHomeHeaderScroll";
import { FILTRO_STATUS_BUSCA } from "@/lib/busca";
import { buildReportContext } from "@/lib/reportContext";
import { getNetworkErrorMessage, mapApiErrorResponse } from "@/lib/userMessages";
import { fetchClimaApis } from "@/lib/clima";
import {
  IMBITUBA_COORDS,
  pickHeroLugar,
  sortLugaresPorDistancia,
} from "@/lib/homeContext";
import {
  buildParceiroIdSet,
  enrichLugaresComParceiro,
  lugaresFromDestaquesVigentes,
} from "@/lib/destaques";
import { fetchDestaquesFromApi, fetchLugaresFromApi } from "@/lib/fetchLugaresApi";
import { fetchLugaresPopulares } from "@/lib/lugaresPopulares";
import { isSupabasePublicConfigured } from "@/lib/supabase/publicEnv";
import { getLugaresVisitados } from "@/lib/lugaresVisitados";
import { withDistanciaDinamica } from "@/lib/localizacao";
import { ensurePerfil } from "@/lib/ensurePerfil";
import { LIMITS, canUseBusca, isDailyBuscaLimitReached } from "@/lib/premium";
import { usePremiumUsage } from "@/lib/usePremiumUsage";
import { createClient } from "@/lib/supabase";
import { registrarLog } from "@/lib/logs";

/** Timeout de segurança se `getSession`/`getUser` não responder (ex.: OAuth no tablet). */
const AUTH_RESOLVE_TIMEOUT_MS = 8000;

/**
 * First letter of the user's display name for the avatar fallback.
 * @param {import("@supabase/supabase-js").User | null} user - Auth user.
 * @returns {string} Uppercase initial.
 */
function getUserInitial(user) {
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "?";
  return name.charAt(0).toUpperCase();
}

/**
 * Loads active places with location and tags for the home feed.
 * @param {number} [limit=50] - Max rows to fetch.
 * @returns {Promise<object[]>} Active places.
 */
async function fetchLugaresAtivos(limit = 50) {
  return fetchLugaresFromApi({ limit });
}

/**
 * Loads nearby candidates, excluding partner spotlight ids.
 * @param {string[]} [excludeIds] - Lugar ids já em destaque/hero.
 * @returns {Promise<object[]>}
 */
async function fetchLugaresProximos(excludeIds = []) {
  const exclude = new Set(excludeIds.map(String));
  const data = await fetchLugaresFromApi({ limit: 20 });
  return data.filter((l) => !exclude.has(String(l.id))).slice(0, 6);
}


/**
 * Discreet placeholder when a home section fails to load.
 * @param {object} props
 * @param {string} [props.title] - Optional section heading.
 * @returns {import("react").ReactElement}
 */
function SectionUnavailable({ title }) {
  return (
    <section className="mb-8">
      {title ? <h2 className="mb-3 text-lg font-bold text-[#1a2e28]">{title}</h2> : null}
      <p className="py-4 text-center text-sm text-[#5a6b66]">
        Conteúdo indisponível no momento
      </p>
    </section>
  );
}

/**
 * Home page: contextual feed, smart search, favorites, and premium gates.
 * @returns {import("react").ReactElement}
 */
function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [lugaresAtivos, setLugaresAtivos] = useState([]);
  const [lugaresPopulares, setLugaresPopulares] = useState([]);
  const [lugaresProximos, setLugaresProximos] = useState([]);
  const [parceiroIds, setParceiroIds] = useState(() => new Set());
  const [lugaresParceiros, setLugaresParceiros] = useState([]);
  const [temperaturaClima, setTemperaturaClima] = useState(null);
  const [climaEmoji, setClimaEmoji] = useState(null);
  const [climaCondition, setClimaCondition] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [pertoLoading, setPertoLoading] = useState(true);
  const [sectionErrors, setSectionErrors] = useState({
    hero: false,
    emAlta: false,
    perto: false,
    clima: false,
  });

  const [termoBusca, setTermoBusca] = useState("");
  const [termoResultado, setTermoResultado] = useState("");
  const [searchMode, setSearchMode] = useState(null);
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [visitadosRecentes, setVisitadosRecentes] = useState([]);
  const [loadingPopulares, setLoadingPopulares] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [favoritos, setFavoritos] = useState([]);
  const [userPosition, setUserPosition] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivoModal, setMotivoModal] = useState("favoritar");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("geral");
  const [erroBusca, setErroBusca] = useState("");
  const [erroBuscaReportavel, setErroBuscaReportavel] = useState(false);
  const [erroBuscaContext, setErroBuscaContext] = useState(null);
  const [filtroBuscaStatus, setFiltroBuscaStatus] = useState(FILTRO_STATUS_BUSCA.TODOS);

  const {
    usage: premiumUsage,
    loading: premiumUsageLoading,
    synced: premiumUsageSynced,
    refresh: refreshPremiumUsage,
    setUsage: setPremiumUsage,
  } = usePremiumUsage(user);

  const popularIds = useMemo(
    () => new Set(lugaresPopulares.map((l) => l.id)),
    [lugaresPopulares]
  );

  const parceiroIdsKey = useMemo(
    () => Array.from(parceiroIds).sort().join(","),
    [parceiroIds]
  );

  const heroLugar = useMemo(() => {
    const withDist = lugaresAtivos.map((l) => withDistanciaDinamica(l, userPosition));
    return pickHeroLugar(withDist, userPosition, popularIds, parceiroIds);
  }, [lugaresAtivos, userPosition, popularIds, parceiroIds]);

  const emAltaExibidos = useMemo(() => {
    return lugaresPopulares
      .slice(0, 8)
      .map((l) => withDistanciaDinamica(l, userPosition));
  }, [lugaresPopulares, userPosition]);

  const proximosExibidos = useMemo(() => {
    const sorted = sortLugaresPorDistancia(lugaresProximos, userPosition);
    return sorted.map((l) => withDistanciaDinamica(l, userPosition));
  }, [lugaresProximos, userPosition]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboarding(!localStorage.getItem("onboarding_visto"));
      setOnboardingChecked(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!isSupabasePublicConfigured()) {
      setAuthLoading(false);
      return undefined;
    }

    const supabase = createClient();
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let accessLogged = false;

    function applySession(sessionUser) {
      setUser(sessionUser);
      if (!sessionUser) setFavoritos([]);
      setAuthLoading(false);
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        applySession(currentUser);
        if (currentUser && !accessLogged) {
          accessLogged = true;
          registrarLog(supabase, currentUser, "acessou_app");
          ensurePerfil(supabase, currentUser);
        }
      })
      .catch((err) => {
        console.error("[home] getSession:", err);
        applySession(null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      applySession(currentUser);
      if (currentUser && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        ensurePerfil(supabase, currentUser);
      }
      if (currentUser && !accessLogged) {
        accessLogged = true;
        registrarLog(supabase, currentUser, "acessou_app");
      }
    });

    const safetyTimer = window.setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        applySession(session?.user ?? null);
      });
    }, AUTH_RESOLVE_TIMEOUT_MS);

    return () => {
      window.clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setHomeLoading(true);

    if (!isSupabasePublicConfigured()) {
      setSectionErrors((prev) => ({ ...prev, hero: true, emAlta: true, perto: true }));
      setHomeLoading(false);
      return undefined;
    }

    async function loadPrimary() {
      try {
        const [ativosResult, popularesResult, destaquesResult] = await Promise.allSettled([
          fetchLugaresAtivos(),
          fetchLugaresPopulares(null, 8),
          fetchDestaquesFromApi(),
        ]);

        if (cancelled) return;

        const errors = { hero: false, emAlta: false };

        const destaquesVigentes =
          destaquesResult.status === "fulfilled" ? destaquesResult.value : [];
        const idsParceiros = buildParceiroIdSet(destaquesVigentes);
        setParceiroIds(idsParceiros);

        if (ativosResult.status === "fulfilled") {
          const enriched = enrichLugaresComParceiro(ativosResult.value, idsParceiros);
          setLugaresAtivos(enriched);
          setLugaresParceiros(lugaresFromDestaquesVigentes(destaquesVigentes, enriched));
        } else {
          console.error("[home] lugares ativos:", ativosResult.reason);
          errors.hero = true;
          setLugaresParceiros(lugaresFromDestaquesVigentes(destaquesVigentes));
        }

        if (popularesResult.status === "fulfilled") {
          setLugaresPopulares(
            enrichLugaresComParceiro(popularesResult.value, idsParceiros)
          );
        } else {
          console.error("[home] lugares populares:", popularesResult.reason);
          errors.emAlta = true;
        }

        setSectionErrors((prev) => ({
          ...prev,
          hero: errors.hero,
          emAlta: errors.emAlta,
        }));
      } catch (err) {
        console.error("[home] loadPrimary:", err);
        if (!cancelled) {
          setSectionErrors((prev) => ({ ...prev, hero: true, emAlta: true }));
        }
      } finally {
        setHomeLoading(false);
      }
    }

    loadPrimary();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (homeLoading) return undefined;

    let cancelled = false;
    setPertoLoading(true);

    async function loadSecondary() {
      try {
        const exclude = [...parceiroIds];
        if (heroLugar?.id) exclude.push(String(heroLugar.id));
        const [proximosResult, climaResult] = await Promise.allSettled([
          fetchLugaresProximos(exclude),
          fetchClimaApis(IMBITUBA_COORDS.latitude, IMBITUBA_COORDS.longitude),
        ]);

        if (cancelled) return;

        if (proximosResult.status === "fulfilled") {
          setLugaresProximos(
            enrichLugaresComParceiro(proximosResult.value, parceiroIds)
          );
          setSectionErrors((prev) => ({ ...prev, perto: false }));
        } else {
          setSectionErrors((prev) => ({ ...prev, perto: true }));
        }

        if (climaResult.status === "fulfilled") {
          const temp = Number(climaResult.value?.temperature);
          setTemperaturaClima(Number.isFinite(temp) ? temp : null);
          setClimaEmoji(climaResult.value?.weatherEmoji ?? null);
          setClimaCondition(climaResult.value?.condition ?? null);
          setSectionErrors((prev) => ({ ...prev, clima: false }));
        } else {
          setTemperaturaClima(null);
          setClimaEmoji(null);
          setClimaCondition(null);
          setSectionErrors((prev) => ({ ...prev, clima: true }));
        }
      } finally {
        if (!cancelled) setPertoLoading(false);
      }
    }

    loadSecondary();

    return () => {
      cancelled = true;
    };
  }, [homeLoading, parceiroIdsKey, parceiroIds, heroLugar?.id]);

  useEffect(() => {
    if (searchMode !== "browse") return undefined;

    setVisitadosRecentes(getLugaresVisitados());
    let cancelled = false;
    setLoadingPopulares(true);
    const supabase = createClient();

    fetchLugaresPopulares(supabase, 5)
      .then((data) => {
        if (!cancelled) setVisitadosRecentes(getLugaresVisitados());
      })
      .finally(() => {
        if (!cancelled) setLoadingPopulares(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchMode]);

  useEffect(() => {
    if (!searchMode) return undefined;

    /** Closes search overlay when Escape is pressed. @param {KeyboardEvent} event */
    function handleEscape(event) {
      if (event.key === "Escape") fecharBusca();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchMode]);

  useEffect(() => {
    if (!user || !isSupabasePublicConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("favoritos")
      .select("lugar_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setFavoritos((data ?? []).map((f) => String(f.lugar_id)));
      });
  }, [user]);

  /**
   * Toggles favorite state for a place; opens login modal if guest.
   * @param {object} lugar - Place to favorite or unfavorite.
   * @returns {Promise<void>}
   */
  async function handleFavoritar(lugar) {
    if (!user) {
      setMotivoModal("favoritar");
      setIsModalOpen(true);
      return;
    }

    const supabase = createClient();
    if (!supabase) return;
    const lugarId = String(lugar.id);
    const jaFavorito = favoritos.includes(lugarId);

    if (jaFavorito) {
      setFavoritos((atuais) => atuais.filter((id) => id !== lugarId));
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("lugar_id", lugar.id);
      if (error) setFavoritos((atuais) => [...atuais, lugarId]);
      else
        await registrarLog(supabase, user, "desfavoritou", {
          lugar_id: lugar.id,
          lugar_nome: lugar.nome,
        });
      return;
    }

    setFavoritos((atuais) => [...atuais, lugarId]);
    const { error } = await supabase
      .from("favoritos")
      .insert({ user_id: user.id, lugar_id: lugar.id });
    if (error) setFavoritos((atuais) => atuais.filter((id) => id !== lugarId));
    else
      await registrarLog(supabase, user, "favoritou", {
        lugar_id: lugar.id,
        lugar_nome: lugar.nome,
      });
  }

  /** Resets search UI state and blurs the input. */
  function fecharBusca() {
    setSearchMode(null);
    setTermoBusca("");
    setTermoResultado("");
    setResultadosBusca([]);
    setLoadingBusca(false);
    searchInputRef.current?.blur();
  }

  /** Opens browse mode and refreshes recently visited places. */
  function handleSearchFocus() {
    setVisitadosRecentes(getLugaresVisitados());
    if (searchMode === "results" && termoBusca.trim()) return;
    setSearchMode("browse");
  }

  /**
   * Closes browse mode on blur unless focus moved inside the search container.
   * @param {import("react").FocusEvent<HTMLInputElement>} event - Blur event.
   */
  function handleSearchBlur(event) {
    if (termoBusca.trim()) return;
    const next = event.relatedTarget;
    if (next && searchContainerRef.current?.contains(next)) return;
    window.setTimeout(() => {
      if (searchInputRef.current === document.activeElement) return;
      if (termoBusca.trim()) return;
      if (searchMode === "browse") fecharBusca();
    }, 150);
  }

  /**
   * Opens the premium paywall sheet for a feature.
   * @param {string} feature - Feature key shown in the paywall.
   */
  function abrirPaywall(feature) {
    setPaywallFeature(feature);
    setPaywallOpen(true);
  }

  /**
   * Runs AI search via `/api/buscar` with premium and login checks.
   * @param {string} query - Search text.
   * @param {string} [filtroOverride] - Optional open/closed status filter.
   * @returns {Promise<void>}
   */
  async function executarBusca(query, filtroOverride) {
    const termo = query.trim();
    if (!termo) return;

    if (!user) {
      setMotivoModal("busca");
      setIsModalOpen(true);
      return;
    }

    let usageForGate = premiumUsage;
    let usageSyncedForGate = premiumUsageSynced;

    if (!premiumUsageSynced || premiumUsageLoading) {
      usageForGate = (await refreshPremiumUsage()) ?? premiumUsage;
      usageSyncedForGate = true;
    }

    const access = canUseBusca(usageForGate, Boolean(user), {
      synced: usageSyncedForGate,
    });

    if (!access.allowed) {
      if (access.code === "LIMIT_REACHED") abrirPaywall("busca");
      else if (access.code === "LOGIN_REQUIRED") {
        setMotivoModal("busca");
        setIsModalOpen(true);
      }
      return;
    }

    const filtro = filtroOverride ?? filtroBuscaStatus;

    setTermoBusca(termo);
    setTermoResultado(termo);
    setSearchMode("results");
    setLoadingBusca(true);
    setResultadosBusca([]);
    setErroBusca("");
    setErroBuscaReportavel(false);
    setErroBuscaContext(null);

    try {
      const response = await fetch("/api/buscar", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: termo, filtroStatus: filtro }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "LOGIN_REQUIRED") {
          setMotivoModal("busca");
          setIsModalOpen(true);
          setSearchMode("browse");
          return;
        }
        if (data.code === "LIMIT_REACHED") {
          if (data.usage) setPremiumUsage(data.usage);
          else await refreshPremiumUsage();
          abrirPaywall("busca");
          setSearchMode("browse");
          return;
        }
        const mapped = mapApiErrorResponse(data, response.status);
        setErroBusca(mapped.message);
        setErroBuscaReportavel(true);
        setErroBuscaContext(
          buildReportContext({
            code: mapped.code ?? data.code,
            route: "/",
            message: mapped.message,
            extra: { query: termo },
          })
        );
        setResultadosBusca([]);
        return;
      }

      setResultadosBusca(data.lugares ?? []);
      if (data.message && !(data.lugares ?? []).length) {
        setErroBusca(data.message);
        setErroBuscaReportavel(false);
      }
      if (data.usage) setPremiumUsage(data.usage);
      else await refreshPremiumUsage();
    } catch {
      setErroBusca(getNetworkErrorMessage());
      setErroBuscaReportavel(true);
      setErroBuscaContext(
        buildReportContext({ code: "NETWORK", route: "/", extra: { query: termo } })
      );
      setResultadosBusca([]);
    } finally {
      setLoadingBusca(false);
    }
  }

  /**
   * Applies a quick-plan chip filter and triggers search.
   * @param {{ query: string, filtro: string }} plano - Quick plan preset.
   */
  function handlePlanoClick(plano) {
    setFiltroBuscaStatus(plano.filtro);
    searchInputRef.current?.focus();
    executarBusca(plano.query, plano.filtro);
  }

  useEffect(() => {
    if (!onboardingChecked || showOnboarding || authLoading) return undefined;

    const abrirBusca = searchParams.get("busca") === "1";
    const query = searchParams.get("q")?.trim();

    if (!abrirBusca && !query) return undefined;

    if (query) {
      setTermoBusca(query);
      setFiltroBuscaStatus(FILTRO_STATUS_BUSCA.TODOS);
      executarBusca(query);
      return undefined;
    }

    setVisitadosRecentes(getLugaresVisitados());
    setSearchMode("browse");
    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 200);

    return () => window.clearTimeout(focusTimer);
  }, [onboardingChecked, showOnboarding, authLoading, searchParams]);

  const stickyShellRef = useStickyShellRef();
  const isFavorito = (lugar) => favoritos.includes(String(lugar.id));
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const buscaLimiteDiarioAtingido =
    Boolean(user) && isDailyBuscaLimitReached(premiumUsage);

  /** @param {'login' | 'home'} dest */
  const handleOnboardingComplete = useCallback(
    (dest) => {
      localStorage.setItem("onboarding_visto", "true");
      setShowOnboarding(false);
      if (dest === "login") {
        router.replace("/login?from=onboarding");
      }
    },
    [router]
  );

  if (!onboardingChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando...
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <Onboarding isLoggedIn={Boolean(user)} onComplete={handleOnboardingComplete} />
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-32">
        <div className="-mx-4 px-4 pt-5">
          <HomeContextHeader
            user={user}
            avatarUrl={avatarUrl}
            temperatura={temperaturaClima}
            weatherEmoji={climaEmoji}
            weatherCondition={climaCondition}
            climaLoading={!homeLoading && pertoLoading}
            climaErro={!homeLoading && sectionErrors.clima}
            getUserInitial={getUserInitial}
          />
          <SupabaseConfigAlert />
        </div>

        <div ref={stickyShellRef} className="home-header-shell -mx-4 px-4 pb-4 pt-2">
          <SmartSearch
              searchContainerRef={searchContainerRef}
              searchInputRef={searchInputRef}
              termoBusca={termoBusca}
              searchMode={searchMode}
              onSubmit={(e) => {
                e.preventDefault();
                executarBusca(termoBusca);
              }}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onChange={setTermoBusca}
              onClose={fecharBusca}
              onChipClick={(chip) => {
                if (chip.filtro) setFiltroBuscaStatus(chip.filtro);
                executarBusca(chip.query, chip.filtro);
              }}
              showChips={!searchMode}
            />
        </div>

        <div
          className={`transition-all duration-300 ease-out ${
            searchMode
              ? "translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-3 overflow-hidden opacity-0"
          }`}
        >
          {searchMode && (
            <SearchStatusFilter
              value={filtroBuscaStatus}
              onChange={setFiltroBuscaStatus}
            />
          )}
          {user && searchMode && (
            <p className="mb-2 text-center text-[10px] text-[#8a9a95]">
              {premiumUsageLoading && !premiumUsage
                ? "Carregando uso de IA…"
                : premiumUsage?.premium
                  ? "Premium · buscas ilimitadas"
                  : `IA ${premiumUsage?.buscas?.used ?? 0}/${premiumUsage?.buscas?.limit ?? LIMITS.busca} hoje · renova à meia-noite`}
            </p>
          )}
          {buscaLimiteDiarioAtingido && searchMode && (
            <div className="mb-3">
              <DailyLimitCountdown initialMs={premiumUsage?.msUntilReset} />
            </div>
          )}
          {searchMode === "browse" && (
            <SearchBrowsePanel
              visitados={visitadosRecentes}
              populares={lugaresPopulares}
              loadingPopulares={loadingPopulares}
            />
          )}
          {searchMode === "results" && (
            <SearchResultsPanel
              termo={termoResultado}
              loading={loadingBusca}
              resultados={resultadosBusca.map((l) =>
                withDistanciaDinamica(l, userPosition)
              )}
              erro={erroBusca}
              erroReportavel={erroBuscaReportavel}
              erroReportContext={erroBuscaContext}
              onSugestaoClick={executarBusca}
              isFavorito={isFavorito}
              onFavoritar={handleFavoritar}
            />
          )}
        </div>

        <div
          className={`space-y-0 transition-all duration-300 ease-out ${
            searchMode
              ? "pointer-events-none max-h-0 -translate-y-3 overflow-hidden opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {!homeLoading && (
            <>
              {sectionErrors.hero ? (
                <SectionUnavailable title="O que fazer agora" />
              ) : (
                <OQueFazerAgora
                  lugar={heroLugar}
                  popularIds={popularIds}
                  temperatura={temperaturaClima}
                  onFavoritar={handleFavoritar}
                  isFavorito={isFavorito}
                />
              )}
              <ParceirosCarrossel
                lugares={lugaresParceiros.map((l) =>
                  withDistanciaDinamica(l, userPosition)
                )}
              />
              {sectionErrors.emAlta ? (
                <SectionUnavailable title="🔥 Em alta hoje" />
              ) : (
                <EmAltaHoje lugares={emAltaExibidos} />
              )}
              <PlanosRapidos onPlanoClick={handlePlanoClick} />
              {sectionErrors.perto ? (
                <SectionUnavailable title="Perto de você" />
              ) : pertoLoading ? (
                <section className="mb-6 home-reveal">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a4a3a]/75">
                    Descoberta complementar
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-[#1a2e28]">
                    Perto de você
                  </h2>
                  <div className="mt-4 flex gap-3.5 overflow-hidden">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-[420px] w-[300px] shrink-0 animate-pulse rounded-[28px] bg-[#e8eeee]"
                      />
                    ))}
                  </div>
                </section>
              ) : (
                <PertoDeVoce
                  user={user}
                  lugares={proximosExibidos}
                  isFavorito={isFavorito}
                  onFavoritar={handleFavoritar}
                />
              )}
            </>
          )}

          {homeLoading && (
            <div className="py-16 text-center text-sm text-[#5a6b66]">
              Montando sugestões para você...
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      <LoginModal
        isOpen={isModalOpen}
        motivo={motivoModal}
        onClose={() => setIsModalOpen(false)}
      />

      <PremiumPaywallSheet
        isOpen={paywallOpen}
        feature={paywallFeature}
        onClose={() => setPaywallOpen(false)}
        onLogin={() => {
          setPaywallOpen(false);
          setMotivoModal("premium");
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}

/**
 * @returns {import("react").ReactElement}
 */
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
          Carregando...
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}
