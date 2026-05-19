"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import LoginModal from "@/components/LoginModal";
import Onboarding from "@/components/Onboarding";
import PremiumPaywallSheet from "@/components/PremiumPaywallSheet";
import EmAltaHoje from "@/components/home/EmAltaHoje";
import HomeContextHeader from "@/components/home/HomeContextHeader";
import OQueFazerAgora from "@/components/home/OQueFazerAgora";
import PertoDeVoce from "@/components/home/PertoDeVoce";
import PlanosRapidos from "@/components/home/PlanosRapidos";
import SearchBrowsePanel from "@/components/home/SearchBrowsePanel";
import SearchResultsPanel from "@/components/home/SearchResultsPanel";
import SearchStatusFilter from "@/components/home/SearchStatusFilter";
import SmartSearch from "@/components/home/SmartSearch";
import { FILTRO_STATUS_BUSCA } from "@/lib/busca";
import { fetchClimaApis } from "@/lib/clima";
import {
  IMBITUBA_COORDS,
  getFraseContextual,
  pickHeroLugar,
  sortLugaresPorDistancia,
} from "@/lib/homeContext";
import { fetchLugaresPopulares } from "@/lib/lugaresPopulares";
import { getLugaresVisitados } from "@/lib/lugaresVisitados";
import { withDistanciaDinamica } from "@/lib/localizacao";
import { canUseBusca } from "@/lib/premium";
import { usePremiumUsage } from "@/lib/usePremiumUsage";
import { createClient } from "@/lib/supabase";
import { registrarLog } from "@/lib/logs";

const LUGAR_SELECT = "*, localizacoes(*), lugares_tags(tags(*))";

function getUserInitial(user) {
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "?";
  return name.charAt(0).toUpperCase();
}

async function fetchLugaresAtivos(limit = 50) {
  const supabase = createClient();
  const { data } = await supabase
    .from("lugares")
    .select(LUGAR_SELECT)
    .eq("status", "ativo")
    .limit(limit);

  return data ?? [];
}

async function fetchLugaresProximos() {
  const supabase = createClient();
  const { data } = await supabase
    .from("lugares")
    .select(LUGAR_SELECT)
    .eq("status", "ativo")
    .eq("destaque", false)
    .limit(6);

  return data ?? [];
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [lugaresAtivos, setLugaresAtivos] = useState([]);
  const [lugaresPopulares, setLugaresPopulares] = useState([]);
  const [lugaresProximos, setLugaresProximos] = useState([]);
  const [contextualPhrase, setContextualPhrase] = useState(
    "Descubra o melhor da região agora"
  );
  const [homeLoading, setHomeLoading] = useState(true);

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
  const [filtroBuscaStatus, setFiltroBuscaStatus] = useState(FILTRO_STATUS_BUSCA.TODOS);

  const {
    usage: premiumUsage,
    refresh: refreshPremiumUsage,
    setUsage: setPremiumUsage,
  } = usePremiumUsage(user);

  const popularIds = useMemo(
    () => new Set(lugaresPopulares.map((l) => l.id)),
    [lugaresPopulares]
  );

  const heroLugar = useMemo(() => {
    const withDist = lugaresAtivos.map((l) => withDistanciaDinamica(l, userPosition));
    return pickHeroLugar(withDist, userPosition, popularIds);
  }, [lugaresAtivos, userPosition, popularIds]);

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
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (!currentUser) setFavoritos([]);
      setAuthLoading(false);
      registrarLog(supabase, currentUser, "acessou_app");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setFavoritos([]);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;

    let cancelled = false;
    setHomeLoading(true);
    const supabase = createClient();

    Promise.all([
      fetchLugaresAtivos(),
      fetchLugaresPopulares(supabase, 8),
      fetchLugaresProximos(),
      fetchClimaApis(IMBITUBA_COORDS.latitude, IMBITUBA_COORDS.longitude).catch(
        () => null
      ),
    ])
      .then(([ativos, populares, proximos, clima]) => {
        if (cancelled) return;
        setLugaresAtivos(ativos);
        setLugaresPopulares(populares);
        setLugaresProximos(proximos);
        setContextualPhrase(getFraseContextual(clima));
      })
      .finally(() => {
        if (!cancelled) setHomeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading]);

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

    function handleEscape(event) {
      if (event.key === "Escape") fecharBusca();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchMode]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("favoritos")
      .select("lugar_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setFavoritos((data ?? []).map((f) => String(f.lugar_id)));
      });
  }, [user]);

  async function handleFavoritar(lugar) {
    if (!user) {
      setMotivoModal("favoritar");
      setIsModalOpen(true);
      return;
    }

    const supabase = createClient();
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

  function fecharBusca() {
    setSearchMode(null);
    setTermoBusca("");
    setTermoResultado("");
    setResultadosBusca([]);
    setLoadingBusca(false);
    searchInputRef.current?.blur();
  }

  function handleSearchFocus() {
    setVisitadosRecentes(getLugaresVisitados());
    if (searchMode === "results" && termoBusca.trim()) return;
    setSearchMode("browse");
  }

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

  function abrirPaywall(feature) {
    setPaywallFeature(feature);
    setPaywallOpen(true);
  }

  async function executarBusca(query, filtroOverride) {
    const termo = query.trim();
    if (!termo) return;

    if (!user) {
      setMotivoModal("busca");
      setIsModalOpen(true);
      return;
    }

    const access = canUseBusca(premiumUsage, Boolean(user));
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
          abrirPaywall("busca");
          await refreshPremiumUsage();
          setSearchMode("browse");
          return;
        }
        setErroBusca(data.error ?? "Erro na busca");
        setResultadosBusca([]);
        return;
      }

      setResultadosBusca(data.lugares ?? []);
      if (data.message && !(data.lugares ?? []).length) {
        setErroBusca(data.message);
      }
      if (data.usage) setPremiumUsage(data.usage);
      else await refreshPremiumUsage();
    } catch {
      setErroBusca("Não foi possível concluir a busca. Tente novamente.");
      setResultadosBusca([]);
    } finally {
      setLoadingBusca(false);
    }
  }

  function handlePlanoClick(plano) {
    setFiltroBuscaStatus(plano.filtro);
    searchInputRef.current?.focus();
    executarBusca(plano.query, plano.filtro);
  }

  const isFavorito = (lugar) => favoritos.includes(String(lugar.id));
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  if (!onboardingChecked || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando...
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-32 pt-5">
        <HomeContextHeader
          user={user}
          avatarUrl={avatarUrl}
          contextualPhrase={contextualPhrase}
          getUserInitial={getUserInitial}
        />

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
          {user && premiumUsage && searchMode && (
            <p className="mb-2 text-center text-[10px] text-[#8a9a95]">
              {premiumUsage.premium
                ? "Premium · buscas ilimitadas"
                : `IA ${premiumUsage.buscas.used}/${premiumUsage.buscas.limit} este mês`}
            </p>
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
              <OQueFazerAgora
                lugar={heroLugar}
                popularIds={popularIds}
                onFavoritar={handleFavoritar}
                isFavorito={isFavorito}
              />
              <EmAltaHoje lugares={emAltaExibidos} />
              <PlanosRapidos onPlanoClick={handlePlanoClick} />
              <PertoDeVoce
                user={user}
                lugares={proximosExibidos}
                isFavorito={isFavorito}
                onFavoritar={handleFavoritar}
              />
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
