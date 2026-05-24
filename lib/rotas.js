/** @typedef {{ nome: string, icone: string, categoriasTag: string[] }} CategoriaRota */

/** @type {CategoriaRota[]} */
export const CATEGORIAS_ROTA = [
  { nome: "Trilha", icone: "🥾", categoriasTag: ["Natureza", "Aventura"] },
  { nome: "Passeio urbano", icone: "🏙️", categoriasTag: ["Cultura", "Serviços", "Compras", "Bem-estar"] },
  { nome: "Roteiro de praias", icone: "🏖️", categoriasTag: ["Natureza"] },
  { nome: "Cultural / histórico", icone: "🏛️", categoriasTag: ["Cultura"] },
  { nome: "Gastronômico", icone: "🍽️", categoriasTag: ["Gastronomia"] },
  { nome: "Mirantes e panorâmicos", icone: "🌄", categoriasTag: ["Natureza", "Aventura"] },
];

export const CATEGORIA_ROTA_PADRAO = CATEGORIAS_ROTA[0].nome;

export const MAX_TAGS_ROTA = 5;

/**
 * Normaliza texto de categoria para uma opção válida do catálogo.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function normalizeCategoriaRota(value) {
  const texto = String(value || "").trim();
  if (!texto) return CATEGORIA_ROTA_PADRAO;

  const found = CATEGORIAS_ROTA.find(
    (item) => item.nome.toLowerCase() === texto.toLowerCase()
  );
  return found?.nome ?? CATEGORIA_ROTA_PADRAO;
}

/**
 * Metadados visuais da categoria (ícone + label).
 * @param {string|null|undefined} value
 * @returns {CategoriaRota}
 */
export function getCategoriaRotaMeta(value) {
  const nome = normalizeCategoriaRota(value);
  return CATEGORIAS_ROTA.find((item) => item.nome === nome) ?? CATEGORIAS_ROTA[0];
}

/**
 * Label formatado com ícone para chips e cabeçalhos.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function formatCategoriaRotaLabel(value) {
  const meta = getCategoriaRotaMeta(value);
  return `${meta.icone} ${meta.nome}`;
}
