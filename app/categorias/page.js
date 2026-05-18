"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase";

const categorias = [
  {
    nome: "Natureza",
    icone: "🌿",
    descricao: "Explore praias, trilhas, lagoas e paisagens naturais incríveis",
  },
  {
    nome: "Gastronomia",
    icone: "🍽️",
    descricao: "Descubra restaurantes, cafés e sabores locais para todos os momentos",
  },
  {
    nome: "Noite",
    icone: "🌙",
    descricao: "Bares, pubs e baladas para curtir a noite da região",
  },
  {
    nome: "Serviços",
    icone: "🔧",
    descricao: "Farmácias, mecânicos, salões e tudo que você precisa no dia a dia",
  },
  {
    nome: "Hospedagem",
    icone: "🏠",
    descricao: "Pousadas e hostels para sua estadia perfeita",
  },
];

export default function CategoriasPage() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const supabase = createClient();

    Promise.all(
      categorias.map(async ({ nome }) => {
        const { count } = await supabase
          .from("lugares")
          .select("id", { count: "exact", head: true })
          .eq("categoria", nome);

        return [nome, count ?? 0];
      })
    ).then((entries) => {
      setCounts(Object.fromEntries(entries));
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f3] font-sans text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        <header className="mb-6 flex items-start gap-3">
          <Link
            href="/"
            className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl font-semibold text-[#1a4a3a] shadow-sm"
            aria-label="Voltar"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a2e28]">
              Explore as categorias
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-[#5a6b66]">
              Descubra o melhor de cada categoria
            </p>
          </div>
        </header>

        <div className="grid gap-4">
          {categorias.map((categoria) => (
            <Link
              key={categoria.nome}
              href={`/categoria/${encodeURIComponent(categoria.nome)}`}
              className="relative min-h-[250px] overflow-hidden rounded-2xl shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(
                  categoria.nome
                )}/420/300`}
                alt={categoria.nome}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <span className="absolute left-4 top-4 rounded-full bg-[#d4ede8] px-3 py-1 text-xs font-semibold text-[#1a4a3a]">
                {categoria.icone} {categoria.nome}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h2 className="text-2xl font-bold leading-tight">
                  {categoria.nome}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {categoria.descricao}
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  {counts[categoria.nome] ?? 0} lugares
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
