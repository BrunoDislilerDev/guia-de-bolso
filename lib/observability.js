/**
 * Relato de erros (console; conectar Sentry quando NEXT_PUBLIC_SENTRY_DSN estiver ativo).
 * @param {unknown} error
 * @param {Record<string, unknown>} [context]
 */
export function reportError(error, context = {}) {
  const payload = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };
  console.error("[reportError]", payload);
}
