"use client";

import Link from "next/link";

/**
 * @param {object} props
 * @returns {import("react").JSX.Element}
 */
function AtalhoCard({ href, titulo, descricao, emoji, destaque = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl p-4 transition active:scale-[0.98] ${
        destaque
          ? "bg-[#1a4a3a] text-white shadow-md"
          : "bg-white text-[#1a2e28] shadow-sm ring-1 ring-[#e8eeee]"
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
          destaque ? "bg-white/15" : "bg-[#f0f4f3]"
        }`}
        aria-hidden
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{titulo}</span>
        <span
          className={`mt-0.5 block text-xs leading-snug ${
            destaque ? "text-white/80" : "text-[#5a6b66]"
          }`}
        >
          {descricao}
        </span>
      </span>
      <span className="shrink-0 text-lg opacity-70" aria-hidden>
        →
      </span>
    </Link>
  );
}

/**
 * Atalhos secundários: rotas e busca IA.
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarAtalhos() {
  return (
    <section className="space-y-3" aria-labelledby="explorar-atalhos-title">
      <h2
        id="explorar-atalhos-title"
        className="text-xs font-bold uppercase tracking-[0.12em] text-[#5a6b66]"
      >
        Mais formas de descobrir
      </h2>
      <AtalhoCard
        href="/rotas"
        emoji="🗺️"
        titulo="Rotas guiadas"
        descricao="Trilhas e percursos com etapas e dicas"
        destaque
      />
      <AtalhoCard
        href="/?busca=1"
        emoji="✨"
        titulo="Busca inteligente"
        descricao='Ex: "restaurante com vista" ou "praia tranquila"'
      />
    </section>
  );
}
