/**
 * Monta contexto técnico para reporte de erro (armazenado em jsonb).
 * @param {object} [params]
 * @param {string} [params.code]
 * @param {string} [params.route]
 * @param {string} [params.message]
 * @param {Record<string, unknown>} [params.extra]
 * @returns {Record<string, unknown>}
 */
export function buildReportContext({ code, route, message, extra } = {}) {
  const context = {
    code: code ?? null,
    route: route ?? (typeof window !== "undefined" ? window.location.pathname : null),
    userMessage: message ?? null,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };

  if (extra && typeof extra === "object") {
    Object.assign(context, extra);
  }

  return context;
}
