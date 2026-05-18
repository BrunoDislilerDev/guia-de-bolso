"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoginModal from "@/components/LoginModal";
import { createClient } from "@/lib/supabase";
import {
  formatHorario,
  getDiaAtualKey,
  getDiasHorario,
  getStatusFuncionamento,
} from "@/lib/horarios";

function IconPin({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function IconClock({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm1 11h5v-2h-4V6h-2v7z" />
    </svg>
  );
}

function IconPhone({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
    </svg>
  );
}

function IconInstagram({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3.5A4.5 4.5 0 1112 16a4.5 4.5 0 010-9zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5zM17.75 6.25a1 1 0 11-1 1 1 1 0 011-1z" />
    </svg>
  );
}

function IconUtensils({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
    </svg>
  );
}

function IconGlobe({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.6 15.6 0 00-1.2-3.1A8.03 8.03 0 0118.93 8zM12 4.04A13.8 13.8 0 0113.91 8h-3.82A13.8 13.8 0 0112 4.04zM4.26 14a8.18 8.18 0 010-4h3.38A16.47 16.47 0 007.5 12c0 .69.05 1.36.14 2H4.26zm.81 2h2.95c.3 1.13.7 2.18 1.2 3.1A8.03 8.03 0 015.07 16zm2.95-8H5.07a8.03 8.03 0 014.15-3.1A15.6 15.6 0 008.02 8zM12 19.96A13.8 13.8 0 0110.09 16h3.82A13.8 13.8 0 0112 19.96zM14.34 14H9.66A14.84 14.84 0 019.5 12c0-.69.06-1.36.16-2h4.68c.1.64.16 1.31.16 2s-.06 1.36-.16 2zm.44 5.1c.5-.92.9-1.97 1.2-3.1h2.95a8.03 8.03 0 01-4.15 3.1zM16.36 14c.09-.64.14-1.31.14-2s-.05-1.36-.14-2h3.38a8.18 8.18 0 010 4h-3.38z" />
    </svg>
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

const categoriaStyles = {
  Natureza: "bg-[#b8e6d4] text-[#1a4a3a]",
  Gastronomia: "bg-[#f0e4d4] text-[#6b5344]",
  Noite: "bg-[#e4d4f0] text-[#5c4a6e]",
  Serviços: "bg-[#c5dff5] text-[#2a5a7a]",
  Hospedagem: "bg-[#f5e6b8] text-[#7a6520]",
};

function googleMapsUrl(lugar) {
  const query = encodeURIComponent(lugar.endereco || `${lugar.nome} Imbituba Santa Catarina`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function appleMapsUrl(lugar) {
  return `https://maps.apple.com/?q=${encodeURIComponent(
    lugar.endereco || lugar.nome
  )}`;
}

function wazeUrl(lugar) {
  return `https://waze.com/ul?q=${encodeURIComponent(
    lugar.endereco || lugar.nome
  )}&navigate=yes`;
}

function instagramUrl(value) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const handle = value.replace("@", "");
  return `https://instagram.com/${handle}`;
}

function ActionButton({ href, label, Icon }) {
  const disabled = !href;
  const content = (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl bg-[#f0f4f3] px-2 py-3 text-[#1a4a3a] ${
        disabled ? "opacity-40" : "transition-transform active:scale-95"
      }`}
    >
      <Icon />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  if (disabled) return <button type="button" disabled>{content}</button>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}

function BottomSheet({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 font-sans backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[24px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{ animation: "sheetIn 220ms ease-out" }}
      >
        <style>{`
          @keyframes sheetIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />
        <h2 className="mb-4 text-lg font-bold text-[#1a2e28]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function LugarPage() {
  const { id } = useParams();
  const [lugar, setLugar] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [fotoAtual, setFotoAtual] = useState(0);
  const carouselRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorito, setIsFavorito] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHorarios, setShowHorarios] = useState(false);
  const [showRotas, setShowRotas] = useState(false);
  const [sobreExpandido, setSobreExpandido] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;

    const supabase = createClient();

    supabase
      .from("lugares")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setLugar(data);
        console.log('horarios do banco:', data?.horarios)
        console.log('dia atual:', getDiaAtualKey())
        console.log('status:', getStatusFuncionamento(data?.horarios))
        setLoading(false);
      });

    supabase
      .from("fotos_lugar")
      .select("*")
      .eq("lugar_id", id)
      .then(({ data }) => {
        const urls = (data ?? [])
          .map((foto) => foto.url || foto.imagem_url || foto.foto_url)
          .filter(Boolean);
        setFotos(urls);
      });
  }, [id]);

  useEffect(() => {
    if (!user || !lugar) {
      setIsFavorito(false);
      return;
    }

    const supabase = createClient();

    supabase
      .from("favoritos")
      .select("lugar_id")
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsFavorito(Boolean(data));
      });
  }, [user, lugar]);

  async function handleFavoritar() {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    const supabase = createClient();
    const proximoEstado = !isFavorito;
    setIsFavorito(proximoEstado);

    if (isFavorito) {
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("lugar_id", lugar.id);

      if (error) setIsFavorito(true);
      return;
    }

    const { error } = await supabase
      .from("favoritos")
      .insert({ user_id: user.id, lugar_id: lugar.id });

    if (error) setIsFavorito(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] font-sans text-[#5a6b66]">
        Carregando...
      </div>
    );
  }

  if (!lugar) {
    return (
      <div className="min-h-screen bg-[#f0f4f3] px-4 py-6 font-sans text-[#1a2e28]">
        <div className="mx-auto max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#1a4a3a] transition-opacity hover:opacity-80"
          >
            ← Voltar
          </Link>
          <p className="mt-8 text-sm text-[#5a6b66]">Lugar não encontrado.</p>
        </div>
      </div>
    );
  }

  const badgeStyle =
    categoriaStyles[lugar.categoria] ?? "bg-white text-[#1a4a3a]";
  const imagens = fotos.length > 0 ? fotos : [lugar.imagem_url];
  const status = getStatusFuncionamento(lugar.horarios);
  const diaAtual = getDiaAtualKey();
  const endereco = lugar.endereco || "Endereço não informado";
  const descricaoLonga = lugar.descricao_longa || lugar.descricao;

  function handleCarouselScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
    setFotoAtual(nextIndex);
  }

  function openRoute(preference) {
    const selected = preference || localStorage.getItem("map_app_preferido");

    if (!selected) {
      setShowRotas(true);
      return;
    }

    localStorage.setItem("map_app_preferido", selected);
    setShowRotas(false);

    const urls = {
      google: googleMapsUrl(lugar),
      apple: appleMapsUrl(lugar),
      waze: wazeUrl(lugar),
    };

    window.open(urls[selected], "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] pb-24 font-sans text-[#1a2e28]">
      <div className="mx-auto max-w-md">
        <div className="relative h-[280px] overflow-hidden bg-[#1a4a3a]">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {imagens.map((foto, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${foto}-${index}`}
                src={foto}
                alt={lugar.nome}
                className="h-full w-full shrink-0 snap-center object-cover"
              />
            ))}
          </div>

          <Link
            href="/"
            className="absolute left-4 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-semibold text-[#1a4a3a] shadow-md"
            aria-label="Voltar"
          >
            ←
          </Link>
          <button
            type="button"
            onClick={handleFavoritar}
            className="absolute right-4 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a4a3a] shadow-md"
            aria-label={
              isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <FavoriteIcon active={isFavorito} />
          </button>

          {imagens.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {fotoAtual + 1} / {imagens.length}
            </div>
          )}
        </div>

        <div className="rounded-t-[24px] bg-white px-4 pb-10 pt-6 shadow-[0_-12px_35px_rgba(26,74,58,0.12)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
                >
                  {lugar.categoria}
                </span>
                <span className="flex items-center gap-1 text-sm text-[#5a6b66]">
                  <IconPin className="h-4 w-4 text-[#1a4a3a]" />
                  {lugar.distancia}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1a2e28]">
                {lugar.nome}
              </h1>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                status.aberto ? "bg-[#1a4a3a]" : "bg-[#d9534f]"
              }`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2 rounded-3xl bg-[#f7faf9] p-2">
            <ActionButton href={lugar.telefone ? `tel:${lugar.telefone}` : null} label="Ligar" Icon={IconPhone} />
            <ActionButton href={instagramUrl(lugar.instagram)} label="Instagram" Icon={IconInstagram} />
            <ActionButton href={lugar.cardapio_url} label="Cardápio" Icon={IconUtensils} />
            <ActionButton href={lugar.site_url} label="Site" Icon={IconGlobe} />
          </div>

          <section className="mt-7 rounded-3xl bg-[#f7faf9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <IconClock className="h-5 w-5 text-[#1a4a3a]" />
                <h2 className="font-bold text-[#1a2e28]">Horários de Funcionamento</h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  status.aberto
                    ? "bg-[#d4ede8] text-[#1a4a3a]"
                    : "bg-zinc-200 text-zinc-600"
                }`}
              >
                {status.aberto ? "Aberto agora" : "Fechado"}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#5a6b66]">{status.detail}</p>
            <button
              type="button"
              onClick={() => setShowHorarios(true)}
              className="mt-4 text-sm font-semibold text-[#1a4a3a]"
            >
              Ver horários completos →
            </button>
          </section>

          <section className="mt-5">
            <h2 className="mb-3 font-bold text-[#1a2e28]">Localização</h2>
            <a
              href={googleMapsUrl(lugar)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-3xl bg-[#f7faf9] p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d4ede8] text-[#1a4a3a]">
                <IconPin className="h-5 w-5" />
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[#5a6b66]">
                {endereco}
              </p>
              <span className="text-xl text-[#1a4a3a]">→</span>
            </a>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 font-bold text-[#1a2e28]">Sobre</h2>
            <p
              className={`text-sm leading-relaxed text-[#5a6b66] ${
                sobreExpandido ? "" : "line-clamp-3"
              }`}
            >
              {descricaoLonga}
            </p>
            {!sobreExpandido && (
              <button
                type="button"
                onClick={() => setSobreExpandido(true)}
                className="mt-2 text-sm font-semibold text-[#1a4a3a]"
              >
                Leia mais →
              </button>
            )}
          </section>
        </div>
      </div>

      <button
        type="button"
        onClick={() => openRoute()}
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-[#1a4a3a] px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-sm font-bold text-white"
      >
        IR AGORA
      </button>

      <BottomSheet
        isOpen={showHorarios}
        onClose={() => setShowHorarios(false)}
        title="Horários completos"
      >
        <div className="space-y-2">
          {getDiasHorario().map(({ key, label }) => {
            const value = lugar.horarios?.[key] ?? "fechado";
            const isToday = key === diaAtual;
            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm ${
                  isToday ? "bg-[#d4ede8] font-bold text-[#1a4a3a]" : "text-[#5a6b66]"
                }`}
              >
                <span className="capitalize">{label}</span>
                {value === "fechado" ? (
                  <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs font-semibold text-zinc-600">
                    Fechado
                  </span>
                ) : (
                  <span>{formatHorario(value)}</span>
                )}
              </div>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={showRotas}
        onClose={() => setShowRotas(false)}
        title="Abrir rota com"
      >
        <div className="grid gap-3">
          {[
            ["google", "Google Maps"],
            ["apple", "Apple Maps"],
            ["waze", "Waze"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => openRoute(key)}
              className="rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </BottomSheet>

      <LoginModal
        isOpen={isModalOpen}
        motivo="favoritar"
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
