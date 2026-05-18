export function getTagsFromLugar(lugar) {
  return (lugar?.lugares_tags ?? [])
    .map((item) => item.tags ?? item)
    .filter(Boolean);
}

export function getTagIds(tags) {
  return (tags ?? []).map((tag) => String(tag.id));
}
