"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

const statusStyles = {
  ativo: "bg-[#d4ede8] text-[#1a4a3a]",
  desativado: "bg-zinc-200 text-zinc-600",
  em_analise: "bg-yellow-100 text-yellow-700",
};

export default function AdminLocaisPage() {
  const { loading } = useAdminAuth();
  const [locais, setLocais] = useState([]);
  const [sortBy, setSortBy] = useState("nome");
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    if (!loading) loadLocais();
  }, [loading]);

  async function loadLocais() {
    const supabase = createClient();
    const { data } = await supabase.from("lugares").select("*");
    setLocais(data ?? []);
  }

  const sorted = useMemo(() => {
    return [...locais].sort((a, b) =>
      String(a[sortBy] || "").localeCompare(String(b[sortBy] || ""))
    );
  }, [locais, sortBy]);

  const pageItems = sorted.slice(page * pageSize, page * pageSize + pageSize);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  async function confirmDelete() {
    if (!deleteTarget) return;
    const supabase = createClient();
    await supabase.from("lugares").delete().eq("id", deleteTarget.id);
    setLocais((items) => items.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">Carregando admin...</div>;
  }

  return (
    <AdminShell title="Locais">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {["nome", "categoria", "status"].map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setSortBy(field)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                sortBy === field ? "bg-[#1a4a3a] text-white" : "bg-white text-[#1a4a3a]"
              }`}
            >
              Ordenar por {field}
            </button>
          ))}
        </div>
        <Link href="/admin/locais/novo" className="rounded-xl bg-[#1a4a3a] px-4 py-2 text-sm font-semibold text-white">
          Novo local
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#1a4a3a] text-white">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((local) => (
              <tr key={local.id} className="border-t border-[#eef3f1]">
                <td className="p-3 font-semibold">{local.nome}</td>
                <td className="p-3">{local.categoria}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[local.status] || statusStyles.em_analise}`}>
                    {local.status || "em_analise"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/locais/${local.id}/editar`} className="font-semibold text-[#1a4a3a]">
                      Editar
                    </Link>
                    <button onClick={() => setDeleteTarget(local)} className="font-semibold text-[#d9534f]">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] disabled:opacity-40">
          Anterior
        </button>
        <span className="text-sm text-[#5a6b66]">Página {page + 1} de {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] disabled:opacity-40">
          Próximo
        </button>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-bold">Excluir local</h2>
            <p className="mt-2 text-sm text-[#5a6b66]">Excluir "{deleteTarget.nome}"?</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl bg-zinc-200 py-3 text-sm font-semibold text-zinc-700">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 rounded-xl bg-[#d9534f] py-3 text-sm font-semibold text-white">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
