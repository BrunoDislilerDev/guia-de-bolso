import { getCategoriaRotaMeta } from "@/lib/rotas";

/** Fallback quando `tags.aplica_em_rotas` ainda não existe no banco. */
const TAG_NOMES_PARA_ROTAS = new Set([
  "Familiar",
  "Ideal para iniciantes",
  "Ideal para crianças",
  "Grátis",
  "Vista panorâmica",
  "Instagramável",
  "Pouco movimentado",
  "Trilha curta",
  "Trilha longa",
  "Trilha acessível",
  "Acesso apenas por trilha",
  "Camping permitido",
  "Com guia",
  "Sem guia necessário",
  "Histórico",
  "Reserva necessária",
  "Para experientes",
  "Escondido",
  "Cenário único",
  "Sem infraestrutura",
  "Estrada de terra",
  "Só de carro",
]);

/**
 * Extrai lista de tags de um lugar (join `lugares_tags` → `tags`).
 * @param {{ lugares_tags?: Array<{ tags?: Object }> }} [lugar]
 * @returns {Array<Object>}
 */
export function getTagsFromLugar(lugar) {
  return (lugar?.lugares_tags ?? [])
    .map((item) => item.tags ?? item)
    .filter(Boolean);
}

/**
 * Extrai lista de tags de uma rota (join `rotas_tags` → `tags`).
 * @param {{ rotas_tags?: Array<{ tags?: Object }> }} [rota]
 * @returns {Array<Object>}
 */
export function getTagsFromRota(rota) {
  return (rota?.rotas_tags ?? [])
    .map((item) => item.tags ?? item)
    .filter(Boolean);
}

/**
 * Indica se a tag pode ser usada em rotas curadas.
 * @param {{ nome?: string, aplica_em_rotas?: boolean|null }} tag
 * @returns {boolean}
 */
export function tagAplicaEmRota(tag) {
  if (tag?.aplica_em_rotas === true) return true;
  return TAG_NOMES_PARA_ROTAS.has(tag?.nome ?? "");
}

/**
 * Filtra catálogo de tags para o formulário de rotas.
 * @param {Array<Object>} [tags]
 * @returns {Array<Object>}
 */
export function filterTagsParaRotas(tags) {
  return (tags ?? []).filter(tagAplicaEmRota);
}

/**
 * Carrega tags do Supabase para o admin de rotas.
 * Usa `aplica_em_rotas` quando a coluna existir; senão, allowlist por nome.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<Array<Object>>}
 */
export async function fetchTagsParaRotas(supabase) {
  const withFlag = await supabase
    .from("tags")
    .select("id, nome, icone, categorias, aplica_em_rotas")
    .order("nome");

  if (!withFlag.error) {
    return filterTagsParaRotas(withFlag.data ?? []);
  }

  const basic = await supabase
    .from("tags")
    .select("id, nome, icone, categorias")
    .order("nome");
  if (basic.error) {
    console.error("Erro ao carregar tags para rotas:", basic.error);
    return [];
  }

  return filterTagsParaRotas(basic.data ?? []);
}

/**
 * Retorna IDs de tags como strings.
 * @param {Array<{ id: string|number }>} [tags]
 * @returns {string[]}
 */
export function getTagIds(tags) {
  return (tags ?? []).map((tag) => String(tag.id));
}

/**
 * Verifica se a tag se aplica à categoria informada.
 * @param {{ categorias?: string[]|null }} tag
 * @param {string} categoria
 * @returns {boolean}
 */
export function tagMatchesCategoria(tag, categoria) {
  const categorias = tag?.categorias;
  if (categorias === undefined || categorias === null) return true;
  if (!Array.isArray(categorias) || categorias.length === 0) return false;
  return categorias.includes(categoria);
}

/**
 * Filtra tags compatíveis com uma categoria.
 * @param {Array<Object>} [tags]
 * @param {string} categoria
 * @returns {Array<Object>}
 */
export function filterTagsByCategoria(tags, categoria) {
  return (tags ?? []).filter((tag) => tagMatchesCategoria(tag, categoria));
}

/**
 * Filtra IDs de tags mantendo apenas os válidos para a categoria.
 * @param {string[]} [tagIds]
 * @param {Array<Object>} [tags] - Catálogo completo para resolver metadados.
 * @param {string} categoria
 * @returns {string[]}
 */
export function filterTagIdsByCategoria(tagIds, tags, categoria) {
  return (tagIds ?? []).filter((id) => {
    const tag = (tags ?? []).find((item) => String(item.id) === String(id));
    return tag && tagMatchesCategoria(tag, categoria);
  });
}

/**
 * Verifica se a tag se aplica ao tipo de rota selecionado.
 * Cruza allowlist de rotas com `categorias` da tag e `categoriasTag` do tipo.
 * @param {{ nome?: string, categorias?: string[]|null, aplica_em_rotas?: boolean|null }} tag
 * @param {string} categoriaRota
 * @returns {boolean}
 */
export function tagMatchesCategoriaRota(tag, categoriaRota) {
  if (!tagAplicaEmRota(tag)) return false;

  const allowed = getCategoriaRotaMeta(categoriaRota).categoriasTag ?? [];
  const categorias = tag?.categorias;

  if (!Array.isArray(categorias) || categorias.length === 0) return false;
  return categorias.some((categoria) => allowed.includes(categoria));
}

/**
 * Filtra tags compatíveis com um tipo de rota.
 * @param {Array<Object>} [tags]
 * @param {string} categoriaRota
 * @returns {Array<Object>}
 */
export function filterTagsByCategoriaRota(tags, categoriaRota) {
  return (tags ?? []).filter((tag) => tagMatchesCategoriaRota(tag, categoriaRota));
}

/**
 * Filtra IDs de tags mantendo apenas os válidos para o tipo de rota.
 * @param {string[]} [tagIds]
 * @param {Array<Object>} [tags]
 * @param {string} categoriaRota
 * @returns {string[]}
 */
export function filterTagIdsByCategoriaRota(tagIds, tags, categoriaRota) {
  return (tagIds ?? []).filter((id) => {
    const tag = (tags ?? []).find((item) => String(item.id) === String(id));
    return tag && tagMatchesCategoriaRota(tag, categoriaRota);
  });
}
