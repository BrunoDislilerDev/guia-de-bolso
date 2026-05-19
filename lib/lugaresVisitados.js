const STORAGE_KEY = "lugares_visitados";

export function getLugaresVisitados() {
  if (typeof window === "undefined") return [];

  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(items) ? items.filter((item) => item?.id) : [];
  } catch {
    return [];
  }
}

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
