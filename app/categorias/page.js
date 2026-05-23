"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import ExplorarAtalhos from "@/components/explorar/ExplorarAtalhos";
import ExplorarBuscaBar from "@/components/explorar/ExplorarBuscaBar";
import ExplorarCategoriaCard from "@/components/explorar/ExplorarCategoriaCard";
import ExplorarDestaqueCard from "@/components/explorar/ExplorarDestaqueCard";
import ExplorarSkeleton from "@/components/explorar/ExplorarSkeleton";
import SupabaseConfigAlert from "@/components/SupabaseConfigAlert";
import { isSupabasePublicConfigured } from "@/lib/supabase/publicEnv";
import {
  CATEGORIAS_EXPLORE,
  getCategoriasEmDestaque,
  sortCategoriasPorContagem,
} from "@/lib/categorias";
import { getCapaFromLugar } from "@/lib/fotos";
import { fetchLugaresFromApi } from "@/lib/fetchLugaresApi";

/**
 * Tela Explorar — descoberta por categorias, intenções e busca IA.
 * @returns {import("react").JSX.Element}
 */
export default function CategoriasPage() {
  const [counts, setCounts] = useState({});
  const [capas, setCapas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabasePublicConfigured()) {
      setLoading(false);
      return undefined;
    }

    fetchLugaresFromApi({ limit: 100 })
      .then((data) => {
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
      })
      .catch((err) => {
        console.error("[Explorar] lugares:", err);
        setCounts({});
        setCapas({});
        setLoading(false);
      });

    return undefined;
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
        <SupabaseConfigAlert />
        {loading ? (
          <ExplorarSkeleton />
        ) : (
          <div className="space-y-8">
            <ExplorarBuscaBar />

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
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                {categoriasOrdenadas.map((categoria) => (
                  <ExplorarCategoriaCard
                    key={categoria.nome}
                    categoria={categoria}
                    count={counts[categoria.nome] || 0}
                    imagemUrl={capas[categoria.nome]}
                  />
                ))}
              </div>
            </section>

            <ExplorarAtalhos />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
