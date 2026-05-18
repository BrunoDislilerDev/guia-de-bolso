"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

const categoryStyles = {
  Natureza: "bg-[#d4ede8] text-[#1a4a3a]",
  Gastronomia: "bg-[#f0e4d4] text-[#6b5344]",
  Noite: "bg-[#e4d4f0] text-[#5c4a6e]",
  Serviços: "bg-[#c5dff5] text-[#2a5a7a]",
  Hospedagem: "bg-[#f5e6b8] text-[#7a6520]",
  Cultura: "bg-purple-100 text-purple-700",
  Aventura: "bg-orange-100 text-orange-700",
  "Bem-estar": "bg-pink-100 text-pink-700",
  Compras: "bg-blue-100 text-blue-700",
};

function getFoto(lugar) {
  return lugar.foto_url || lugar.imagem_url || lugar.foto_capa || "";
}

function getCidade(lugar) {
  const localizacao = Array.isArray(lugar.localizacoes)
    ? lugar.localizacoes[0]
    : lugar.localizacoes;
  return lugar.cidade || localizacao?.cidade || "";
}

function getInitials(nome) {
  return String(nome || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function isAtivo(lugar) {
  return lugar.status === "ativo" || lugar.ativa === true;
}

function LugarCard({ lugar, onDelete }) {
  const foto = getFoto(lugar);
  const cidade = getCidade(lugar);
  const ativo = isAtivo(lugar);

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt={lugar.nome} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-bold text-white">
              {getInitials(lugar.nome)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-[#1a2e28]">{lugar.nome}</h2>
          {lugar.categoria && (
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                categoryStyles[lugar.categoria] || "bg-gray-100 text-gray-600"
              }`}
            >
              {lugar.categoria}
            </span>
          )}
          <p className="mt-2 text-sm text-gray-400">{cidade || "Cidade não informada"}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            ativo ? "bg-[#d4ede8] text-[#1a4a3a]" : "bg-gray-200 text-gray-600"
          }`}
        >
          {ativo ? "ativo" : "inativo"}
        </span>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/locais/${lugar.id}/editar`}
            className="text-sm font-semibold text-[#1a4a3a]"
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={() => onDelete(lugar)}
            className="text-sm font-semibold text-[#d9534f]"
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}

export default function LugaresGridPage() {
  const { loading } = useAdminAuth();
  const [lugares, setLugares] = useState([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [cidade, setCidade] = useState("Todas");

  const loadLugares = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("lugares")
      .select("*, localizacoes(cidade)")
      .order("nome");

    setLugares(data ?? []);
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const timer = setTimeout(() => {
      loadLugares();
    }, 0);

    return () => clearTimeout(timer);
  }, [loading, loadLugares]);

  async function handleDelete(lugar) {
    const confirmed = window.confirm(`Excluir "${lugar.nome}"?`);
    if (!confirmed) return;

    const supabase = createClient();
    await supabase.from("lugares").update({ status: "desativado" }).eq("id", lugar.id);
    setLugares((items) =>
      items.map((item) =>
        item.id === lugar.id ? { ...item, status: "desativado", ativa: false } : item
      )
    );
  }

  const categorias = useMemo(() => {
    return [...new Set(lugares.map((lugar) => lugar.categoria).filter(Boolean))].sort();
  }, [lugares]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return lugares.filter((lugar) => {
      const matchesSearch = !term || String(lugar.nome || "").toLowerCase().includes(term);
      const matchesCategoria = categoria === "Todas" || lugar.categoria === categoria;
      const matchesStatus =
        status === "Todos" ||
        (status === "Ativos" ? isAtivo(lugar) : !isAtivo(lugar));
      const matchesCidade = cidade === "Todas" || getCidade(lugar) === cidade;

      return matchesSearch && matchesCategoria && matchesStatus && matchesCidade;
    });
  }, [lugares, search, categoria, status, cidade]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell title="Lugares">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-[#5a6b66]">
            Exibindo {filtered.length} de {lugares.length} lugares
          </p>
        </div>
        <Link
          href="/admin/locais/novo"
          className="rounded-xl bg-[#1a4a3a] px-4 py-2 text-center text-sm font-semibold text-white"
        >
          Novo Lugar
        </Link>
      </div>

      <div className="mb-5 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome"
          className="rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm outline-none ring-[#1a4a3a]/20 focus:ring-2"
        />
        <select
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          className="rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm outline-none ring-[#1a4a3a]/20 focus:ring-2"
        >
          <option>Todas</option>
          {categorias.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm outline-none ring-[#1a4a3a]/20 focus:ring-2"
        >
          <option>Todos</option>
          <option>Ativos</option>
          <option>Inativos</option>
        </select>
        <select
          value={cidade}
          onChange={(event) => setCidade(event.target.value)}
          className="rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm outline-none ring-[#1a4a3a]/20 focus:ring-2"
        >
          <option>Todas</option>
          <option>Garopaba</option>
          <option>Imbituba</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-5 text-sm text-[#5a6b66] shadow-sm">
          Nenhum lugar encontrado com os filtros selecionados.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((lugar) => (
            <LugarCard key={lugar.id} lugar={lugar} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
