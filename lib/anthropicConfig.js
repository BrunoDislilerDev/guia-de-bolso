/** Modelo padrão Claude para rotas de IA do servidor. */
export const CLAUDE_MODEL = "claude-sonnet-4-5";

/**
 * Modelo efetivo (env override em deploy).
 * @returns {string}
 */
export function getClaudeModel() {
  return process.env.ANTHROPIC_MODEL ?? CLAUDE_MODEL;
}
