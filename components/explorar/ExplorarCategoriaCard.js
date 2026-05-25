"use client";

import { useState } from "react";
import Link from "next/link";
import { getCategoriaHref } from "@/lib/categorias";

function CategoriaCardContent({ categoria, count, imagemUrl, vazio, imgLoaded, onImageLoad }) {
  return (
    <>
      <div className="relative h-[96px] w-full overflow-hidden">
        {imagemUrl && !vazio ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagemUrl}
            alt=""
            onLoad={onImageLoad}
            className={`home-image-fade h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imgLoaded ? "is-loaded" : ""
            }`}
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${categoria.gradient}`}
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <span
          className={`absolute left-2.5 top-2.5 rounded-full border border-white/30 px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-sm ${categoria.chipClass}`}
        >
          {categoria.icone}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-[15px] font-bold leading-tight tracking-tight text-[#1a2e28]">
          {categoria.nome}
        </h3>
        <p className="mt-1 flex-1 text-[11px] leading-snug text-[#5a6b66] line-clamp-2">
          {categoria.descricaoCurta}
        </p>
        <p
          className={`mt-2.5 text-xs font-semibold ${
            vazio ? "text-[#9aa8a3]" : "text-[#1a4a3a]"
          }`}
        >
          {vazio ? "Em breve" : `${count} ${count === 1 ? "lugar" : "lugares"}`}
        </p>
      </div>
    </>
  );
}

/**
 * Card compacto de categoria (grid 2 colunas).
 */
export default function ExplorarCategoriaCard({ categoria, count, imagemUrl }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const vazio = count === 0;
  const baseClass = `group relative flex min-h-[156px] flex-col overflow-hidden rounded-[22px] ring-1 ${
    vazio
      ? "pointer-events-none cursor-not-allowed bg-gray-50 opacity-75 ring-gray-200/80"
      : "bg-white ring-[#e8eeee] transition-transform duration-300 active:scale-[0.98] hover:ring-[#1a4a3a]/20"
  }`;

  if (vazio) {
    return (
      <div
        className={baseClass}
        aria-disabled="true"
        tabIndex={-1}
        title={`${categoria.nome} — em breve, sem lugares cadastrados`}
      >
        <CategoriaCardContent
          categoria={categoria}
          count={count}
          imagemUrl={imagemUrl}
          vazio={vazio}
          imgLoaded={imgLoaded}
          onImageLoad={() => setImgLoaded(true)}
        />
      </div>
    );
  }

  return (
    <Link
      href={getCategoriaHref(categoria.nome)}
      className={baseClass}
      aria-label={`${categoria.nome}, ${count} lugares`}
    >
      <CategoriaCardContent
        categoria={categoria}
        count={count}
        imagemUrl={imagemUrl}
        vazio={vazio}
        imgLoaded={imgLoaded}
        onImageLoad={() => setImgLoaded(true)}
      />
    </Link>
  );
}
