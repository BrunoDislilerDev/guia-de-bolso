"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import LoginModal from "@/components/LoginModal";
import Onboarding from "@/components/Onboarding";
import PlaceCard from "@/components/PlaceCard";
import { getCapaFromLugar } from "@/lib/fotos";
import { createClient } from "@/lib/supabase";
import { registrarLog } from "@/lib/logs";
import { withDistanciaDinamica } from "@/lib/localizacao";

function IconPin({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16 6.5 6.5 0 0016 9.5c0 1.61-.59 3.09-1.57 4.23l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function IconCloud({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );
}

function IconPerson({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

function IconLeaf({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 1.5 1 2.5 2.5 2.5 1.25 0 2.5-.75 3-2 .5 3.5 3.5 5.5 6.5 5.5 4.5 0 8-3.5 8-8 0-.5-.05-1-.15-1.5C20.5 10.5 19 9 17 8z" />
    </svg>
  );
}

function IconUtensils({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
    </svg>
  );
}

function IconMoon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a7 7 0 01-8.9-8.9A8.96 8.96 0 0012 3z" />
    </svg>
  );
}

function IconWrench({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1 0-1.4z" />
    </svg>
  );
}

function IconLodging({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function EmojiIcon({ emoji, className = "w-4 h-4" }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
      {emoji}
    </span>
  );
}

function FavoriteIcon({ active, className = "w-5 h-5" }) {
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

function IconSun({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
    </svg>
  );
}

const categories = [
  {
    label: "Natureza",
    bg: "bg-[#b8e6d4]",
    activeBg: "bg-[#7fd4ae]",
    text: "text-[#1a4a3a]",
    border: "border-[#1a4a3a]",
    Icon: IconLeaf,
  },
  {
    label: "Gastronomia",
    bg: "bg-[#f0e4d4]",
    activeBg: "bg-[#e0cbb0]",
    text: "text-[#6b5344]",
    border: "border-[#6b5344]",
    Icon: IconUtensils,
  },
  {
    label: "Noite",
    bg: "bg-[#e4d4f0]",
    activeBg: "bg-[#cbb8e0]",
    text: "text-[#5c4a6e]",
    border: "border-[#5c4a6e]",
    Icon: IconMoon,
  },
  {
    label: "Serviços",
    bg: "bg-[#c5dff5]",
    activeBg: "bg-[#9ec9ef]",
    text: "text-[#2a5a7a]",
    border: "border-[#2a5a7a]",
    Icon: IconWrench,
  },
  {
    label: "Hospedagem",
    bg: "bg-[#f5e6b8]",
    activeBg: "bg-[#e8d48a]",
    text: "text-[#7a6520]",
    border: "border-[#a8892a]",
    Icon: IconLodging,
  },
  {
    label: "Cultura",
    bg: "bg-[#e9d5ff]",
    activeBg: "bg-[#d8b4fe]",
    text: "text-[#5b21b6]",
    border: "border-[#7c3aed]",
    Icon: (props) => <EmojiIcon emoji="🏛️" {...props} />,
  },
  {
    label: "Aventura",
    bg: "bg-[#fed7aa]",
    activeBg: "bg-[#fdba74]",
    text: "text-[#9a3412]",
    border: "border-[#ea580c]",
    Icon: (props) => <EmojiIcon emoji="🧗" {...props} />,
  },
  {
    label: "Bem-estar",
    bg: "bg-[#fbcfe8]",
    activeBg: "bg-[#f9a8d4]",
    text: "text-[#9d174d]",
    border: "border-[#db2777]",
    Icon: (props) => <EmojiIcon emoji="🧘" {...props} />,
  },
  {
    label: "Compras",
    bg: "bg-[#bfdbfe]",
    activeBg: "bg-[#93c5fd]",
    text: "text-[#1d4ed8]",
    border: "border-[#2563eb]",
    Icon: (props) => <EmojiIcon emoji="🛍️" {...props} />,
  },
];

const planoStyles = {
  "Básico": "bg-zinc-200 text-zinc-700",
  "Padrão": "bg-[#b8e6d4] text-[#1a4a3a]",
  Premium: "bg-[#f5d76e] text-[#6b4e00]",
};

const imbitubaCoords = {
  latitude: -28.2342,
  longitude: -48.6612,
};

async function fetchWeather(position) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_OPENWEATHER_API_KEY não configurada");

  const params = new URLSearchParams({
    lat: String(position.latitude),
    lon: String(position.longitude),
    appid: apiKey,
    units: "metric",
    lang: "pt_br",
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`
  );

  if (!response.ok) throw new Error("Erro ao buscar clima");

  const data = await response.json();

  return {
    temperature: Number(data.main?.temp),
    icon: data.weather?.[0]?.icon ?? null,
  };
}

function getBrazilDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalizeDestaque(row) {
  const lugar = row?.lugares ?? row;
  if (!lugar) return null;

  return {
    ...lugar,
    destaque_id: row?.id ?? `fallback-${lugar.id}`,
    plano: row?.planos ?? null,
  };
}

async function fetchLugaresProximos(categoria) {
  const supabase = createClient();
  let query = supabase
    .from("lugares")
    .select("*, localizacoes(*), lugares_tags(tags(*))")
    .eq("destaque", false)
    .eq("status", "ativo")
    .limit(4);

  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  const { data } = await query;
  return data ?? [];
}

async function fetchLugaresCategoria(categoria) {
  const supabase = createClient();
  const { data } = await supabase
    .from("lugares")
    .select("*, localizacoes(*), lugares_tags(tags(*))")
    .eq("categoria", categoria)
    .eq("status", "ativo")
    .limit(4);

  return data ?? [];
}

async function fetchDestaquesHome() {
  const supabase = createClient();
  const today = getBrazilDate();

  const { data: destaquesAtivos } = await supabase
    .from("destaques")
    .select("id,lugar_id,plano_id,data_inicio,data_fim,ativo,lugares(*, localizacoes(*), lugares_tags(tags(*))),planos(*)")
    .eq("ativo", true)
    .lte("data_inicio", today)
    .gte("data_fim", today)
    .order("data_inicio", { ascending: false });

  const destaques = (destaquesAtivos ?? [])
    .map(normalizeDestaque)
    .filter(Boolean)
    .filter((lugar) => lugar.status === "ativo");

  if (destaques.length > 0) return destaques;

  const { data: destaqueLegado } = await supabase
    .from("lugares")
    .select("*, localizacoes(*), lugares_tags(tags(*))")
    .eq("destaque", true)
    .eq("status", "ativo")
    .limit(1);

  if (destaqueLegado?.length) {
    return destaqueLegado.map((lugar) => ({ ...lugar, plano: null }));
  }

  const { data: qualquerLugar } = await supabase
    .from("lugares")
    .select("*, localizacoes(*), lugares_tags(tags(*))")
    .eq("status", "ativo")
    .limit(1);

  return (qualquerLugar ?? []).map((lugar) => ({ ...lugar, plano: null }));
}

function getUserInitial(user) {
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "?";
  return name.charAt(0).toUpperCase();
}

function DestaquesCarousel({ destaques, favoritos, onFavoritar }) {
  const scrollerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (destaques.length <= 1 || paused) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % destaques.length;
        scrollerRef.current?.scrollTo({
          left: next * scrollerRef.current.clientWidth,
          behavior: "smooth",
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [destaques.length, paused]);

  useEffect(() => {
    return () => clearTimeout(resumeTimerRef.current);
  }, []);

  function pauseTemporarily() {
    setPaused(true);
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, 6000);
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), destaques.length - 1));
  }

  function isFavorito(lugar) {
    return favoritos.includes(String(lugar.id));
  }

  return (
    <section className="mb-8">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={pauseTemporarily}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {destaques.map((lugar, index) => {
          const planoNome = lugar.plano?.nome || "Destaque";
          const destaqueLabel =
            planoNome === "Premium" ? "DESTAQUE DO DIA" : "DESTAQUE DA SEMANA";
          const distancia = lugar.distancia_calculada || lugar.distancia;

          return (
            <article
              key={`${lugar.destaque_id}-${lugar.id}`}
              className="relative min-h-[420px] w-full shrink-0 snap-start overflow-hidden rounded-2xl shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getCapaFromLugar(lugar)}
                alt={lugar.nome}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/45" />

              <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                <div className="flex flex-col items-start gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      planoStyles[planoNome] || "bg-white/85 text-[#1a4a3a]"
                    }`}
                  >
                    {planoNome}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white backdrop-blur-md">
                    {destaqueLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onFavoritar(lugar)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur-md"
                  aria-label={
                    isFavorito(lugar)
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                >
                  <FavoriteIcon active={isFavorito(lugar)} />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 pb-12">
                <h2 className="text-3xl font-extrabold leading-tight text-white">
                  {lugar.nome}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
                  {lugar.descricao}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-white">
                  <span className="flex items-center gap-1.5">
                    <IconSun className="w-4 h-4 text-[#f5d76e]" />
                    {lugar.categoria}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconPin className="w-4 h-4 text-[#b8e6d4]" />
                    {distancia}
                  </span>
                </div>
                <Link
                  href={`/lugares/${lugar.id}`}
                  className="mt-4 block w-full rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528]"
                >
                  Explorar Rota →
                </Link>
              </div>

              <span className="absolute bottom-3 right-3 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {index + 1} / {destaques.length}
              </span>
            </article>
          );
        })}
      </div>

      {destaques.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {destaques.map((lugar, index) => (
            <button
              key={`dot-${lugar.destaque_id}-${lugar.id}`}
              type="button"
              onClick={() => {
                pauseTemporarily();
                scrollerRef.current?.scrollTo({
                  left: index * scrollerRef.current.clientWidth,
                  behavior: "smooth",
                });
                setActiveIndex(index);
              }}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-6 bg-[#1a4a3a]"
                  : "w-2 bg-[#c7d1cc]"
              }`}
              aria-label={`Ir para destaque ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function WeatherBadge({ weather }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#1a4a3a] shadow-sm">
      {weather.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt=""
          className="h-5 w-5"
        />
      ) : (
        <IconCloud className="w-4 h-4 text-[#6b8f9e]" />
      )}
      {weather.loading && weather.temperature === null
        ? "..."
        : Number.isFinite(weather.temperature)
          ? `${weather.temperature.toFixed(1)}°`
          : "--°"}
    </span>
  );
}

function HorizontalSection({ title, href, lugares, userPosition }) {
  if (!lugares.length) return null;

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#1a2e28]">{title}</h2>
        <Link href={href} className="shrink-0 text-sm font-semibold text-[#1a4a3a]">
          Ver todos →
        </Link>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {lugares.map((lugar) => (
          <div key={lugar.id} className="w-[285px] shrink-0">
            <PlaceCard lugar={withDistanciaDinamica(lugar, userPosition)} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [destaques, setDestaques] = useState([]);
  const [lugaresProximos, setLugaresProximos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [categoriaSections, setCategoriaSections] = useState({
    Gastronomia: [],
    Natureza: [],
    Noite: [],
  });
  const [weather, setWeather] = useState({
    loading: true,
    temperature: null,
    icon: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivoModal, setMotivoModal] = useState("favoritar");

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
    let cancelled = false;
    const position = userPosition || imbitubaCoords;

    async function loadWeather() {
      setWeather((current) => ({ ...current, loading: true }));

      try {
        const nextWeather = await fetchWeather(position);
        if (cancelled) return;

        setWeather({
          loading: false,
          temperature: nextWeather.temperature,
          icon: nextWeather.icon,
        });
      } catch {
        if (cancelled) return;

        setWeather((current) => ({
          ...current,
          loading: false,
          temperature: current.temperature,
        }));
      }
    }

    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userPosition]);

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
    if (authLoading) return;

    let cancelled = false;

    fetchDestaquesHome().then((data) => {
      if (!cancelled) setDestaques(data);
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading]);

  useEffect(() => {
    if (authLoading || buscaAtiva) return;

    let cancelled = false;

    fetchLugaresProximos(categoriaSelecionada).then((data) => {
      if (!cancelled) setLugaresProximos(data);
    });

    return () => {
      cancelled = true;
    };
  }, [categoriaSelecionada, buscaAtiva, authLoading]);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    Promise.all([
      fetchLugaresCategoria("Gastronomia"),
      fetchLugaresCategoria("Natureza"),
      fetchLugaresCategoria("Noite"),
    ]).then(([gastronomia, natureza, noite]) => {
      if (cancelled) return;
      setCategoriaSections({
        Gastronomia: gastronomia,
        Natureza: natureza,
        Noite: noite,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading]);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    supabase
      .from("favoritos")
      .select("lugar_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setFavoritos((data ?? []).map((favorito) => String(favorito.lugar_id)));
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

      if (error) {
        setFavoritos((atuais) => [...atuais, lugarId]);
      } else {
        await registrarLog(supabase, user, "desfavoritou", {
          lugar_id: lugar.id,
          lugar_nome: lugar.nome,
        });
      }

      return;
    }

    setFavoritos((atuais) => [...atuais, lugarId]);

    const { error } = await supabase
      .from("favoritos")
      .insert({ user_id: user.id, lugar_id: lugar.id });

    if (error) {
      setFavoritos((atuais) => atuais.filter((id) => id !== lugarId));
    } else {
      await registrarLog(supabase, user, "favoritou", {
        lugar_id: lugar.id,
        lugar_nome: lugar.nome,
      });
    }
  }

  async function handleBuscar(event) {
    event.preventDefault();
    const query = termoBusca.trim();
    if (!query) return;

    setLoadingBusca(true);
    setBuscaAtiva(true);

    try {
      const response = await fetch("/api/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erro na busca");
      }

      setResultadosBusca(data.lugares ?? []);
    } catch {
      setResultadosBusca([]);
    } finally {
      setLoadingBusca(false);
    }
  }

  function handleLimparBusca() {
    setBuscaAtiva(false);
    setResultadosBusca([]);
    setLoadingBusca(false);
  }

  function handleTermoBuscaChange(value) {
    setTermoBusca(value);

    if (!value.trim()) {
      handleLimparBusca();
    }
  }

  const lugaresExibidos = (buscaAtiva ? resultadosBusca : lugaresProximos).map(
    (lugar) => withDistanciaDinamica(lugar, userPosition)
  );
  const destaquesExibidos = destaques.map((lugar) =>
    withDistanciaDinamica(lugar, userPosition)
  );
  const isFavorito = (lugar) => favoritos.includes(String(lugar.id));

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

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#1a2e28]">
              Guia de{" "}
              <span className="text-[#1a4a3a]">bolso.</span>
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <p className="flex min-w-0 items-center gap-1 text-sm text-[#5a6b66]">
                <IconPin className="w-3.5 h-3.5 shrink-0 text-[#1a4a3a]" />
                <span className="truncate">Explore Imbituba</span>
              </p>
              <WeatherBadge weather={weather} />
            </div>
          </div>
          <Link
            href={user ? "/perfil" : "/login"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1a4a3a] shadow-sm ring-2 ring-white"
            aria-label={user ? "Abrir perfil" : "Entrar"}
          >
            {user && avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
            ) : user ? (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1a4a3a] text-sm font-semibold text-white">
                {getUserInitial(user)}
              </div>
              ) : (
              <IconPerson />
            )}
          </Link>
        </header>

        {/* Search */}
        <form onSubmit={handleBuscar} className="mb-4">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa8a3]" />
            <input
              type="search"
              value={termoBusca}
              onChange={(e) => handleTermoBuscaChange(e.target.value)}
              placeholder="O que você procura? Ex: quero comer peixe fresco..."
              className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-sm text-[#1a2e28] shadow-sm placeholder:text-[#9aa8a3] focus:outline-none focus:ring-2 focus:ring-[#1a4a3a]/30"
            />
          </div>
        </form>

        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
          {categories.map(({ label, bg, activeBg, text, border, Icon }) => {
            const isSelected = categoriaSelecionada === label;
            return (
              <Link
                key={label}
                href={`/categoria/${encodeURIComponent(label)}`}
                aria-pressed={isSelected}
                className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:opacity-75 ${text} ${
                  isSelected ? `${activeBg} ${border}` : `${bg} border-transparent`
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>

        {destaquesExibidos.length > 0 && (
          <DestaquesCarousel
            destaques={destaquesExibidos}
            favoritos={favoritos}
            onFavoritar={handleFavoritar}
          />
        )}

        <section className="mt-2">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-[#1a2e28]">
              {buscaAtiva ? "Resultados da busca" : "Perto de você"}
            </h2>
            {buscaAtiva && (
              <button
                type="button"
                onClick={() => {
                  setTermoBusca("");
                  handleLimparBusca();
                }}
                className="shrink-0 text-sm font-medium text-[#1a4a3a] transition-opacity hover:opacity-80"
              >
                × Limpar busca
              </button>
            )}
          </div>
          {!user && !buscaAtiva ? (
            <div className="rounded-3xl bg-[#d4ede8] p-4 text-[#1a4a3a] shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70">
                  <IconPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Faça login para ver lugares perto de você</h3>
                  <p className="mt-1 text-sm text-[#1a4a3a]/75">
                    Use sua localização em tempo real para descobrir o que está mais próximo.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-4 block rounded-xl bg-[#1a4a3a] py-3 text-center text-sm font-semibold text-white"
              >
                Entrar
              </Link>
            </div>
          ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
            {loadingBusca ? (
              <p className="py-6 text-center text-sm text-[#5a6b66]">
                Buscando com IA...
              </p>
            ) : lugaresExibidos.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#5a6b66]">
                {buscaAtiva
                  ? "Nenhum lugar encontrado para essa busca."
                  : "Nenhum lugar por perto no momento."}
              </p>
            ) : (
              lugaresExibidos.map((lugar) => (
                <div key={lugar.id} className="w-[285px] shrink-0">
                  <PlaceCard
                    lugar={lugar}
                    isFavorito={isFavorito(lugar)}
                    onFavoritar={handleFavoritar}
                  />
                </div>
              ))
            )}
          </div>
          )}
        </section>

        <HorizontalSection
          title="Gastronomia 🍽️"
          href="/categoria/Gastronomia"
          lugares={categoriaSections.Gastronomia}
          userPosition={userPosition}
        />
        <HorizontalSection
          title="Natureza 🌿"
          href="/categoria/Natureza"
          lugares={categoriaSections.Natureza}
          userPosition={userPosition}
        />
        <HorizontalSection
          title="Noite 🌙"
          href="/categoria/Noite"
          lugares={categoriaSections.Noite}
          userPosition={userPosition}
        />
      </div>

      <BottomNav />

      <LoginModal
        isOpen={isModalOpen}
        motivo={motivoModal}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
