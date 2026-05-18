"use client";

import { useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";
import { formatarAcaoLog } from "@/lib/logs";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#5a6b66]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#1a4a3a]">{value}</p>
    </div>
  );
}

function Stars({ value }) {
  return (
    <span className="text-[#e8a838]">
      {"★".repeat(Number(value) || 0)}
      <span className="text-zinc-300">{"★".repeat(5 - (Number(value) || 0))}</span>
    </span>
  );
}

export default function AdminDashboard() {
  const { loading } = useAdminAuth();
  const [stats, setStats] = useState({
    lugares: 0,
    avaliacoesPendentes: 0,
    usuarios: 0,
    favoritos: 0,
    irAgora: 0,
  });
  const [pendentes, setPendentes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logsPage, setLogsPage] = useState(0);

  useEffect(() => {
    if (loading) return;
    loadDashboard();
  }, [loading, logsPage]);

  async function loadDashboard() {
    const supabase = createClient();

    const [
      lugares,
      avaliacoesPendentes,
      usuarios,
      favoritos,
      irAgora,
      avaliacoes,
      logsRes,
    ] = await Promise.all([
      supabase
        .from("lugares")
        .select("id", { count: "exact", head: true })
        .eq("status", "ativo"),
      supabase
        .from("avaliacoes")
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente"),
      supabase.from("perfis").select("id", { count: "exact", head: true }),
      supabase.from("favoritos").select("id", { count: "exact", head: true }),
      supabase
        .from("logs")
        .select("id", { count: "exact", head: true })
        .eq("acao", "ir_agora"),
      supabase
        .from("avaliacoes")
        .select("*, lugares(nome), profiles:user_id(full_name,nome)")
        .eq("status", "pendente")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("logs")
        .select("*")
        .order("created_at", { ascending: false })
        .range(logsPage * 20, logsPage * 20 + 19),
    ]);

    setStats({
      lugares: lugares.count ?? 0,
      avaliacoesPendentes: avaliacoesPendentes.count ?? 0,
      usuarios: usuarios.count ?? 0,
      favoritos: favoritos.count ?? 0,
      irAgora: irAgora.count ?? 0,
    });

    if (!avaliacoes.error) {
      setPendentes(avaliacoes.data ?? []);
    } else {
      const { data } = await supabase
        .from("avaliacoes")
        .select("*")
        .eq("status", "pendente")
        .order("created_at", { ascending: false })
        .limit(5);
      setPendentes(data ?? []);
    }
    setLogs(logsRes.data ?? []);
  }

  async function updateStatus(id, status) {
    const supabase = createClient();
    await supabase.from("avaliacoes").update({ status }).eq("id", id);
    setPendentes((items) => items.filter((item) => item.id !== id));
    setStats((current) => ({
      ...current,
      avaliacoesPendentes: Math.max(0, current.avaliacoesPendentes - 1),
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Locais ativos" value={stats.lugares} />
        <StatCard label="Avaliações pendentes" value={stats.avaliacoesPendentes} />
        <StatCard label="Usuários" value={stats.usuarios} />
        <StatCard label="Favoritos" value={stats.favoritos} />
        <StatCard label="Cliques IR AGORA" value={stats.irAgora} />
      </div>

      <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-[#1a2e28]">
          Últimas avaliações pendentes
        </h2>

        <div className="mt-4 grid gap-3">
          {pendentes.length === 0 ? (
            <p className="text-sm text-[#5a6b66]">Nenhuma avaliação pendente.</p>
          ) : (
            pendentes.map((avaliacao) => (
              <article
                key={avaliacao.id}
                className="rounded-xl border border-[#eef3f1] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-[#1a2e28]">
                      {avaliacao.lugares?.nome || "Lugar"}
                    </p>
                    <Stars value={avaliacao.nota} />
                    <p className="mt-2 text-sm text-[#5a6b66]">
                      {avaliacao.comentario || "Sem comentário"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(avaliacao.id, "aprovada")}
                      className="rounded-lg bg-[#1a4a3a] px-3 py-2 text-sm font-semibold text-white"
                    >
                      Aprovar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(avaliacao.id, "rejeitada")}
                      className="rounded-lg bg-[#d9534f] px-3 py-2 text-sm font-semibold text-white"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#1a2e28]">Logs recentes</h2>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={logsPage === 0}
              onClick={() => setLogsPage((page) => Math.max(0, page - 1))}
              className="rounded-lg bg-[#f0f4f3] px-3 py-2 text-sm font-semibold text-[#1a4a3a] disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={logs.length < 20}
              onClick={() => setLogsPage((page) => page + 1)}
              className="rounded-lg bg-[#f0f4f3] px-3 py-2 text-sm font-semibold text-[#1a4a3a] disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-[#5a6b66]">
              <tr>
                <th className="p-2">Usuário</th>
                <th className="p-2">Ação</th>
                <th className="p-2">Detalhes</th>
                <th className="p-2">Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-[#eef3f1]">
                  <td className="p-2">{log.user_nome || log.user_email || "Visitante"}</td>
                  <td className="p-2 font-semibold text-[#1a4a3a]">
                    {formatarAcaoLog(log)}
                  </td>
                  <td className="p-2 text-[#5a6b66]">
                    {JSON.stringify(log.detalhes || {})}
                  </td>
                  <td className="p-2 text-[#5a6b66]">
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString("pt-BR")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
