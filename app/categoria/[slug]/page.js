"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import { createClient } from "@/lib/supabase";
import { withDistanciaDinamica } from "@/lib/localizacao";

export default function CategoriaPage() {
  const { slug } = useParams();
  const categoria = decodeURIComponent(String(slug ?? ""));
  const [lugares, setLugares] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("Todos");
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);

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

    const supabase = createClient();

    supabase
      .from("lugares")
      .select("*, localizacoes(*), lugares_tags(tags(*))")
      .eq("categoria", categoria)
      .eq("status", "ativo")
      .then(({ data }) => {
        setLugares(data ?? []);
        setLoading(false);
      });

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

  const lugaresFiltrados =
    subcategoriaSelecionada === "Todos"
      ? lugares
      : lugares.filter((lugar) => lugar.subcategoria === subcategoriaSelecionada);

  return (
    <div className="min-h-screen bg-[#f0f4f3] font-sans text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-10 pt-6">
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-semibold text-[#1a4a3a] shadow-sm"
            aria-label="Voltar"
          >
            ←
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

        {subcategorias.length > 0 && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "todos", nome: "Todos", icone: "" },
              ...subcategorias,
            ].map((subcategoria) => {
              const selected = subcategoriaSelecionada === subcategoria.nome;
              return (
                <button
                  key={subcategoria.id}
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
          {loading ? (
            <p className="py-8 text-center text-sm text-[#5a6b66]">
              Carregando...
            </p>
          ) : lugaresFiltrados.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#5a6b66]">
              Nenhum local encontrado nessa categoria.
            </p>
          ) : (
            lugaresFiltrados.map((lugar) => (
              <PlaceCard
                key={lugar.id}
                lugar={withDistanciaDinamica(lugar, userPosition)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
