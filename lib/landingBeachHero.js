import { getCapaFromLugar } from "./fotos.js";

/**
 * Indica se o lugar é praia / costa (hero cinematográfico).
 * @param {object} lugar
 * @returns {boolean}
 */
export function isPraiaLugar(lugar) {
  const sub = String(lugar.subcategoria ?? "").toLowerCase();
  const nome = String(lugar.nome ?? "").toLowerCase();
  const desc = String(lugar.descricao ?? "").toLowerCase();
  const tags = (lugar.lugares_tags ?? [])
    .map((lt) => String(lt?.tags?.nome ?? "").toLowerCase())
    .join(" ");

  if (sub.includes("praia") || sub.includes("costa")) return true;
  if (nome.includes("praia") || nome.includes("rosa")) return true;
  if (desc.includes("praia") && lugar.categoria === "Natureza") return true;
  if (tags.includes("praia") || tags.includes("costa")) return true;

  return false;
}

/**
 * Pool de capas de praias para o hero (com fallback Natureza).
 * @param {object[]} lugares
 * @returns {string[]}
 */
export function collectPraiaHeroCapas(lugares) {
  const praias = [];
  const natureza = [];

  for (const lugar of lugares) {
    const capa = getCapaFromLugar(lugar);
    if (!capa) continue;
    if (isPraiaLugar(lugar)) praias.push(capa);
    else if (lugar.categoria === "Natureza") natureza.push(capa);
  }

  const unique = (arr) => [...new Set(arr)];
  const pool = unique(praias);
  if (pool.length > 0) return pool;
  return unique(natureza);
}

/**
 * Escolhe uma capa aleatória a cada request SSR.
 * @param {string[]} pool
 * @returns {string|null}
 */
export function pickRandomHeroBackdrop(pool) {
  if (!pool?.length) return null;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? null;
}

/**
 * Embaralha e retorna N itens (nova ordem a cada request SSR).
 * @template T
 * @param {T[]} items
 * @param {number} count
 * @returns {T[]}
 */
export function pickRandomSubset(items, count) {
  if (!items?.length || count <= 0) return [];
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}
