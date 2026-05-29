import { hojeISO } from "./homeRotation.js";

/** Dias de inatividade (`status = desativado`) até exclusão definitiva. */
export const LUGAR_PURGE_DIAS = 30;

/** Primeiro aviso no sino do admin (dias restantes > 1 e ≤ 7). */
export const LUGAR_PURGE_AVISO_7_DIAS = 7;

/** Segundo aviso (1 dia restante ou exclusão no mesmo dia, antes do cron). */
export const LUGAR_PURGE_AVISO_1_DIA = 1;

const MS_DIA = 24 * 60 * 60 * 1000;

/**
 * @param {string} isoDate YYYY-MM-DD
 * @param {number} dias
 * @returns {string}
 */
export function addDaysISO(isoDate, dias) {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return hojeISO(d);
}

/**
 * @param {string|Date} desativadoEm
 * @param {string} [hoje] YYYY-MM-DD
 * @returns {string}
 */
export function getExclusaoPrevistaISO(desativadoEm, hoje = hojeISO()) {
  const base = toDateISO(desativadoEm);
  if (!base) return "";
  return addDaysISO(base, LUGAR_PURGE_DIAS);
}

/**
 * @param {string|Date} value
 * @returns {string}
 */
function toDateISO(value) {
  if (!value) return "";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return hojeISO(date);
}

/**
 * Dias corridos entre duas datas de calendário (America/Sao_Paulo).
 * @param {string} fromISO
 * @param {string} toISO
 * @returns {number}
 */
export function diffDiasCalendario(fromISO, toISO) {
  const from = new Date(`${fromISO}T12:00:00`);
  const to = new Date(`${toISO}T12:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  return Math.round((to.getTime() - from.getTime()) / MS_DIA);
}

/**
 * @param {string|Date} desativadoEm
 * @param {string} [hoje]
 * @returns {number|null} null se sem data de desativação
 */
export function getDiasRestantesExclusao(desativadoEm, hoje = hojeISO()) {
  const inicio = toDateISO(desativadoEm);
  if (!inicio) return null;

  const exclusao = getExclusaoPrevistaISO(inicio, hoje);
  return diffDiasCalendario(hoje, exclusao);
}

/**
 * @param {string|Date} desativadoEm
 * @param {string} [hoje]
 * @returns {boolean}
 */
export function isElegivelPurgeImediato(desativadoEm, hoje = hojeISO()) {
  const dias = getDiasRestantesExclusao(desativadoEm, hoje);
  return dias !== null && dias <= 0;
}

/**
 * @param {string|Date} desativadoEm
 * @param {string} [hoje]
 * @returns {boolean}
 */
export function deveAlertarExclusao7Dias(desativadoEm, hoje = hojeISO()) {
  const dias = getDiasRestantesExclusao(desativadoEm, hoje);
  return (
    dias !== null &&
    dias <= LUGAR_PURGE_AVISO_7_DIAS &&
    dias > LUGAR_PURGE_AVISO_1_DIA
  );
}

/**
 * @param {string|Date} desativadoEm
 * @param {string} [hoje]
 * @returns {boolean}
 */
export function deveAlertarExclusao1Dia(desativadoEm, hoje = hojeISO()) {
  const dias = getDiasRestantesExclusao(desativadoEm, hoje);
  return dias !== null && dias <= LUGAR_PURGE_AVISO_1_DIA && dias >= 0;
}

/**
 * @param {number|null} diasRestantes
 * @returns {string}
 */
export function formatDiasRestantesExclusao(diasRestantes) {
  if (diasRestantes === null) return "";
  if (diasRestantes <= 0) return "hoje";
  if (diasRestantes === 1) return "amanhã";
  return `em ${diasRestantes} dias`;
}

/**
 * @param {string} nome
 * @param {number|null} diasRestantes
 * @returns {string}
 */
export function mensagemAlertaExclusao7Dias(nome, diasRestantes) {
  const prazo = formatDiasRestantesExclusao(diasRestantes);
  return `Local inativo será excluído definitivamente ${prazo}. Reative em Editar se quiser manter.`;
}

/**
 * @param {string} nome
 * @param {number|null} diasRestantes
 * @returns {string}
 */
export function mensagemAlertaExclusao1Dia(nome, diasRestantes) {
  if (diasRestantes === 0) {
    return `Local inativo será excluído definitivamente hoje pelo sistema. Reative agora para cancelar.`;
  }
  return `Local inativo será excluído definitivamente amanhã. Reative em Editar para cancelar.`;
}
