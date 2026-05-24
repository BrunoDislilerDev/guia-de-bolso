"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import IconBack from "@/components/IconBack";
import {
  CAROUSEL_SLIDE_CLASS,
  CAROUSEL_TRACK_CLASS,
  useCarouselScrollIndex,
} from "@/lib/horizontalCarousel";
import { PARCEIRO_BADGE_GALLERY_CLASS } from "@/components/lugar/airbnb/lugarAirbnbTokens";

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

/**
 * Galeria estilo Airbnb: cantos arredondados, controles flutuantes, contador.
 * @param {object} props
 * @returns {import("react").JSX.Element}
 */
export default function LugarGalleryAirbnb({
  nome,
  imagens,
  isFavorito,
  onFavoritar,
  onShare,
  parceiroBadgeLabel = null,
}) {
  const carouselRef = useRef(null);
  const fotoAtual = useCarouselScrollIndex(carouselRef, imagens.length);

  return (
    <div className="relative px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e8eeee]">
        <div ref={carouselRef} className={`${CAROUSEL_TRACK_CLASS} h-full`}>
          {imagens.map((foto, index) => (
            <div key={`${foto}-${index}`} className={CAROUSEL_SLIDE_CLASS}>
              <Image
                src={foto}
                alt={nome}
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {imagens.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 shadow-md">
            {imagens.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === fotoAtual ? "w-4 bg-[#1a4a3a]" : "w-1.5 bg-[#c5d5d0]"
                }`}
                aria-hidden
              />
            ))}
          </div>
        )}

        {parceiroBadgeLabel && (
          <span className={PARCEIRO_BADGE_GALLERY_CLASS}>{parceiroBadgeLabel}</span>
        )}

        {imagens.length > 1 && (
          <span className="absolute bottom-3 right-3 z-10 rounded-md border border-white/20 bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
            {fotoAtual + 1} / {imagens.length}
          </span>
        )}
      </div>

      <div className="absolute left-7 top-[max(1.25rem,env(safe-area-inset-top))] z-20">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8eeee] bg-white text-[#1a2e28] shadow-sm"
          aria-label="Voltar"
        >
          <IconBack className="h-4 w-4" />
        </Link>
      </div>

      <div className="absolute right-7 top-[max(1.25rem,env(safe-area-inset-top))] z-20 flex gap-2">
        <button
          type="button"
          onClick={onShare}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8eeee] bg-white text-[#1a2e28] shadow-sm"
          aria-label="Compartilhar"
        >
          <ShareIcon className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={onFavoritar}
          className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm ${
            isFavorito
              ? "border-[#1a4a3a] bg-[#1a4a3a] text-white"
              : "border-[#e8eeee] bg-white text-[#1a2e28]"
          }`}
          aria-label={isFavorito ? "Remover dos favoritos" : "Favoritar"}
        >
          <FavoriteIcon active={isFavorito} className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
