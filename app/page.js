"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function IconPin({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function IconCloud({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );
}

function IconLeaf({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 1.5 1 2.5 2.5 2.5 1.25 0 2.5-.75 3-2 .5 3.5 3.5 5.5 6.5 5.5 4.5 0 8-3.5 8-8 0-.5-.05-1-.15-1.5C20.5 10.5 19 9 17 8z" />
    </svg>
  );
}

function IconUtensils({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
    </svg>
  );
}

function IconMoon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a7 7 0 01-8.9-8.9A8.96 8.96 0 0012 3z" />
    </svg>
  );
}

function IconHeart({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function IconSun({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
    </svg>
  );
}

function IconHome({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function IconHeartFilled({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function IconPerson({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

const categories = [
  {
    label: "Natureza",
    bg: "bg-[#b8e6d4]",
    activeBg: "bg-[#7fd4ae]",
    text: "text-[#1a4a3a]",
    border: "border-[#1a4a3a]",
    Icon: IconLeaf,
  },
  {
    label: "Gastronomia",
    bg: "bg-[#f0e4d4]",
    activeBg: "bg-[#e0cbb0]",
    text: "text-[#6b5344]",
    border: "border-[#6b5344]",
    Icon: IconUtensils,
  },
  {
    label: "Noite",
    bg: "bg-[#e4d4f0]",
    activeBg: "bg-[#cbb8e0]",
    text: "text-[#5c4a6e]",
    border: "border-[#5c4a6e]",
    Icon: IconMoon,
  },
];

async function fetchLugaresProximos(categoria) {
  let query = supabase
    .from("lugares")
    .select("*")
    .eq("destaque", false)
    .limit(3);

  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  const { data } = await query;
  return data ?? [];
}

export default function Home() {
  const [destaque, setDestaque] = useState(null);
  const [lugaresProximos, setLugaresProximos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  useEffect(() => {
    supabase
      .from("lugares")
      .select("*")
      .eq("destaque", true)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setDestaque(data));
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchLugaresProximos(categoriaSelecionada).then((data) => {
      if (!cancelled) setLugaresProximos(data);
    });

    return () => {
      cancelled = true;
    };
  }, [categoriaSelecionada]);

  function handleCategoriaClick(label) {
    setCategoriaSelecionada((atual) => (atual === label ? null : label));
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] font-sans text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        {/* Header */}
        <header className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a2e28]">
              Guia de{" "}
              <span className="text-[#1a4a3a]">bolso.</span>
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#5a6b66]">
              <IconPin className="w-3.5 h-3.5 text-[#1a4a3a]" />
              Explore Imbituba
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#1a4a3a] shadow-sm">
            <IconCloud className="w-4 h-4 text-[#6b8f9e]" />
            18.3°
          </div>
        </header>

        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map(({ label, bg, activeBg, text, border, Icon }) => {
            const isSelected = categoriaSelecionada === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleCategoriaClick(label)}
                aria-pressed={isSelected}
                className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:opacity-75 ${text} ${
                  isSelected ? `${activeBg} ${border}` : `${bg} border-transparent`
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Featured card */}
        {destaque && (
          <article className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={destaque.imagem_url}
                alt={destaque.nome}
                className="h-44 w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1a4a3a] shadow-sm backdrop-blur-sm"
                aria-label="Favoritar"
              >
                <IconHeart />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9aa8a3]">
                Destaque da semana
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#1a2e28]">
                {destaque.nome}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#5a6b66]">
                {destaque.descricao}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#5a6b66]">
                <span className="flex items-center gap-1.5">
                  <IconSun className="w-4 h-4 text-[#e8a838]" />
                  {destaque.categoria}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconPin className="w-4 h-4 text-[#1a4a3a]" />
                  {destaque.distancia}
                </span>
              </div>
              <Link
                href={`/lugares/${destaque.id}`}
                className="mt-4 block w-full rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528]"
              >
                Explorar Rota →
              </Link>
            </div>
          </article>
        )}

        {/* Near you */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-[#1a2e28]">Perto de você</h2>
          <div className="flex flex-col gap-3">
            {lugaresProximos.map((lugar) => (
              <Link
                key={lugar.id}
                href={`/lugares/${lugar.id}`}
                className="flex gap-3 overflow-hidden rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lugar.imagem_url}
                  alt={lugar.nome}
                  className="h-20 w-20 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h3 className="font-semibold text-[#1a2e28]">{lugar.nome}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#5a6b66]">
                    <span className="flex items-center gap-1">
                      <IconSun className="w-3.5 h-3.5 text-[#e8a838]" />
                      {lugar.categoria}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconPin className="w-3.5 h-3.5 text-[#1a4a3a]" />
                      {lugar.distancia}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-[#1a4a3a] px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-white"
            aria-current="page"
          >
            <IconHome />
            <span className="text-xs font-medium">Início</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-white/50 transition-colors hover:text-white/70"
          >
            <IconHeartFilled />
            <span className="text-xs font-medium">Favoritos</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-white/50 transition-colors hover:text-white/70"
          >
            <IconPerson />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
