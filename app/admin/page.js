"use client";

import { useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";
import {
  formatarDetalhesLog,
  getLogAcaoBadge,
} from "@/lib/logs";

/**
 * ISO timestamp for metrics comparison N days ago.
 * @param {number} days - Days to subtract from today.
 * @returns {string} ISO date string.
 */
function getCutoffIso(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

/**
 * Computes period-over-period percent change label and color class.
 * @param {number} total - Count in current period.
 * @param {number} past - Count before cutoff.
 * @param {string} periodLabel - Label suffix (e.g. "esta semana").
 * @returns {{ text: string, className: string }} Variation display props.
 */
function calcVariation(total, past, periodLabel) {
  if (past === 0) {
    if (total === 0) {
      return { text: "Sem variação", className: "text-gray-500" };
    }
    return {
      text: `+ 100% ${periodLabel}`,
      className: "text-emerald-600",
    };
  }

  const percent = ((total - past) / past) * 100;
  const rounded = Math.round(percent);

  if (rounded === 0) {
    return { text: "Sem variação", className: "text-gray-500" };
  }

  if (rounded > 0) {
    return {
      text: `+ ${rounded}% ${periodLabel}`,
      className: "text-emerald-600",
    };
  }

  return {
    text: `- ${Math.abs(rounded)}% ${periodLabel}`,
    className: "text-red-500",
  };
}

/**
 * Fetches total and past-period row counts for dashboard metrics.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase - Supabase client.
 * @param {string} table - Table name.
 * @param {{ eq?: { field: string, value: unknown }, ltCreatedAt?: string }} [options] - Filters.
 * @returns {Promise<{ total: number, past: number }>} Counts.
 */
async function fetchCount(supabase, table, options = {}) {
  const { eq, ltCreatedAt } = options;

  let totalQuery = supabase.from(table).select("id", { count: "exact", head: true });
  let pastQuery = supabase.from(table).select("id", { count: "exact", head: true });

  if (eq) {
    totalQuery = totalQuery.eq(eq.field, eq.value);
    pastQuery = pastQuery.eq(eq.field, eq.value);
  }

  if (ltCreatedAt) {
    pastQuery = pastQuery.lt("created_at", ltCreatedAt);
  }

  const [totalRes, pastRes] = await Promise.all([totalQuery, pastQuery]);

  return {
    total: totalRes.count ?? 0,
    past: pastRes.count ?? 0,
  };
}

/**
 * Pin icon for dashboard metric cards.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconPin({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

/**
 * User icon for dashboard metric cards.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconUser({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
    </svg>
  );
}

/**
 * Star icon for dashboard metric cards.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconStar({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.56 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}

/**
 * Heart icon for favorites metric card.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconHeart({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/**
 * Dashboard KPI card with icon and period variation.
 * @param {{ label: string, value: number, icon: (props: { className?: string }) => import("react").ReactElement, iconWrap: string, iconColor: string, variation: { text: string, className: string } }} props
 * @returns {import("react").ReactElement}
 */
function MetricCard({ label, value, icon: Icon, iconWrap, iconColor, variation }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
          <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconWrap}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className={`text-sm font-semibold ${variation.className}`}>{variation.text}</p>
      </div>
    </article>
  );
}

/**
 * Renders filled and empty star characters for a rating.
 * @param {number|string} value - Star count 0–5.
 * @returns {import("react").ReactElement}
 */
function Stars({ value }) {
  return (
    <span className="text-[#e8a838]">
      {"★".repeat(Number(value) || 0)}
      <span className="text-zinc-300">{"★".repeat(5 - (Number(value) || 0))}</span>
    </span>
  );
}

/**
 * Week vs month toggle for dashboard metrics period.
 * @param {{ period: string, onChange: (period: string) => void }} props
 * @returns {import("react").ReactElement}
 */
function PeriodSelector({ period, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("semana")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          period === "semana"
            ? "bg-[#1a4a3a] text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Esta semana
      </button>
      <button
        type="button"
        onClick={() => onChange("mes")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          period === "mes"
            ? "bg-[#1a4a3a] text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Este mês
      </button>
    </div>
  );
}

/**
 * Admin dashboard: metrics, pending reviews, and activity logs.
 * @returns {import("react").ReactElement}
 */
export default function AdminDashboard() {
  const { loading } = useAdminAuth();
  const [period, setPeriod] = useState("semana");
  const [metrics, setMetrics] = useState({
    lugares: { total: 0, variation: { text: "Sem variação", className: "text-gray-500" } },
    usuarios: { total: 0, variation: { text: "Sem variação", className: "text-gray-500" } },
    avaliacoesPendentes: { total: 0, variation: { text: "Sem variação", className: "text-gray-500" } },
    favoritos: { total: 0, variation: { text: "Sem variação", className: "text-gray-500" } },
  });
  const [pendentes, setPendentes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [logsPage, setLogsPage] = useState(0);

  useEffect(() => {
    if (loading) return;
    loadDashboard();
  }, [loading, logsPage, period]);

  /** Loads metrics, pending reviews, logs, and profiles for the dashboard. @returns {Promise<void>} */
  async function loadDashboard() {
    const supabase = createClient();
    const days = period === "mes" ? 30 : 7;
    const periodLabel = period === "mes" ? "este mês" : "esta semana";
    const cutoff = getCutoffIso(days);

    const [
      lugaresCounts,
      usuariosCounts,
      avaliacoesCounts,
      favoritosCounts,
      avaliacoes,
      logsRes,
      perfisRes,
    ] = await Promise.all([
      fetchCount(supabase, "lugares", {
        eq: { field: "status", value: "ativo" },
        ltCreatedAt: cutoff,
      }),
      fetchCount(supabase, "perfis", { ltCreatedAt: cutoff }),
      fetchCount(supabase, "avaliacoes", {
        eq: { field: "status", value: "pendente" },
        ltCreatedAt: cutoff,
      }),
      fetchCount(supabase, "favoritos", { ltCreatedAt: cutoff }),
      supabase
        .from("avaliacoes")
        .select("*, lugares(nome)")
        .eq("status", "pendente")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("logs")
        .select("*")
        .order("created_at", { ascending: false })
        .range(logsPage * 20, logsPage * 20 + 19),
      supabase.from("perfis").select("id, nome"),
    ]);

    setMetrics({
      lugares: {
        total: lugaresCounts.total,
        variation: calcVariation(lugaresCounts.total, lugaresCounts.past, periodLabel),
      },
      usuarios: {
        total: usuariosCounts.total,
        variation: calcVariation(usuariosCounts.total, usuariosCounts.past, periodLabel),
      },
      avaliacoesPendentes: {
        total: avaliacoesCounts.total,
        variation: calcVariation(
          avaliacoesCounts.total,
          avaliacoesCounts.past,
          periodLabel
        ),
      },
      favoritos: {
        total: favoritosCounts.total,
        variation: calcVariation(favoritosCounts.total, favoritosCounts.past, periodLabel),
      },
    });

    setPendentes(avaliacoes.data ?? []);
    setLogs(logsRes.data ?? []);
    setPerfis(perfisRes.data ?? []);
  }

  /**
   * Approves or rejects a review from the dashboard queue.
   * @param {string} id - Review id.
   * @param {string} status - New status (`aprovada` | `rejeitada`).
   * @returns {Promise<void>}
   */
  async function updateStatus(id, status) {
    const supabase = createClient();
    await supabase.from("avaliacoes").update({ status }).eq("id", id);
    setPendentes((items) => items.filter((item) => item.id !== id));
    setMetrics((current) => ({
      ...current,
      avaliacoesPendentes: {
        ...current.avaliacoesPendentes,
        total: Math.max(0, current.avaliacoesPendentes.total - 1),
      },
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Visão geral do Guia de Bolso"
      contentClassName="bg-gray-50"
      headerAction={<PeriodSelector period={period} onChange={setPeriod} />}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total de Lugares"
          value={metrics.lugares.total}
          icon={IconPin}
          iconWrap="bg-emerald-100"
          iconColor="text-emerald-600"
          variation={metrics.lugares.variation}
        />
        <MetricCard
          label="Usuários"
          value={metrics.usuarios.total}
          icon={IconUser}
          iconWrap="bg-blue-100"
          iconColor="text-blue-600"
          variation={metrics.usuarios.variation}
        />
        <MetricCard
          label="Avaliações Pendentes"
          value={metrics.avaliacoesPendentes.total}
          icon={IconStar}
          iconWrap="bg-amber-100"
          iconColor="text-amber-600"
          variation={metrics.avaliacoesPendentes.variation}
        />
        <MetricCard
          label="Favoritos"
          value={metrics.favoritos.total}
          icon={IconHeart}
          iconWrap="bg-purple-100"
          iconColor="text-purple-600"
          variation={metrics.favoritos.variation}
        />
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
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={logs.length < 20}
              onClick={() => setLogsPage((page) => page + 1)}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Ação</th>
                <th className="px-4 py-3">Detalhes</th>
                <th className="px-4 py-3">Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Nenhum log encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  const perfil = perfis.find((p) => p.id === log.user_id);
                  const nomeUsuario = perfil?.nome || "Visitante";
                  const badge = getLogAcaoBadge(log.acao);

                  return (
                    <tr
                      key={log.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {nomeUsuario}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatarDetalhesLog(log.detalhes)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {log.created_at
                          ? new Date(log.created_at).toLocaleString("pt-BR")
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
