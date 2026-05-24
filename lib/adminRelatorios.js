import { calcVariation } from "@/lib/adminDashboard";
import { AVALIACAO_STATUS_APROVADOS } from "@/lib/avaliacoes";
import { getUsageDayKey } from "@/lib/premium";
import {
  getBrasiliaDayEndDbString,
  getBrasiliaDayStartDbString,
} from "@/lib/supabaseTimestamp";

/** @typedef {'ultimos_30_dias'|'este_mes'|'mes_anterior'|'ultimos_3_meses'} PeriodoRelatorioId */

export const PERIODO_RELATORIO_OPTIONS = [
  { id: "ultimos_30_dias", label: "Últimos 30 dias" },
  { id: "este_mes", label: "Este mês" },
  { id: "mes_anterior", label: "Mês anterior" },
  { id: "ultimos_3_meses", label: "Últimos 3 meses" },
];

/** Ações contadas como visualização do local. */
export const LOG_ACOES_VISUALIZACAO = ["visualizou_lugar", "acesso_app"];

/**
 * @param {Date} date
 * @returns {string} YYYY-MM-DD em America/Sao_Paulo
 */
function dayKeyFromDate(date) {
  return getUsageDayKey(date);
}

/**
 * Primeiro dia do mês (YYYY-MM) em Brasília.
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {string}
 */
function firstDayOfMonth(year, month) {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

/**
 * Último dia do mês.
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {string}
 */
function lastDayOfMonth(year, month) {
  const last = new Date(Date.UTC(year, month, 0, 12, 0, 0));
  return dayKeyFromDate(last);
}

/**
 * @param {string} dayKey
 * @param {number} offsetDays
 * @returns {string}
 */
function addDaysToDayKey(dayKey, offsetDays) {
  const [y, m, d] = dayKey.split("-").map(Number);
  const anchor = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  anchor.setUTCDate(anchor.getUTCDate() + offsetDays);
  return dayKeyFromDate(anchor);
}

/**
 * @typedef {{ start: string, end: string, label: string }} PeriodoRange
 */

/**
 * Intervalo atual e anterior para comparação de métricas.
 * @param {PeriodoRelatorioId} periodId
 * @returns {{ current: PeriodoRange, previous: PeriodoRange }}
 */
export function getReportPeriodRanges(periodId) {
  const todayKey = dayKeyFromDate(new Date());
  const [ty, tm] = todayKey.split("-").map(Number);

  /** @type {{ startKey: string, endKey: string, label: string }} */
  let current;

  if (periodId === "este_mes") {
    current = {
      startKey: firstDayOfMonth(ty, tm),
      endKey: todayKey,
      label: "Este mês",
    };
  } else if (periodId === "mes_anterior") {
    const prevMonth = tm === 1 ? 12 : tm - 1;
    const prevYear = tm === 1 ? ty - 1 : ty;
    const startKey = firstDayOfMonth(prevYear, prevMonth);
    const endKey = lastDayOfMonth(prevYear, prevMonth);
    current = { startKey, endKey, label: "Mês anterior" };
  } else if (periodId === "ultimos_3_meses") {
    current = {
      startKey: addDaysToDayKey(todayKey, -89),
      endKey: todayKey,
      label: "Últimos 3 meses",
    };
  } else {
    current = {
      startKey: addDaysToDayKey(todayKey, -29),
      endKey: todayKey,
      label: "Últimos 30 dias",
    };
  }

  const startMs = new Date(`${current.startKey}T12:00:00Z`).getTime();
  const endMs = new Date(`${current.endKey}T12:00:00Z`).getTime();
  const durationDays = Math.max(
    1,
    Math.round((endMs - startMs) / (24 * 60 * 60 * 1000)) + 1
  );

  const prevEndKey = addDaysToDayKey(current.startKey, -1);
  const prevStartKey = addDaysToDayKey(prevEndKey, -(durationDays - 1));

  return {
    current: {
      start: getBrasiliaDayStartDbString(current.startKey),
      end: getBrasiliaDayEndDbString(current.endKey),
      label: current.label,
    },
    previous: {
      start: getBrasiliaDayStartDbString(prevStartKey),
      end: getBrasiliaDayEndDbString(prevEndKey),
      label: "Período anterior",
    },
  };
}

/**
 * @param {unknown} detalhes
 * @param {string} lugarId
 * @returns {boolean}
 */
export function logDetalhesMatchLugar(detalhes, lugarId) {
  if (!detalhes || typeof detalhes !== "object") return false;
  const id = detalhes.lugar_id ?? detalhes.lugarId;
  return String(id) === String(lugarId);
}

/**
 * Conta logs por ação e lugar no intervalo.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string[]} acoes
 * @param {string} lugarId
 * @param {string} start
 * @param {string} end
 * @returns {Promise<number>}
 */
export async function countLogsForLugar(supabase, acoes, lugarId, start, end) {
  const { data, error } = await supabase
    .from("logs")
    .select("acao, detalhes")
    .in("acao", acoes)
    .gte("created_at", start)
    .lte("created_at", end);

  if (error) {
    console.error("[relatorios] logs:", error.message);
    return 0;
  }

  return (data ?? []).filter((row) => logDetalhesMatchLugar(row.detalhes, lugarId))
    .length;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} lugarId
 * @returns {Promise<number>}
 */
export async function countFavoritosAtivos(supabase, lugarId) {
  const { count, error } = await supabase
    .from("favoritos")
    .select("id", { count: "exact", head: true })
    .eq("lugar_id", lugarId);

  if (error) {
    console.error("[relatorios] favoritos:", error.message);
    return 0;
  }

  return count ?? 0;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} lugarId
 * @param {string} start
 * @param {string} end
 * @returns {Promise<{ count: number, media: number|null }>}
 */
export async function fetchAvaliacoesPeriodo(supabase, lugarId, start, end) {
  const { data, error } = await supabase
    .from("avaliacoes")
    .select("id, nota, comentario, created_at, status")
    .eq("lugar_id", lugarId)
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[relatorios] avaliacoes:", error.message);
    return { count: 0, media: null, lista: [] };
  }

  const aprovadas = (data ?? []).filter((row) =>
    AVALIACAO_STATUS_APROVADOS.includes(row.status)
  );

  const notas = aprovadas.map((row) => Number(row.nota)).filter(Number.isFinite);
  const media =
    notas.length > 0
      ? Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10
      : null;

  return {
    count: aprovadas.length,
    media,
    lista: aprovadas,
  };
}

/**
 * @typedef {Object} RelatorioMetrica
 * @property {number} value
 * @property {{ text: string, className: string, direction: string }} variation
 * @property {string} [hint]
 */

/**
 * @typedef {Object} RelatorioEstabelecimento
 * @property {string} lugarId
 * @property {string} lugarNome
 * @property {string} periodoLabel
 * @property {RelatorioMetrica} visualizacoes
 * @property {RelatorioMetrica} qrScans
 * @property {RelatorioMetrica} irAgora
 * @property {RelatorioMetrica} favoritos
 * @property {RelatorioMetrica} avaliacoes
 * @property {number|null} avaliacoesMedia
 * @property {Array<{ nota: number, comentario: string, created_at: string }>} avaliacoesLista
 */

/**
 * @param {number} current
 * @param {number} previous
 * @param {string} periodoAnteriorLabel
 * @returns {{ text: string, className: string, direction: string }}
 */
export function buildMetricVariation(current, previous, periodoAnteriorLabel) {
  const variation = calcVariation(current, previous, periodoAnteriorLabel);
  return variation;
}

/**
 * Monta relatório completo para um estabelecimento.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} lugarId
 * @param {string} lugarNome
 * @param {PeriodoRelatorioId} periodId
 * @returns {Promise<RelatorioEstabelecimento>}
 */
export async function buildRelatorioEstabelecimento(
  supabase,
  lugarId,
  lugarNome,
  periodId
) {
  const { current, previous } = getReportPeriodRanges(periodId);
  const periodoAnteriorLabel = "período anterior";

  const [
    visCurrent,
    visPrevious,
    qrCurrent,
    qrPrevious,
    irCurrent,
    irPrevious,
    favoritosAtivos,
    favLogsCurrent,
    favLogsPrevious,
    avalCurrent,
    avalPrevious,
  ] = await Promise.all([
    countLogsForLugar(supabase, LOG_ACOES_VISUALIZACAO, lugarId, current.start, current.end),
    countLogsForLugar(
      supabase,
      LOG_ACOES_VISUALIZACAO,
      lugarId,
      previous.start,
      previous.end
    ),
    countLogsForLugar(supabase, ["escaneou_qr"], lugarId, current.start, current.end),
    countLogsForLugar(supabase, ["escaneou_qr"], lugarId, previous.start, previous.end),
    countLogsForLugar(supabase, ["ir_agora"], lugarId, current.start, current.end),
    countLogsForLugar(supabase, ["ir_agora"], lugarId, previous.start, previous.end),
    countFavoritosAtivos(supabase, lugarId),
    countLogsForLugar(supabase, ["favoritou"], lugarId, current.start, current.end),
    countLogsForLugar(supabase, ["favoritou"], lugarId, previous.start, previous.end),
    fetchAvaliacoesPeriodo(supabase, lugarId, current.start, current.end),
    fetchAvaliacoesPeriodo(supabase, lugarId, previous.start, previous.end),
  ]);

  return {
    lugarId,
    lugarNome,
    periodoLabel: current.label,
    visualizacoes: {
      value: visCurrent,
      variation: buildMetricVariation(visCurrent, visPrevious, periodoAnteriorLabel),
    },
    qrScans: {
      value: qrCurrent,
      variation: buildMetricVariation(qrCurrent, qrPrevious, periodoAnteriorLabel),
    },
    irAgora: {
      value: irCurrent,
      variation: buildMetricVariation(irCurrent, irPrevious, periodoAnteriorLabel),
    },
    favoritos: {
      value: favoritosAtivos,
      hint: "Total ativo agora",
      variation: buildMetricVariation(
        favLogsCurrent,
        favLogsPrevious,
        periodoAnteriorLabel
      ),
    },
    avaliacoes: {
      value: avalCurrent.count,
      variation: buildMetricVariation(
        avalCurrent.count,
        avalPrevious.count,
        periodoAnteriorLabel
      ),
    },
    avaliacoesMedia: avalCurrent.media,
    avaliacoesLista: avalCurrent.lista,
  };
}

/**
 * @param {number} nota
 * @returns {string}
 */
export function notaParaEstrelas(nota) {
  const n = Math.max(0, Math.min(5, Math.round(Number(nota) || 0)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

/**
 * @param {string} [texto]
 * @param {number} [max=120]
 * @returns {string}
 */
export function resumirComentario(texto, max = 120) {
  const t = String(texto || "").trim();
  if (!t) return "(sem comentário)";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/**
 * @param {RelatorioEstabelecimento} relatorio
 * @returns {string}
 */
export function formatRelatorioWhatsApp(relatorio) {
  const lines = [
    "📊 Relatório Guia de Bolso",
    `📍 ${relatorio.lugarNome} — ${relatorio.periodoLabel}`,
    "",
    `👁 Visualizações: ${relatorio.visualizacoes.value} (${relatorio.visualizacoes.variation.text})`,
    `📱 Escaneamentos QR: ${relatorio.qrScans.value} (${relatorio.qrScans.variation.text})`,
    `🗺️ IR AGORA: ${relatorio.irAgora.value} (${relatorio.irAgora.variation.text})`,
    `❤️ Favoritos: ${relatorio.favoritos.value}`,
  ];

  const mediaTexto =
    relatorio.avaliacoesMedia != null
      ? ` (média ${relatorio.avaliacoesMedia})`
      : "";

  lines.push(`⭐ Avaliações: ${relatorio.avaliacoes.value}${mediaTexto}`);

  if (relatorio.avaliacoesLista.length > 0) {
    lines.push("", "Últimas avaliações:");
    for (const av of relatorio.avaliacoesLista.slice(0, 8)) {
      const data = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        timeZone: "America/Sao_Paulo",
      }).format(new Date(av.created_at));
      lines.push(
        `- '${resumirComentario(av.comentario, 80)}' - ${notaParaEstrelas(av.nota)} (${data})`
      );
    }
  }

  lines.push("", "Guia de Bolso — App oficial de turismo de Imbituba 🌿");

  return lines.join("\n");
}
