"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

/**
 * Ícone de bookmark (salvar rota — placeholder).
 * @param {{ className?: string }} props
 * @returns {import("react").ReactElement}
 */
function IconBookmark({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 3h12a1 1 0 011 1v18l-7-4-7 4V4a1 1 0 011-1z" />
    </svg>
  );
}

/**
 * Carrossel de fotos da rota (mesmo padrão visual do detalhe de lugares).
 * @param {object} props
 * @param {string} props.nome - Nome da rota (alt das imagens).
 * @param {string[]} props.imagens - URLs das fotos.
 * @param {string} [props.backHref="/rotas"] - Link do botão voltar.
 * @returns {import("react").ReactElement}
 */
export default function RotaGaleria({ nome, imagens, backHref = "/rotas" }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const carouselRef = useRef(null);
  const fotos = imagens?.length ? imagens : [];

  function handleCarouselScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    setFotoAtual(Math.round(carousel.scrollLeft / carousel.clientWidth));
  }

  return (
    <section className="relative h-[min(52vh,380px)] min-h-[300px] overflow-hidden bg-[#0b1f1a]">
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

      <Link
        href={backHref}
        className="absolute left-4 top-[max(1.25rem,env(safe-area-inset-top))] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-2xl font-semibold text-[#1a2e28] shadow-md backdrop-blur"
        aria-label="Voltar para rotas"
      >
        ←
      </Link>

      <button
        type="button"
        className="absolute right-4 top-[max(1.25rem,env(safe-area-inset-top))] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-[#1a2e28] shadow-md backdrop-blur"
        aria-label="Salvar rota"
      >
        <IconBookmark />
      </button>

      {fotos.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {fotoAtual + 1} / {fotos.length}
        </div>
      )}
    </section>
  );
}
