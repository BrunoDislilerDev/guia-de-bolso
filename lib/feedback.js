/** Tipos de feedback aceitos. */
export const FEEDBACK_TIPOS = [
  { id: "sugestao", label: "Sugestão" },
  { id: "duvida", label: "Dúvida" },
  { id: "critica", label: "Crítica" },
  { id: "elogio", label: "Elogio" },
  { id: "erro", label: "Reportar problema" },
  { id: "outro", label: "Outro" },
];

/** Status do fluxo admin. */
export const FEEDBACK_STATUS = {
  NOVO: "novo",
  EM_ANALISE: "em_analise",
  RESPONDIDO: "respondido",
  ARQUIVADO: "arquivado",
};

/** @type {{ id: string, label: string }[]} */
export const FEEDBACK_STATUS_TABS = [
  { id: FEEDBACK_STATUS.NOVO, label: "Novos" },
  { id: FEEDBACK_STATUS.EM_ANALISE, label: "Em análise" },
  { id: FEEDBACK_STATUS.RESPONDIDO, label: "Respondidos" },
  { id: FEEDBACK_STATUS.ARQUIVADO, label: "Arquivados" },
];

const TIPO_SET = new Set(FEEDBACK_TIPOS.map((item) => item.id));
const STATUS_SET = new Set(FEEDBACK_STATUS_TABS.map((item) => item.id));

/**
 * @param {string} [tipo]
 * @returns {boolean}
 */
export function isValidFeedbackTipo(tipo) {
  return TIPO_SET.has(String(tipo ?? "").trim());
}

/**
 * @param {string} [status]
 * @returns {boolean}
 */
export function isValidFeedbackStatus(status) {
  return STATUS_SET.has(String(status ?? "").trim());
}

/**
 * @param {string} tipo
 * @returns {string}
 */
export function getFeedbackTipoLabel(tipo) {
  return FEEDBACK_TIPOS.find((item) => item.id === tipo)?.label ?? tipo;
}

/**
 * @param {string} status
 * @returns {string}
 */
export function getFeedbackStatusLabel(status) {
  return FEEDBACK_STATUS_TABS.find((item) => item.id === status)?.label ?? status;
}

/**
 * @param {string} [email]
 * @returns {boolean}
 */
export function isValidEmailOptional(email) {
  const value = String(email ?? "").trim();
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
