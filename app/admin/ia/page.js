"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

const USD_BRL = 5.8;
const PAGE_SIZE = 20;

const PERIOD_OPTIONS = [
  { id: "1d", label: "Hoje", days: 1 },
  { id: "7d", label: "7 dias", days: 7 },
  { id: "30d", label: "30 dias", days: 30 },
  { id: "90d", label: "90 dias", days: 90 },
];

const FEATURE_OPTIONS = [
  { id: "all", label: "Todas" },
  { id: "busca", label: "Busca" },
  { id: "roteiro", label: "Roteiro" },
  { id: "moderacao", label: "Moderação" },
];

const CURRENCY_OPTIONS = [
  { id: "USD", label: "USD $" },
  { id: "BRL", label: "BRL R$" },
];

const FEATURE_LABEL = {
  busca: "Busca",
  roteiro: "Roteiro",
  moderacao: "Moderação",
};

const FEATURE_BADGE = {
  busca: "bg-blue-100 text-blue-700",
  roteiro: "bg-emerald-100 text-emerald-700",
  moderacao: "bg-amber-100 text-amber-700",
};

function toIsoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function formatUsd(value) {
  return `$${Number(value || 0).toFixed(4)}`;
}

function formatBrl(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(value || 0)
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value || 0));
}

function formatDateTime(value) {
  const dt = new Date(value);
  return dt.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", " às");
}

function sum(list, field) {
  return list.reduce((acc, item) => acc + Number(item[field] || 0), 0);
}

function getStatusLatencia(ms) {
  if (ms < 2000) return { label: "Rápido", className: "text-emerald-700" };
  if (ms <= 5000) return { label: "Normal", className: "text-amber-700" };
  return { label: "Lento", className: "text-red-700" };
}

function calcVariation(curr, prev) {
  const a = Number(curr || 0);
  const b = Number(prev || 0);
  if (b === 0) return 0;
  return ((a - b) / b) * 100;
}

function featureCost(logs, feature) {
  return logs
    .filter((l) => l.feature === feature && l.sucesso)
    .reduce((acc, l) => acc + Number(l.custo_usd || 0), 0);
}

function groupByDay(logs, days) {
  const now = new Date();
  /** @type {Record<string, { date: string, busca: number, roteiro: number, moderacao: number, calls: number }>} */
  const map = {};
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map[key] = { date: key, busca: 0, roteiro: 0, moderacao: 0, calls: 0 };
  }

  logs.forEach((log) => {
    const key = String(log.created_at || "").slice(0, 10);
    if (!map[key]) return;
    const feature = log.feature;
    const cost = Number(log.custo_usd || 0);
    if (feature === "busca" || feature === "roteiro" || feature === "moderacao") {
      map[key][feature] += cost;
    }
    map[key].calls += 1;
  });

  return Object.values(map);
}

export default function AdminIAPage() {
  const { loading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState("30d");
  const [feature, setFeature] = useState("all");
  const [currency, setCurrency] = useState("USD");
  const [page, setPage] = useState(1);
  const [expandedErrorId, setExpandedErrorId] = useState(null);

  const [logs, setLogs] = useState([]);
  const [previousLogs, setPreviousLogs] = useState([]);
  const [profilesMap, setProfilesMap] = useState({});

  const [simUsers, setSimUsers] = useState(100);
  const [simBuscasDia, setSimBuscasDia] = useState(5);
  const [simRoteirosMes, setSimRoteirosMes] = useState(2);

  const period = PERIOD_OPTIONS.find((p) => p.id === periodId) || PERIOD_OPTIONS[2];

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      const from = toIsoDaysAgo(period.days);
      const prevFrom = toIsoDaysAgo(period.days * 2);
      const prevTo = from;

      let q = supabase
        .from("logs_ia")
        .select("*")
        .gte("created_at", from)
        .order("created_at", { ascending: false });

      let qPrev = supabase
        .from("logs_ia")
        .select("*")
        .gte("created_at", prevFrom)
        .lt("created_at", prevTo)
        .order("created_at", { ascending: false });

      if (feature !== "all") {
        q = q.eq("feature", feature);
        qPrev = qPrev.eq("feature", feature);
      }

      const [currRes, prevRes] = await Promise.all([q, qPrev]);
      const curr = currRes.data || [];
      const prev = prevRes.data || [];

      const userIds = [...new Set(curr.map((l) => l.user_id).filter(Boolean))];
      let map = {};
      if (userIds.length > 0) {
        const { data: perfis } = await supabase.from("perfis").select("id, nome").in("id", userIds);
        map = Object.fromEntries((perfis || []).map((p) => [p.id, p.nome || "Usuário"]));
      }

      if (!active) return;
      setLogs(curr);
      setPreviousLogs(prev);
      setProfilesMap(map);
      setPage(1);
      setLoading(false);
    }

    loadData();
    return () => {
      active = false;
    };
  }, [authLoading, period.days, feature]);

  const totalCalls = logs.length;
  const successCalls = logs.filter((l) => l.sucesso).length;
  const failedCalls = totalCalls - successCalls;
  const successRate = totalCalls > 0 ? (successCalls / totalCalls) * 100 : 0;
  const errorRate = totalCalls > 0 ? (failedCalls / totalCalls) * 100 : 0;

  const totalCostUsd = logs.reduce((acc, l) => acc + Number(l.custo_usd || 0), 0);
  const totalCostBrl = totalCostUsd * USD_BRL;
  const prevCostUsd = previousLogs.reduce((acc, l) => acc + Number(l.custo_usd || 0), 0);
  const costVariation = calcVariation(totalCostUsd, prevCostUsd);

  const inputTokens = sum(logs, "input_tokens");
  const outputTokens = sum(logs, "output_tokens");
  const cacheCreationTokens = sum(logs, "cache_creation_tokens");
  const cacheReadTokens = sum(logs, "cache_read_tokens");
  const totalTokens = inputTokens + outputTokens;
  const cacheSavingsUsd = cacheReadTokens * ((3 - 0.3) / 1_000_000);

  const avgCostUsd = totalCalls > 0 ? totalCostUsd / totalCalls : 0;
  const avgCostBrl = avgCostUsd * USD_BRL;
  const avgLatency = totalCalls > 0 ? sum(logs, "latencia_ms") / totalCalls : 0;
  const latencyStatus = getStatusLatencia(avgLatency);

  const monthlyProjectionUsd = period.days > 0 ? (totalCostUsd / period.days) * 30 : 0;
  const monthlyProjectionBrl = monthlyProjectionUsd * USD_BRL;

  const costBusca = featureCost(logs, "busca");
  const costRoteiro = featureCost(logs, "roteiro");
  const costModeracao = featureCost(logs, "moderacao");

  const chartDays = period.days >= 30 ? 30 : 7;
  const chartData = groupByDay(logs, chartDays);
  const maxDaily = Math.max(
    0.001,
    ...chartData.map((d) => d.busca + d.roteiro + d.moderacao)
  );

  const pagedLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, page]);
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));

  const sim = useMemo(() => {
    const users = Number(simUsers || 0);
    const buscasDia = Number(simBuscasDia || 0);
    const roteirosMes = Number(simRoteirosMes || 0);

    const buscasMes = users * buscasDia * 30;
    const roteirosMesTotal = users * roteirosMes;
    const moderacoesMes = Math.round((buscasMes + roteirosMesTotal) * 0.08);

    const buscaInput = 2550;
    const buscaOutput = 300;
    const roteiroInput = 5400;
    const roteiroOutput = 1500;
    const modInput = 800;
    const modOutput = 150;
    const inPrice = 3 / 1_000_000;
    const outPrice = 15 / 1_000_000;
    const cacheReadPrice = 0.3 / 1_000_000;

    const buscaCostNoCache = buscasMes * (buscaInput * inPrice + buscaOutput * outPrice);
    const roteiroCostNoCache = roteirosMesTotal * (roteiroInput * inPrice + roteiroOutput * outPrice);
    const modCostNoCache = moderacoesMes * (modInput * inPrice + modOutput * outPrice);

    const buscaCostWithCache = buscasMes * (buscaInput * 0.7 * cacheReadPrice + buscaOutput * outPrice);
    const roteiroCostWithCache =
      roteirosMesTotal * (roteiroInput * 0.7 * cacheReadPrice + roteiroOutput * outPrice);
    const modCostWithCache = moderacoesMes * (modInput * 0.7 * cacheReadPrice + modOutput * outPrice);

    const totalNoCache = buscaCostNoCache + roteiroCostNoCache + modCostNoCache;
    const totalWithCache = buscaCostWithCache + roteiroCostWithCache + modCostWithCache;

    return {
      buscasMes,
      roteirosMesTotal,
      moderacoesMes,
      buscaCostNoCache,
      roteiroCostNoCache,
      modCostNoCache,
      buscaCostWithCache,
      roteiroCostWithCache,
      modCostWithCache,
      totalNoCache,
      totalWithCache,
    };
  }, [simUsers, simBuscasDia, simRoteirosMes]);

  const alerts = useMemo(() => {
    const list = [];
    const todayCost = logs
      .filter((l) => String(l.created_at).slice(0, 10) === new Date().toISOString().slice(0, 10))
      .reduce((acc, l) => acc + Number(l.custo_usd || 0), 0);

    if (todayCost > 5) list.push({ type: "danger", text: `ALERTA: custo do dia em ${formatUsd(todayCost)}.` });
    if (errorRate > 10) list.push({ type: "warn", text: `AVISO: taxa de erro em ${errorRate.toFixed(1)}%.` });
    if (avgLatency > 5000) list.push({ type: "warn", text: `AVISO: latência média em ${(avgLatency / 1000).toFixed(1)}s.` });
    if (inputTokens > 0 && cacheReadTokens / inputTokens > 0.5) {
      list.push({
        type: "success",
        text: `ECONOMIA: cache funcionando bem — economia estimada de ${formatUsd(cacheSavingsUsd)} no período.`,
      });
    }
    if (cacheReadTokens === 0) {
      list.push({ type: "info", text: "DICA: sem cache hit no período; verifique volume e repetição de prompts." });
    }
    return list;
  }, [logs, errorRate, avgLatency, inputTokens, cacheReadTokens, cacheSavingsUsd]);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3]">Carregando...</div>;
  }

  return (
    <AdminShell title="IA & Custos" subtitle="Monitoramento de uso, custo e performance da IA">
      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center text-[#5a6b66] shadow-sm">Carregando métricas...</div>
      ) : (
        <div className="space-y-6">
          <section className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
            <select
              value={periodId}
              onChange={(e) => setPeriodId(e.target.value)}
              className="rounded-xl border border-[#dce5e2] px-3 py-2 text-sm font-semibold"
            >
              {PERIOD_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <select
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              className="rounded-xl border border-[#dce5e2] px-3 py-2 text-sm font-semibold"
            >
              {FEATURE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-xl border border-[#dce5e2] px-3 py-2 text-sm font-semibold"
            >
              {CURRENCY_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Custo total do período">
              <Value currency={currency} usd={totalCostUsd} brl={totalCostBrl} />
              <p className="text-xs text-[#5a6b66]">
                {formatUsd(totalCostUsd)} · {formatBrl(totalCostBrl)}
              </p>
              <p className={`mt-1 text-xs ${costVariation <= 0 ? "text-emerald-700" : "text-red-700"}`}>
                {costVariation === 0 ? "sem variação" : `${costVariation > 0 ? "+" : ""}${costVariation.toFixed(1)}% vs período anterior`}
              </p>
            </Card>
            <Card title="Total de chamadas">
              <p className="text-2xl font-bold">{formatNumber(totalCalls)}</p>
              <p className="text-xs text-[#5a6b66]">Sucesso: {successRate.toFixed(1)}%</p>
              <p className={`text-xs ${errorRate > 5 ? "text-red-700" : "text-[#5a6b66]"}`}>
                Falhas: {failedCalls} ({errorRate.toFixed(1)}%)
              </p>
            </Card>
            <Card title="Tokens consumidos">
              <p className="text-2xl font-bold">{formatNumber(totalTokens)}</p>
              <p className="text-xs text-[#5a6b66]">Cache lido: {formatNumber(cacheReadTokens)}</p>
              <p className="text-xs text-emerald-700">Economia estimada: {formatUsd(cacheSavingsUsd)}</p>
            </Card>
            <Card title="Custo médio por chamada">
              <Value currency={currency} usd={avgCostUsd} brl={avgCostBrl} />
              <p className="text-xs text-[#5a6b66]">
                {formatUsd(avgCostUsd)} · {formatBrl(avgCostBrl)}
              </p>
              <p className="mt-1 text-xs text-[#5a6b66]">
                Busca {formatUsd(costBusca)} · Roteiro {formatUsd(costRoteiro)} · Moderação {formatUsd(costModeracao)}
              </p>
            </Card>
            <Card title="Latência média">
              <p className="text-2xl font-bold">{(avgLatency / 1000).toFixed(1)}s</p>
              <p className={`text-xs ${latencyStatus.className}`}>{latencyStatus.label}</p>
            </Card>
            <Card title="Projeção mensal">
              <Value currency={currency} usd={monthlyProjectionUsd} brl={monthlyProjectionBrl} />
              <p className="text-xs text-[#5a6b66]">
                {formatUsd(monthlyProjectionUsd)} · {formatBrl(monthlyProjectionBrl)}
              </p>
              {monthlyProjectionUsd > 50 ? (
                <span className="mt-2 inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  Alerta: projeção acima de $50
                </span>
              ) : null}
            </Card>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Custo por dia</h2>
            <div className="grid grid-cols-7 gap-2 md:grid-cols-10 lg:grid-cols-12">
              {chartData.map((d) => {
                const total = d.busca + d.roteiro + d.moderacao;
                const h = Math.max(4, Math.round((total / maxDaily) * 120));
                return (
                  <div key={d.date} className="group flex flex-col items-center">
                    <div className="relative flex h-32 w-full items-end justify-center rounded-md bg-[#f6faf8] px-1">
                      <div className="w-full">
                        <div className="w-full rounded-t-sm bg-blue-500" style={{ height: `${Math.round((d.busca / maxDaily) * 120)}px` }} />
                        <div className="w-full bg-emerald-500" style={{ height: `${Math.round((d.roteiro / maxDaily) * 120)}px` }} />
                        <div className="w-full rounded-b-sm bg-amber-500" style={{ height: `${Math.round((d.moderacao / maxDaily) * 120)}px` }} />
                      </div>
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-40 -translate-x-1/2 rounded-md bg-[#1a2e28] p-2 text-[11px] text-white group-hover:block">
                        <p>{d.date}</p>
                        <p>Busca: {formatUsd(d.busca)}</p>
                        <p>Roteiro: {formatUsd(d.roteiro)}</p>
                        <p>Moderação: {formatUsd(d.moderacao)}</p>
                        <p>Chamadas: {d.calls}</p>
                      </div>
                    </div>
                    <p className="mt-1 text-[10px] text-[#5a6b66]">{d.date.slice(5)}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-bold">Previsão de custo por escala</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <NumberInput label="Usuários ativos" value={simUsers} onChange={setSimUsers} />
              <NumberInput label="Buscas/dia por usuário" value={simBuscasDia} onChange={setSimBuscasDia} />
              <NumberInput label="Roteiros/mês por usuário" value={simRoteirosMes} onChange={setSimRoteirosMes} />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-[#e5ece9] text-left text-[#5a6b66]">
                    <th className="py-2">Métrica</th>
                    <th className="py-2">Sem cache</th>
                    <th className="py-2">Com cache (70% input)</th>
                  </tr>
                </thead>
                <tbody>
                  <Row label="Buscas/mês total" left={formatNumber(sim.buscasMes)} right={formatNumber(sim.buscasMes)} />
                  <Row label="Custo buscas/mês" left={`${formatUsd(sim.buscaCostNoCache)} / ${formatBrl(sim.buscaCostNoCache * USD_BRL)}`} right={`${formatUsd(sim.buscaCostWithCache)} / ${formatBrl(sim.buscaCostWithCache * USD_BRL)}`} />
                  <Row label="Roteiros/mês total" left={formatNumber(sim.roteirosMesTotal)} right={formatNumber(sim.roteirosMesTotal)} />
                  <Row label="Custo roteiros/mês" left={`${formatUsd(sim.roteiroCostNoCache)} / ${formatBrl(sim.roteiroCostNoCache * USD_BRL)}`} right={`${formatUsd(sim.roteiroCostWithCache)} / ${formatBrl(sim.roteiroCostWithCache * USD_BRL)}`} />
                  <Row label="Moderações/mês" left={formatNumber(sim.moderacoesMes)} right={formatNumber(sim.moderacoesMes)} />
                  <Row label="Custo moderação/mês" left={`${formatUsd(sim.modCostNoCache)} / ${formatBrl(sim.modCostNoCache * USD_BRL)}`} right={`${formatUsd(sim.modCostWithCache)} / ${formatBrl(sim.modCostWithCache * USD_BRL)}`} />
                  <Row strong label="TOTAL/mês" left={`${formatUsd(sim.totalNoCache)} / ${formatBrl(sim.totalNoCache * USD_BRL)}`} right={`${formatUsd(sim.totalWithCache)} / ${formatBrl(sim.totalWithCache * USD_BRL)}`} />
                  <Row strong label="TOTAL/ano" left={`${formatUsd(sim.totalNoCache * 12)} / ${formatBrl(sim.totalNoCache * 12 * USD_BRL)}`} right={`${formatUsd(sim.totalWithCache * 12)} / ${formatBrl(sim.totalWithCache * 12 * USD_BRL)}`} />
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-bold">Logs detalhados</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-sm">
                <thead>
                  <tr className="border-b border-[#e5ece9] text-left text-[#5a6b66]">
                    <th className="py-2">Data/hora</th>
                    <th className="py-2">Feature</th>
                    <th className="py-2">Usuário</th>
                    <th className="py-2">Tokens</th>
                    <th className="py-2">Cache hit</th>
                    <th className="py-2">USD</th>
                    <th className="py-2">BRL</th>
                    <th className="py-2">Latência</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedLogs.map((log) => (
                    <Fragment key={log.id}>
                      <tr
                        className="cursor-pointer border-b border-[#f0f4f3] hover:bg-[#f8fbfa]"
                        onClick={() => setExpandedErrorId((curr) => (curr === log.id ? null : log.id))}
                      >
                        <td className="py-2">{formatDateTime(log.created_at)}</td>
                        <td className="py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${FEATURE_BADGE[log.feature] || "bg-gray-100 text-gray-700"}`}>
                            {FEATURE_LABEL[log.feature] || log.feature}
                          </span>
                        </td>
                        <td className="py-2">{profilesMap[log.user_id] || "Anônimo"}</td>
                        <td className="py-2">
                          {formatNumber(log.input_tokens)} / {formatNumber(log.output_tokens)}
                        </td>
                        <td className="py-2">{Number(log.cache_read_tokens || 0) > 0 ? <span className="text-emerald-700">✓</span> : "—"}</td>
                        <td className="py-2">{formatUsd(log.custo_usd || 0)}</td>
                        <td className="py-2">{formatBrl((log.custo_usd || 0) * USD_BRL)}</td>
                        <td className="py-2">{(Number(log.latencia_ms || 0) / 1000).toFixed(1)}s</td>
                        <td className="py-2">
                          {log.sucesso ? <span className="text-emerald-700">✓ sucesso</span> : <span className="text-red-700">✗ erro</span>}
                        </td>
                      </tr>
                      {!log.sucesso && expandedErrorId === log.id ? (
                        <tr key={`err-${log.id}`} className="border-b border-[#f0f4f3] bg-red-50/50">
                          <td colSpan={9} className="px-3 py-2 text-xs text-red-700">{log.erro || "Erro sem detalhes"}</td>
                        </tr>
                      ) : null}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-[#5a6b66]">Página {page} de {totalPages}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-[#dce5e2] px-3 py-1 text-sm disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[#dce5e2] px-3 py-1 text-sm disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Próxima
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-[#f7faf9] p-4 shadow-sm ring-1 ring-[#dce5e2]">
            <h2 className="mb-2 text-lg font-bold">Alertas e recomendações</h2>
            <ul className="space-y-1 text-sm">
              {alerts.map((a, idx) => (
                <li
                  key={`${a.type}-${idx}`}
                  className={
                    a.type === "danger"
                      ? "text-red-700"
                      : a.type === "warn"
                        ? "text-amber-700"
                        : a.type === "success"
                          ? "text-emerald-700"
                          : "text-[#1a4a3a]"
                  }
                >
                  {a.type === "danger" ? "🔴 " : a.type === "warn" ? "🟡 " : a.type === "success" ? "🟢 " : "💡 "}
                  {a.text}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </AdminShell>
  );
}

function Card({ title, children }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[#5a6b66]">{title}</h3>
      <div className="mt-2">{children}</div>
    </article>
  );
}

function Value({ currency, usd, brl }) {
  if (currency === "BRL") return <p className="text-2xl font-bold">{formatBrl(brl)}</p>;
  return <p className="text-2xl font-bold">{formatUsd(usd)}</p>;
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block font-semibold text-[#5a6b66]">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="w-full rounded-xl border border-[#dce5e2] px-3 py-2 font-semibold"
      />
    </label>
  );
}

function Row({ label, left, right, strong = false }) {
  return (
    <tr className="border-b border-[#f0f4f3]">
      <td className={`py-2 ${strong ? "font-bold" : ""}`}>{label}</td>
      <td className={`py-2 ${strong ? "font-bold" : ""}`}>{left}</td>
      <td className={`py-2 ${strong ? "font-bold text-emerald-700" : "text-emerald-700"}`}>{right}</td>
    </tr>
  );
}
