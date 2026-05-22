"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import IconBack from "@/components/IconBack";
import LoginModal from "@/components/LoginModal";
import { registrarLog } from "@/lib/logs";
import { createClient } from "@/lib/supabase";

/**
 * Ícone de coração para favoritar rota (mesmo traço do LugarHero).
 * @param {{ active?: boolean, className?: string }} props
 * @returns {import("react").ReactElement}
 */
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

/**
 * Ícone de compartilhar (mesmo do LugarHero).
 * @param {{ className?: string }} props
 * @returns {import("react").ReactElement}
 */
function ShareIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v14" />
    </svg>
  );
}

const headerBtnClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/75 text-[#1a2e28] shadow-md backdrop-blur transition-colors active:scale-[0.97]";

/**
 * Carrossel de fotos da rota com voltar, compartilhar e favoritar.
 * @param {object} props
 * @param {string} props.rotaId - UUID da rota curada.
 * @param {string} props.nome - Nome da rota (alt das imagens e share).
 * @param {string[]} props.imagens - URLs das fotos.
 * @param {string} [props.descricao] - Texto opcional para Web Share API.
 * @param {string} [props.backHref="/rotas"] - Link do botão voltar.
 * @returns {import("react").ReactElement}
 */
export default function RotaGaleria({
  rotaId,
  nome,
  imagens,
  descricao = "",
  backHref = "/rotas",
}) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const [user, setUser] = useState(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const carouselRef = useRef(null);
  const fotos = imagens?.length ? imagens : [];

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !rotaId) {
      setIsFavorito(false);
      return;
    }

    const supabase = createClient();

    supabase
      .from("rotas_favoritas")
      .select("rota_id")
      .eq("user_id", user.id)
      .eq("rota_id", rotaId)
      .maybeSingle()
      .then(({ data }) => {
        setIsFavorito(Boolean(data));
      });
  }, [user, rotaId]);

  /**
   * Atualiza o índice do carrossel conforme o scroll horizontal.
   * @returns {void}
   */
  function handleCarouselScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    setFotoAtual(Math.round(carousel.scrollLeft / carousel.clientWidth));
  }

  /**
   * Alterna favorito da rota com UI otimista e persistência no Supabase.
   * @returns {Promise<void>}
   */
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
        .from("rotas_favoritas")
        .delete()
        .eq("user_id", user.id)
        .eq("rota_id", rotaId);

      if (error) {
        setIsFavorito(true);
      } else {
        await registrarLog(supabase, user, "desfavoritou", {
          rota_id: rotaId,
          rota_nome: nome,
        });
      }
      return;
    }

    const { error } = await supabase
      .from("rotas_favoritas")
      .insert({ user_id: user.id, rota_id: rotaId });

    if (error) {
      setIsFavorito(false);
    } else {
      await registrarLog(supabase, user, "favoritou", {
        rota_id: rotaId,
        rota_nome: nome,
      });
    }
  }

  /**
   * Compartilha a rota via Web Share API ou copia o link.
   * @returns {Promise<void>}
   */
  async function handleShare() {
    const shareData = {
      title: nome,
      text: descricao || undefined,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setToast("Link copiado!");
      setTimeout(() => setToast(""), 2500);
    } catch {
      // Cancelamento do share nativo — sem toast de erro.
    }
  }

  return (
    <section className="relative h-[min(52vh,380px)] min-h-[300px] overflow-hidden bg-[#0b1f1a]">
      {toast && (
        <div className="absolute left-4 right-4 top-[max(1.25rem,env(safe-area-inset-top))] z-30 rounded-2xl bg-[#1a4a3a] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      {fotos.length === 0 ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54]" />
      ) : (
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide [-webkit-overflow-scrolling:touch]"
        >
          {fotos.map((foto, index) => (
            <div
              key={`${foto}-${index}`}
              className="relative h-full w-full shrink-0 snap-center"
            >
              <Image
                src={foto}
                alt={nome}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Link
          href={backHref}
          className={headerBtnClass}
          aria-label="Voltar para rotas"
        >
          <IconBack />
        </Link>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className={headerBtnClass}
            aria-label="Compartilhar rota"
          >
            <ShareIcon />
          </button>
          <button
            type="button"
            onClick={handleFavoritar}
            className={`${headerBtnClass} ${
              isFavorito ? "bg-[#1a4a3a] text-white" : ""
            }`}
            aria-label={
              isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <FavoriteIcon active={isFavorito} />
          </button>
        </div>
      </div>

      {fotos.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {fotoAtual + 1} / {fotos.length}
        </div>
      )}

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        motivo="favoritar"
      />
    </section>
  );
}
