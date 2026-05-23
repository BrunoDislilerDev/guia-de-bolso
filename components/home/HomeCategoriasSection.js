"use client";

import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import {
  CATEGORIAS_EXPLORE,
  getCategoriaHref,
  sortCategoriasPorContagem,
} from "@/lib/categorias";
import { withDistanciaDinamica } from "@/lib/localizacao";

/**
 * @param {object} props
 * @param {string} props.titulo
 * @param {string} props.href
 * @param {object[]} props.lugares
 * @param {{ latitude: number, longitude: number }|null} [props.userPosition]
 * @returns {import("react").JSX.Element|null}
 */
function CategoriaLugaresRow({ titulo, href, lugares, userPosition }) {
  if (!lugares?.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#1a2e28]">{titulo}</h2>
        <Link href={href} className="shrink-0 text-sm font-semibold text-[#1a4a3a]">
          Ver todos →
        </Link>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {lugares.slice(0, 8).map((lugar) => (
          <div key={lugar.id} className="w-[285px] shrink-0">
            <PlaceCard lugar={withDistanciaDinamica(lugar, userPosition)} />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Chips de categorias + fileiras de lugares na home.
 * @param {object} props
 * @param {object[]} [props.lugaresAtivos]
 * @param {{ latitude: number, longitude: number }|null} [props.userPosition]
 * @returns {import("react").JSX.Element}
 */
export default function HomeCategoriasSection({
  lugaresAtivos = [],
  userPosition = null,
}) {
  const counts = {};
  const porCategoria = {};

  for (const lugar of lugaresAtivos) {
    const cat = lugar.categoria;
    if (!cat) continue;
    counts[cat] = (counts[cat] || 0) + 1;
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(lugar);
  }

  const categoriasOrdenadas = sortCategoriasPorContagem(CATEGORIAS_EXPLORE, counts);
  const comLugares = categoriasOrdenadas.filter((c) => (counts[c.nome] || 0) > 0);

  return (
    <section className="mb-8" aria-labelledby="home-categorias-title">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1a4a3a]">
            Explorar
          </p>
          <h2 id="home-categorias-title" className="text-lg font-bold text-[#1a2e28]">
            Categorias
          </h2>
        </div>
        <Link href="/categorias" className="shrink-0 text-sm font-semibold text-[#1a4a3a]">
          Ver todas →
        </Link>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
        {categoriasOrdenadas.map((categoria) => {
          const count = counts[categoria.nome] || 0;
          return (
            <Link
              key={categoria.nome}
              href={getCategoriaHref(categoria.nome)}
              className={`flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-sm transition active:scale-[0.97] ${
                count === 0
                  ? "border-[#e8eeee] bg-white text-[#5a6b66]"
                  : "border-white/80 bg-white text-[#1a4a3a] ring-1 ring-[#d8ebe4]/80"
              }`}
            >
              <span aria-hidden>{categoria.icone}</span>
              <span className="whitespace-nowrap">{categoria.nome}</span>
              {count > 0 && (
                <span className="rounded-full bg-[#d4ede8] px-1.5 py-0.5 text-[10px] font-bold text-[#1a4a3a]">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {comLugares.length === 0 ? (
        <p className="mt-4 text-center text-sm text-[#5a6b66]">
          Nenhum lugar ativo no momento.
        </p>
      ) : (
        <div className="mt-6">
          {comLugares.map((categoria) => (
            <CategoriaLugaresRow
              key={categoria.nome}
              titulo={`${categoria.icone} ${categoria.nome}`}
              href={getCategoriaHref(categoria.nome)}
              lugares={porCategoria[categoria.nome] || []}
              userPosition={userPosition}
            />
          ))}
        </div>
      )}
    </section>
  );
}
