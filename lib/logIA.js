import { createClient } from "@/lib/supabase/server";

// Preços Claude Sonnet 4.5 por token
const PRECO_INPUT = 3 / 1_000_000; // $3 por milhão
const PRECO_OUTPUT = 15 / 1_000_000; // $15 por milhão
const PRECO_CACHE_CREATE = 3.75 / 1_000_000; // $3.75 por milhão
const PRECO_CACHE_READ = 0.3 / 1_000_000; // $0.30 por milhão (90% desconto)

/**
 * @param {object} usage
 * @returns {number}
 */
export function calcularCusto(usage = {}) {
  const input = (usage.input_tokens || 0) * PRECO_INPUT;
  const output = (usage.output_tokens || 0) * PRECO_OUTPUT;
  const cacheCreate = (usage.cache_creation_input_tokens || 0) * PRECO_CACHE_CREATE;
  const cacheRead = (usage.cache_read_input_tokens || 0) * PRECO_CACHE_READ;
  return input + output + cacheCreate + cacheRead;
}

/**
 * @param {object} params
 * @param {string} params.feature
 * @param {string|null|undefined} params.userId
 * @param {object} [params.usage]
 * @param {number} [params.latencia]
 * @param {boolean} params.sucesso
 * @param {string|null} [params.erro]
 * @returns {Promise<void>}
 */
export async function logIA({ feature, userId, usage = {}, latencia = 0, sucesso, erro }) {
  try {
    const supabase = await createClient();
    const custo = sucesso ? calcularCusto(usage) : 0;

    await supabase.from("logs_ia").insert({
      feature,
      user_id: userId || null,
      input_tokens: usage?.input_tokens || 0,
      output_tokens: usage?.output_tokens || 0,
      cache_creation_tokens: usage?.cache_creation_input_tokens || 0,
      cache_read_tokens: usage?.cache_read_input_tokens || 0,
      custo_usd: custo,
      latencia_ms: latencia,
      sucesso,
      erro: erro || null,
    });
  } catch (e) {
    console.error("Erro ao salvar log de IA:", e);
  }
}
