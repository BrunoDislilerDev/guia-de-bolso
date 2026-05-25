"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import IconBack from "@/components/IconBack";
import GalleryPhotoCounter from "@/components/shared/GalleryPhotoCounter";
import {
  GALLERY_FAVORITO_ATIVO_BTN_CLASS,
  GALLERY_FLOAT_BTN_CLASS,
  GALLERY_FLOAT_ICON_CLASS,
  GALLERY_FOOTER_ROW_CLASS,
  PARCEIRO_BADGE_GRADIENT_CLASS,
} from "@/components/lugar/airbnb/lugarAirbnbTokens";
import {
  CAROUSEL_SLIDE_RELAXED_CLASS,
  CAROUSEL_TRACK_CLASS,
  useCarouselScrollIndex,
} from "@/lib/horizontalCarousel";

const GALLERY_CAROUSEL_THRESHOLD = 0.58;

function FavoriteIcon({ active, className = GALLERY_FLOAT_ICON_CLASS }) {
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

function ShareIcon({ className = GALLERY_FLOAT_ICON_CLASS }) {
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
 * Hero de galeria compartilhado (lugares e rotas): full bleed, vidro no contador, card overlap abaixo.
 * Com `scroll`, aplica parallax e altura dinâmica (detalhe do lugar).
 * @param {object} props
 * @param {ReturnType<import("@/hooks/useDetalheScroll").useDetalheScroll>|null} [props.scroll]
 * @param {boolean} [props.hideTopActions=false] - Esconde botões do hero (header sticky assume).
 * @returns {import("react").JSX.Element}
 */
export default function GalleryHeroAirbnb({
  nome,
  imagens,
  backHref = "/",
  isFavorito = false,
  onFavoritar,
  onShare,
  parceiroBadgeLabel = null,
  showFavorite = true,
  scroll = null,
  hideTopActions = false,
}) {
  const carouselRef = useRef(null);
  const fotos = imagens?.length ? imagens : [];
  const fotoAtual = useCarouselScrollIndex(carouselRef, fotos.length, {
    indexThreshold: GALLERY_CAROUSEL_THRESHOLD,
  });

  const temVariasFotos = fotos.length > 1;
  const showFooter = Boolean(parceiroBadgeLabel) || temVariasFotos;
  const useScroll = scroll != null;
  const heroOpacity = useScroll ? 1 - scroll.progress * 0.15 : 1;
  const topActionsOpacity = useScroll
    ? Math.max(0, 1 - (scroll.progress - 0.15) / 0.35)
    : 1;

  const heroStyle = useScroll
    ? { height: "100%", minHeight: scroll.heroHeightPx, opacity: heroOpacity }
    : undefined;

  const parallaxStyle = useScroll
    ? {
        height: "calc(100% + 72px)",
        transform: `translate3d(0, ${-scroll.parallaxY * 0.32}px, 0)`,
        willChange: "transform",
      }
    : undefined;

  return (
    <div className="relative w-full">
      <div
        className={
          useScroll
            ? "relative h-full min-h-full w-full overflow-hidden bg-[#e8eeee]"
            : "relative h-[min(52vh,28rem)] w-full overflow-hidden bg-[#e8eeee]"
        }
        style={heroStyle}
      >
        <div
          className={
            useScroll ? "absolute inset-x-0 top-0 w-full" : "absolute inset-0 h-full w-full"
          }
          style={parallaxStyle}
        >
          {fotos.length === 0 ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54]" />
          ) : (
            <div ref={carouselRef} className={`${CAROUSEL_TRACK_CLASS} h-full min-h-full w-full`}>
              {fotos.map((foto, index) => (
                <div key={`${foto}-${index}`} className={CAROUSEL_SLIDE_RELAXED_CLASS}>
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
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-t from-black/35 via-black/10 to-transparent"
          aria-hidden
        />

        {showFooter && (
          <div className={GALLERY_FOOTER_ROW_CLASS}>
            {parceiroBadgeLabel ? (
              <span className={PARCEIRO_BADGE_GRADIENT_CLASS}>{parceiroBadgeLabel}</span>
            ) : (
              <span className="shrink-0" aria-hidden />
            )}
            {temVariasFotos ? (
              <GalleryPhotoCounter current={fotoAtual + 1} total={fotos.length} />
            ) : (
              <span className="shrink-0" aria-hidden />
            )}
          </div>
        )}

        {!hideTopActions && (
          <div
            className="absolute left-4 top-[max(0.75rem,env(safe-area-inset-top))] z-20 transition-opacity duration-150"
            style={{ opacity: topActionsOpacity }}
          >
            <Link href={backHref} className={GALLERY_FLOAT_BTN_CLASS} aria-label="Voltar">
              <IconBack className={GALLERY_FLOAT_ICON_CLASS} />
            </Link>
          </div>
        )}

        {!hideTopActions && (
          <div
            className="absolute right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex gap-2.5 transition-opacity duration-150"
            style={{ opacity: topActionsOpacity }}
          >
            <button
              type="button"
              onClick={onShare}
              className={GALLERY_FLOAT_BTN_CLASS}
              aria-label="Compartilhar"
            >
              <ShareIcon />
            </button>
            {showFavorite && onFavoritar && (
              <button
                type="button"
                onClick={onFavoritar}
                className={
                  isFavorito ? GALLERY_FAVORITO_ATIVO_BTN_CLASS : GALLERY_FLOAT_BTN_CLASS
                }
                aria-label={isFavorito ? "Remover dos favoritos" : "Favoritar"}
              >
                <FavoriteIcon
                  active={isFavorito}
                  className={
                    isFavorito
                      ? `${GALLERY_FLOAT_ICON_CLASS} text-white`
                      : GALLERY_FLOAT_ICON_CLASS
                  }
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
