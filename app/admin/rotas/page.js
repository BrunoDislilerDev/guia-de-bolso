"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

function formatDuracao(minutos) {
  if (minutos === null || minutos === undefined) return "—";
  const total = Number(minutos);
  if (!Number.isFinite(total)) return "—";
  const horas = Math.floor(total / 60);
  const mins = total % 60;
  return horas > 0 ? `${horas}h ${mins > 0 ? `${mins}m` : ""}`.trim() : `${mins}m`;
}

function statusStyle(ativa) {
  return ativa ? "bg-[#d4ede8] text-[#1a4a3a]" : "bg-zinc-200 text-zinc-600";
}

export default function AdminRotasPage() {
  const { loading } = useAdminAuth();
  const [rotas, setRotas] = useState([]);
  const [message, setMessage] = useState("");

  const loadRotas = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("rotas")
      .select("*")
      .order("created_at", { ascending: false });

    setRotas(data ?? []);
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const timer = setTimeout(() => {
      loadRotas();
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "created") setMessage("Rota criada com sucesso.");
      if (params.get("success") === "updated") setMessage("Rota atualizada com sucesso.");
    }, 0);

    return () => clearTimeout(timer);
  }, [loading, loadRotas]);

  async function toggleDestaque(rota) {
    const supabase = createClient();
    setRotas((items) =>
      items.map((item) => ({ ...item, destaque: item.id === rota.id }))
    );

    await supabase.from("rotas").update({ destaque: false }).neq("id", rota.id);
    await supabase.from("rotas").update({ destaque: true }).eq("id", rota.id);
  }

  async function softDelete(rota) {
    const confirmed = window.confirm(`Desativar a rota "${rota.nome || rota.titulo}"?`);
    if (!confirmed) return;

    const supabase = createClient();
    setRotas((items) =>
      items.map((item) => (item.id === rota.id ? { ...item, ativa: false } : item))
    );
    await supabase.from("rotas").update({ ativa: false }).eq("id", rota.id);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell title="Rotas">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[#5a6b66]">
            Gerencie trilhas, caminhos e pontos do percurso.
          </p>
          {message && (
            <p className="mt-2 text-sm font-semibold text-[#1a4a3a]">{message}</p>
          )}
        </div>
        <Link
          href="/admin/rotas/nova"
          className="rounded-xl bg-[#1a4a3a] px-4 py-2 text-center text-sm font-semibold text-white"
        >
          Nova Rota
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[#1a4a3a] text-white">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Cidade</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Dificuldade</th>
              <th className="p-3">Duração</th>
              <th className="p-3">Destaque</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rotas.map((rota) => (
              <tr key={rota.id} className="border-t border-[#eef3f1]">
                <td className="p-3 font-semibold">{rota.nome || rota.titulo}</td>
                <td className="p-3">{rota.cidade || "—"}</td>
                <td className="p-3">{rota.categoria || "—"}</td>
                <td className="p-3">{rota.dificuldade || "—"}</td>
                <td className="p-3">{formatDuracao(rota.duracao_minutos)}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => toggleDestaque(rota)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      rota.destaque
                        ? "bg-[#d4ede8] text-[#1a4a3a]"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {rota.destaque ? "Sim" : "Não"}
                  </button>
                </td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(rota.ativa)}`}>
                    {rota.ativa ? "ativo" : "inativo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/rotas/${rota.id}/editar`} className="font-semibold text-[#1a4a3a]">
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => softDelete(rota)}
                      className="font-semibold text-[#d9534f]"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
