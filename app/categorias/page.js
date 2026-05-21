"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import ExplorarAtalhos from "@/components/explorar/ExplorarAtalhos";
import ExplorarBuscaBar from "@/components/explorar/ExplorarBuscaBar";
import ExplorarCategoriaCard from "@/components/explorar/ExplorarCategoriaCard";
import ExplorarDestaqueCard from "@/components/explorar/ExplorarDestaqueCard";
import ExplorarMoodChips from "@/components/explorar/ExplorarMoodChips";
import ExplorarSkeleton from "@/components/explorar/ExplorarSkeleton";
import {
  CATEGORIAS_EXPLORE,
  getCategoriasEmDestaque,
  sortCategoriasPorContagem,
} from "@/lib/categorias";
import { getCapaFromLugar } from "@/lib/fotos";
import { createClient } from "@/lib/supabase";

/**
 * Tela Explorar — descoberta por categorias, intenções e busca IA.
 * @returns {import("react").JSX.Element}
 */
export default function CategoriasPage() {
  const [counts, setCounts] = useState({});
  const [capas, setCapas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("lugares")
      .select("categoria, imagem_url, fotos")
      .eq("status", "ativo")
      .then(({ data }) => {
        const totals = {};
        const imagens = {};

        for (const lugar of data ?? []) {
          const cat = lugar.categoria;
          if (!cat) continue;
          totals[cat] = (totals[cat] || 0) + 1;

          if (!imagens[cat]) {
            const capa = getCapaFromLugar(lugar);
            if (capa) imagens[cat] = capa;
          }
        }

        setCounts(totals);
        setCapas(imagens);
        setLoading(false);
      });
  }, []);

  const totalLugares = useMemo(
    () => Object.values(counts).reduce((acc, value) => acc + value, 0),
    [counts]
  );

  const categoriasOrdenadas = useMemo(
    () => sortCategoriasPorContagem(CATEGORIAS_EXPLORE, counts),
    [counts]
  );

  const destaques = useMemo(
    () => getCategoriasEmDestaque(CATEGORIAS_EXPLORE, counts, 3),
    [counts]
  );

  const categoriasFiltradas = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return categoriasOrdenadas;

    return categoriasOrdenadas.filter(
      (item) =>
        item.nome.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo) ||
        item.descricaoCurta.toLowerCase().includes(termo)
    );
  }, [categoriasOrdenadas, filtro]);

  const categoriasComLugares = useMemo(
    () => categoriasOrdenadas.filter((item) => (counts[item.nome] || 0) > 0).length,
    [categoriasOrdenadas, counts]
  );

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <header className="sticky top-0 z-30 border-b border-[#e8eeee]/80 bg-[#f0f4f3]/90 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="mx-auto max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1a4a3a]">
            Imbituba, SC
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1a2e28]">
            Explorar
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[#5a6b66]">
            {loading
              ? "Carregando lugares da região…"
              : `${totalLugares} lugares em ${categoriasComLugares} categorias`}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-32 pt-5">
        {loading ? (
          <ExplorarSkeleton />
        ) : (
          <div className="space-y-8">
            <ExplorarBuscaBar />
            <ExplorarMoodChips />

            {destaques.length > 0 && (
              <section aria-labelledby="explorar-destaques-title">
                <div className="mb-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1a4a3a]">
                      Em destaque
                    </p>
                    <h2
                      id="explorar-destaques-title"
                      className="text-lg font-bold text-[#1a2e28]"
                    >
                      Mais visitadas agora
                    </h2>
                  </div>
                </div>
                <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
                  {destaques.map((categoria, index) => (
                    <ExplorarDestaqueCard
                      key={categoria.nome}
                      categoria={{
                        ...categoria,
                        destaque: index === 0 ? "Mais popular" : undefined,
                      }}
                      count={counts[categoria.nome] || 0}
                      imagemUrl={capas[categoria.nome]}
                    />
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="explorar-grid-title">
              <div className="mb-3">
                <h2
                  id="explorar-grid-title"
                  className="text-lg font-bold text-[#1a2e28]"
                >
                  Todas as categorias
                </h2>
                <p className="mt-0.5 text-sm text-[#5a6b66]">
                  Toque para ver lugares e filtrar por tipo
                </p>
              </div>

              <label className="relative mb-4 block">
                <span className="sr-only">Filtrar categorias</span>
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa8a3]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3-3" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={filtro}
                  onChange={(event) => setFiltro(event.target.value)}
                  placeholder="Filtrar categorias…"
                  className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-sm text-[#1a2e28] shadow-sm ring-1 ring-[#e8eeee] placeholder:text-[#9aa8a3] focus:outline-none focus:ring-2 focus:ring-[#1a4a3a]/30"
                />
              </label>

              {categoriasFiltradas.length === 0 ? (
                <p className="rounded-2xl bg-white p-6 text-center text-sm text-[#5a6b66] shadow-sm">
                  Nenhuma categoria encontrada para &quot;{filtro}&quot;
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {categoriasFiltradas.map((categoria) => (
                    <ExplorarCategoriaCard
                      key={categoria.nome}
                      categoria={categoria}
                      count={counts[categoria.nome] || 0}
                      imagemUrl={capas[categoria.nome]}
                    />
                  ))}
                </div>
              )}
            </section>

            <ExplorarAtalhos />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
