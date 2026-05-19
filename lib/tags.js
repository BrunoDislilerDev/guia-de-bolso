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
