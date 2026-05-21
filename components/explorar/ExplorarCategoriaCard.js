"use client";

import Link from "next/link";
import { getCategoriaHref } from "@/lib/categorias";

/**
 * Card compacto de categoria (grid 2 colunas).
 * @param {object} props
 * @param {import("@/lib/categorias").CategoriaExplore} props.categoria
 * @param {number} props.count
 * @param {string} [props.imagemUrl]
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarCategoriaCard({ categoria, count, imagemUrl }) {
  const href = getCategoriaHref(categoria.nome);
  const vazio = count === 0;

  return (
    <Link
      href={href}
      className={`relative flex min-h-[148px] flex-col overflow-hidden rounded-2xl shadow-sm ring-1 transition active:scale-[0.98] ${
        vazio
          ? "bg-gray-50 ring-gray-200/80 opacity-75"
          : "bg-white ring-[#e8eeee] hover:ring-[#1a4a3a]/25"
      }`}
      aria-label={`${categoria.nome}, ${count} lugares`}
    >
      <div className="relative h-[88px] w-full overflow-hidden">
        {imagemUrl && !vazio ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagemUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${categoria.gradient}`}
            aria-hidden
          />
        )}
        <span
          className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${categoria.chipClass}`}
        >
          {categoria.icone}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold leading-tight text-[#1a2e28]">
          {categoria.nome}
        </h3>
        <p className="mt-1 flex-1 text-[11px] leading-snug text-[#5a6b66] line-clamp-2">
          {categoria.descricaoCurta}
        </p>
        <p
          className={`mt-2 text-xs font-semibold ${
            vazio ? "text-[#9aa8a3]" : "text-[#1a4a3a]"
          }`}
        >
          {vazio ? "Em breve" : `${count} ${count === 1 ? "lugar" : "lugares"}`}
        </p>
      </div>
    </Link>
  );
}
