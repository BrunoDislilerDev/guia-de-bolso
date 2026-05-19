export function getTagsFromLugar(lugar) {
  return (lugar?.lugares_tags ?? [])
    .map((item) => item.tags ?? item)
    .filter(Boolean);
}

export function getTagIds(tags) {
  return (tags ?? []).map((tag) => String(tag.id));
}

export function tagMatchesCategoria(tag, categoria) {
  const categorias = tag?.categorias;
  if (categorias === undefined || categorias === null) return true;
  if (!Array.isArray(categorias) || categorias.length === 0) return false;
  return categorias.includes(categoria);
}

export function filterTagsByCategoria(tags, categoria) {
  return (tags ?? []).filter((tag) => tagMatchesCategoria(tag, categoria));
}

export function filterTagIdsByCategoria(tagIds, tags, categoria) {
  return (tagIds ?? []).filter((id) => {
    const tag = (tags ?? []).find((item) => String(item.id) === String(id));
    return tag && tagMatchesCategoria(tag, categoria);
  });
}
