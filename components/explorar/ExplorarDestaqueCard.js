"use client";

import Link from "next/link";
import { getCategoriaHref } from "@/lib/categorias";

/**
 * Card horizontal em destaque para uma categoria.
 * @param {object} props
 * @param {import("@/lib/categorias").CategoriaExplore} props.categoria
 * @param {number} props.count
 * @param {string} [props.imagemUrl]
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarDestaqueCard({ categoria, count, imagemUrl }) {
  const vazio = count === 0;
  const href = getCategoriaHref(categoria.nome);

  const inner = (
    <>
      {imagemUrl && !vazio ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagemUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${categoria.gradient}`}
          aria-hidden
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2820]/90 via-[#0d2820]/35 to-transparent" />

      {categoria.destaque && !vazio && (
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1a4a3a]">
          {categoria.destaque}
        </span>
      )}

      <div className="relative p-4 text-white">
        <span className="text-2xl" aria-hidden>
          {categoria.icone}
        </span>
        <h3 className="mt-2 text-xl font-bold leading-tight">{categoria.nome}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/85">
          {categoria.descricaoCurta}
        </p>
        <p className="mt-2 text-xs font-semibold text-white/90">
          {vazio
            ? "Em breve"
            : `${count} ${count === 1 ? "lugar" : "lugares"}`}
          {!vazio && (
            <span className="ml-1 opacity-80" aria-hidden>
              →
            </span>
          )}
        </p>
      </div>
    </>
  );

  const shellClass = `relative flex h-[168px] w-[260px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 ${
    vazio ? "cursor-not-allowed opacity-70" : "group transition active:scale-[0.98]"
  }`;

  if (vazio) {
    return (
      <div
        className={shellClass}
        aria-disabled="true"
        title={`${categoria.nome} — em breve`}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} className={`${shellClass} group`}>
      {inner}
    </Link>
  );
}
