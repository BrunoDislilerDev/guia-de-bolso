export function parseFotos(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function getFotosFromLugar(lugar) {
  const fotos = parseFotos(lugar?.fotos);
  if (fotos.length > 0) return fotos;
  if (lugar?.imagem_url) return [lugar.imagem_url];
  return [];
}

export function getCapaFromLugar(lugar) {
  return getFotosFromLugar(lugar)[0] || "";
}

export function getFotosFromRota(rota) {
  const fotos = parseFotos(rota?.fotos);
  if (fotos.length > 0) return fotos;
  const legado = rota?.foto_capa || rota?.imagem_capa || rota?.imagem_url;
  return legado ? [legado] : [];
}

export function getCapaFromRota(rota) {
  return getFotosFromRota(rota)[0] || "";
}

export function getInitialPhotoItems(data, legacyUrlField = "imagem_url") {
  const urls = parseFotos(data?.fotos);
  const legado = data?.[legacyUrlField];
  const all = urls.length > 0 ? urls : legado ? [legado] : [];

  return all.map((url, index) => ({
    id: `existing-${index}-${url}`,
    url,
    existing: true,
  }));
}
