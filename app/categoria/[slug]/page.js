"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import IconBack from "@/components/IconBack";
import PlaceCard from "@/components/PlaceCard";
import PlaceCardSkeleton from "@/components/home/PlaceCardSkeleton";
import SupabaseConfigAlert from "@/components/SupabaseConfigAlert";
import UserErrorAlert from "@/components/UserErrorAlert";
import { fetchLugaresFromApi } from "@/lib/fetchLugaresApi";
import { isSupabasePublicConfigured } from "@/lib/supabase/publicEnv";
import { buildReportContext } from "@/lib/reportContext";
import { createClient } from "@/lib/supabase";
import { withDistanciaDinamica } from "@/lib/localizacao";

/**
 * Lists active places in a category with optional subcategory filter.
 * @returns {import("react").ReactElement}
 */
export default function CategoriaPage() {
  const { slug } = useParams();
  const categoria = decodeURIComponent(String(slug ?? ""));
  const [lugares, setLugares] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("Todos");
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!categoria) return;

    if (!isSupabasePublicConfigured()) {
      setFetchError(true);
      setLoading(false);
      return undefined;
    }

    const supabase = createClient();

    fetchLugaresFromApi({ categoria, limit: 100 })
      .then((data) => {
        setFetchError(false);
        setLugares(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[categoria] lugares:", err);
        setFetchError(true);
        setLugares([]);
        setLoading(false);
      });

    if (!supabase) {
      return undefined;
    }

    supabase
      .from("subcategorias")
      .select("*")
      .eq("categoria", categoria)
      .order("nome")
      .then(({ data }) => setSubcategorias(data ?? []));
  }, [categoria]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubcategoriaSelecionada("Todos");
    }, 0);

    return () => clearTimeout(timer);
  }, [categoria]);

  /** Só exibe chips de subcategorias com pelo menos um local ativo nesta categoria. */
  const subcategoriasComLocais = useMemo(() => {
    const nomesEmUso = new Set(
      lugares
        .map((lugar) => lugar.subcategoria?.trim())
        .filter(Boolean)
    );

    return subcategorias.filter((item) => nomesEmUso.has(item.nome));
  }, [lugares, subcategorias]);

  useEffect(() => {
    if (
      subcategoriaSelecionada !== "Todos" &&
      !subcategoriasComLocais.some((item) => item.nome === subcategoriaSelecionada)
    ) {
      setSubcategoriaSelecionada("Todos");
    }
  }, [subcategoriasComLocais, subcategoriaSelecionada]);

  const lugaresFiltrados =
    subcategoriaSelecionada === "Todos"
      ? lugares
      : lugares.filter((lugar) => lugar.subcategoria === subcategoriaSelecionada);

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-10 pt-6">
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a4a3a] shadow-sm"
            aria-label="Voltar"
          >
            <IconBack />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1a2e28]">{categoria}</h1>
            <p className="text-sm text-[#5a6b66]">
              {loading
                ? "Carregando locais..."
                : `${lugaresFiltrados.length} locais encontrados`}
            </p>
          </div>
        </header>

        <SupabaseConfigAlert />

        {fetchError && (
          <UserErrorAlert
            className="mb-5"
            message="Não foi possível carregar os lugares."
            reportContext={buildReportContext({
              code: "SERVER",
              route: `/categoria/${slug}`,
            })}
            action={
              <Link
                href="/categorias"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-800 underline"
              >
                <IconBack className="h-4 w-4" />
                Voltar
              </Link>
            }
          />
        )}

        {subcategoriasComLocais.length > 0 && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
            {[
              { id: "todos", nome: "Todos", icone: "" },
              ...subcategoriasComLocais,
            ].map((subcategoria) => {
              const selected = subcategoriaSelecionada === subcategoria.nome;
              return (
                <button
                  key={subcategoria.id ?? subcategoria.nome}
                  type="button"
                  onClick={() => setSubcategoriaSelecionada(subcategoria.nome)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                    selected
                      ? "bg-[#1a4a3a] text-white"
                      : "bg-white text-[#1a4a3a] shadow-sm"
                  }`}
                >
                  {subcategoria.icone && <span className="mr-1">{subcategoria.icone}</span>}
                  {subcategoria.nome}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid gap-4">
          {fetchError ? null : loading ? (
            <>
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <PlaceCardSkeleton key={item} />
              ))}
            </>
          ) : lugaresFiltrados.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#5a6b66]">
              Nenhum local encontrado nessa categoria.
            </p>
          ) : (
            <ul className="grid list-none gap-4 p-0">
              {lugaresFiltrados.map((lugar) => (
                <li key={lugar.id}>
                  <PlaceCard
                    lugar={withDistanciaDinamica(lugar, userPosition)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
