const MAPA_INTERESSE_CATEGORIA = {
  praias: ["natureza", "praia"],
  trilhas: ["natureza", "trilha", "aventura"],
  gastronomia: ["gastronomia"],
  "vida noturna": ["noite"],
  cultura: ["cultura"],
  compras: ["compras"],
  aventura: ["aventura", "natureza"],
  "bem-estar": ["bem-estar", "bem estar"],
};

function normalizar(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pontuarLugar(lugar, interesses) {
  let score = 0;
  const cat = normalizar(lugar.categoria);
  const sub = normalizar(lugar.subcategoria);
  const nome = normalizar(lugar.nome);
  const tags = (lugar.tags ?? []).map(normalizar);
  const desc = normalizar(lugar.descricao);

  for (const interesse of interesses) {
    const chave = normalizar(interesse);
    const palavrasMapa = MAPA_INTERESSE_CATEGORIA[chave] ?? [chave];

    for (const palavra of palavrasMapa) {
      if (
        cat.includes(palavra) ||
        sub.includes(palavra) ||
        nome.includes(palavra) ||
        tags.some((tag) => tag.includes(palavra)) ||
        desc.includes(palavra)
      ) {
        score += 3;
      }
    }
  }

  if (lugar.destaque) score += 1;
  return score;
}

/**
 * Reduz lugares enviados à Claude (menos tokens = resposta mais rápida).
 */
export function selecionarLugaresParaRoteiro(lugaresRaw, interesses, limite = 24) {
  const interessesLista = Array.isArray(interesses) ? interesses : [interesses];

  const lugares = (lugaresRaw ?? []).map((lugar) => ({
    id: lugar.id,
    nome: lugar.nome,
    categoria: lugar.categoria,
    subcategoria: lugar.subcategoria,
    descricao:
      typeof lugar.descricao === "string"
        ? lugar.descricao.slice(0, 100)
        : "",
    tags: (lugar.lugares_tags ?? [])
      .map((item) => item.tags?.nome)
      .filter(Boolean)
      .slice(0, 4),
    destaque: Boolean(lugar.destaque),
  }));

  const comScore = lugares.map((lugar) => ({
    ...lugar,
    score: pontuarLugar(lugar, interessesLista),
  }));

  comScore.sort((a, b) => b.score - a.score);

  const relevantes = comScore.filter((l) => l.score > 0).slice(0, limite);
  if (relevantes.length >= 8) {
    return relevantes.map(({ score: _score, destaque: _destaque, ...rest }) => rest);
  }

  return comScore.slice(0, limite).map(({ score: _score, destaque: _destaque, ...rest }) => rest);
}
