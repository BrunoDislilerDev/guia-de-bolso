const STORAGE_KEY = "lugares_visitados";

/**
 * Lê histórico de lugares visitados do `localStorage` (máx. 5, mais recentes primeiro).
 * @returns {Array<{ id: string, nome: string, categoria: string, imagem_url: string }>}
 */
export function getLugaresVisitados() {
  if (typeof window === "undefined") return [];

  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(items) ? items.filter((item) => item?.id) : [];
  } catch {
    return [];
  }
}

/**
 * Persiste lugar no histórico de visitados (move para o topo, limita a 5 itens).
 * @param {Object} lugar - Deve conter `id`, `nome` e `categoria`.
 * @param {string} [imagemUrl] - URL da capa; usa `lugar.imagem_url` se omitida.
 * @returns {void}
 */
export function saveLugarVisitado(lugar, imagemUrl) {
  if (typeof window === "undefined" || !lugar?.id) return;

  const visitados = getLugaresVisitados();
  const novo = {
    id: lugar.id,
    nome: lugar.nome,
    categoria: lugar.categoria,
    imagem_url: imagemUrl || lugar.imagem_url || "",
  };

  const atualizado = [novo, ...visitados.filter((v) => v.id !== lugar.id)].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
}
