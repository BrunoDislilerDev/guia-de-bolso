"use client";

import Link from "next/link";
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
 * Listagem por categoria — dados iniciais do servidor para SEO e primeiro paint.
 * @param {object} props
 * @param {string} props.categoria
 * @param {string} [props.categoriaDescricao]
 * @param {number} [props.lugaresCount]
 * @param {import('react').ReactNode} [props.seoHeader] - h1 + intro renderizados no servidor.
 * @param {object[]} [props.initialLugares]
 * @param {object[]} [props.initialSubcategorias]
 * @returns {import("react").ReactElement}
 */
export default function CategoriaPageClient({
  categoria,
  categoriaDescricao: _categoriaDescricao,
  lugaresCount: _lugaresCount,
  seoHeader = null,
  initialLugares = [],
  initialSubcategorias = [],
}) {
  const [lugares, setLugares] = useState(initialLugares);
  const [subcategorias, setSubcategorias] = useState(initialSubcategorias);
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("Todos");
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(initialLugares.length === 0);
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

    if (initialLugares.length === 0) {
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
    } else {
      setLoading(false);
      setFetchError(false);
    }

    if (!supabase || initialSubcategorias.length > 0) {
      return undefined;
    }

    supabase
      .from("subcategorias")
      .select("*")
      .eq("categoria", categoria)
      .order("nome")
      .then(({ data }) => setSubcategorias(data ?? []));

    return undefined;
  }, [categoria, initialLugares.length, initialSubcategorias.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubcategoriaSelecionada("Todos");
    }, 0);

    return () => clearTimeout(timer);
  }, [categoria]);

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
        <header className="mb-6 flex items-start gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1a4a3a] shadow-sm"
            aria-label="Voltar"
          >
            <IconBack />
          </Link>
          {seoHeader ?? (
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-[#1a2e28]">{categoria} em Imbituba</h1>
              <p className="mt-2 text-sm text-[#5a6b66]">
                {loading
                  ? "Carregando locais..."
                  : `${lugaresFiltrados.length} locais encontrados`}
              </p>
            </div>
          )}
        </header>
        {seoHeader ? (
          <p className="mb-4 -mt-2 text-sm text-[#5a6b66]">
            {loading
              ? "Atualizando lista..."
              : `${lugaresFiltrados.length} locais encontrados`}
          </p>
        ) : null}

        <SupabaseConfigAlert />

        {fetchError && (
          <UserErrorAlert
            className="mb-5"
            message="Não foi possível carregar os lugares."
            reportContext={buildReportContext({
              code: "SERVER",
              route: `/categoria/${encodeURIComponent(categoria)}`,
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
                  <PlaceCard lugar={withDistanciaDinamica(lugar, userPosition)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
