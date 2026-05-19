/**
 * Helpers de copy e conteúdo persuasivo para a tela de detalhe do lugar.
 */

const FRASES_POR_CATEGORIA = {
  Natureza: [
    "Conexão com a natureza e paisagens incríveis 🌿",
    "Perfeito para recarregar as energias ao ar livre 🌊",
    "Ideal para quem busca tranquilidade e vista bonita 🌅",
  ],
  Gastronomia: [
    "Ótimo para saborear a gastronomia local 🍽️",
    "Perfeito para um almoço especial com quem você gosta ✨",
    "Ambiente convidativo para uma refeição memorável 🥂",
  ],
  Noite: [
    "Perfeito para curtir a noite com amigos 🍻",
    "Energia boa e clima ideal para sair hoje 🌙",
    "Ótima pedida para animar a noite na região 🎵",
  ],
  Cultura: [
    "Experiência cultural autêntica da região 🎭",
    "Ideal para descobrir algo diferente hoje 🖼️",
  ],
  Aventura: [
    "Adrenalina e experiências que valem a pena ⚡",
    "Perfeito para quem quer aventura hoje 🏄",
  ],
  "Bem-estar": [
    "Momento de relaxar e cuidar de você 🧘",
    "Ambiente acolhedor para desacelerar ✨",
  ],
  Compras: [
    "Ótima parada para encontrar algo especial 🛍️",
  ],
  Serviços: [
    "Prático e perto — resolve rápido o que precisa 📍",
  ],
  Hospedagem: [
    "Conforto e boa localização para sua estadia 🏨",
  ],
};

const MELHOR_PARA_POR_CATEGORIA = {
  Natureza: ["famílias", "casais", "amigos"],
  Gastronomia: ["casais", "famílias", "amigos"],
  Noite: ["amigos", "casais"],
  Cultura: ["famílias", "casais", "amigos"],
  Aventura: ["amigos", "famílias"],
  "Bem-estar": ["casais", "famílias"],
  Compras: ["famílias", "amigos"],
  Serviços: ["todos"],
  Hospedagem: ["casais", "famílias"],
};

const TAG_KEYWORDS = [
  { match: /românt|date|casal/i, frase: "Ótimo para um date romântico 🌅" },
  { match: /famíl|crianç|kids/i, frase: "Ideal para famílias com crianças 👨‍👩‍👧‍👦" },
  { match: /pet|animal/i, frase: "Ambiente pet friendly 🐶" },
  { match: /música|live|show|dj/i, frase: "Música ao vivo e clima animado 🎵" },
  { match: /vista|pôr|por do sol|sunset/i, frase: "Vista incrível do pôr do sol 🌅" },
  { match: /praia|mar|oceano/i, frase: "Experiência pé na areia 🏖️" },
];

const CATEGORIAS_NAO_ESTABELECIMENTO = new Set(["Natureza"]);

const SUBCATEGORIAS_NATURAIS = [
  "praia",
  "praias",
  "trilha",
  "trilhas",
  "lagoa",
  "lagoas",
  "cachoeira",
  "cachoeiras",
  "mirante",
  "mirantes",
  "parque",
  "parques",
  "duna",
  "dunas",
  "costão",
  "costao",
  "ilha",
  "ilhas",
  "morro",
  "morro",
  "piscina natural",
  "piscinas naturais",
  "nascente",
  "riacho",
  "cânion",
  "canion",
];

/**
 * Normaliza texto para comparação (minúsculas, sem acentos).
 * @param {string} [value]
 * @returns {string}
 */
function normalizarTexto(value) {
  return (value || "").toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

/**
 * Praias, trilhas, mirantes e similares — chips informativos, sem horário comercial.
 * @param {Object} [lugar]
 * @returns {boolean}
 */
export function isLugarPublico(lugar) {
  if (!lugar) return false;

  const categoria = lugar.categoria || "";
  if (CATEGORIAS_NAO_ESTABELECIMENTO.has(categoria)) return true;

  const sub = normalizarTexto(lugar.subcategoria);
  if (SUBCATEGORIAS_NATURAIS.some((termo) => sub.includes(termo))) return true;

  if (categoria === "Aventura" && /trilha|praia|mirante|costao|costão/i.test(sub)) {
    return true;
  }

  return false;
}

/**
 * Indica se o lugar é estabelecimento comercial (oposto de {@link isLugarPublico}).
 * @param {Object} lugar
 * @returns {boolean}
 */
export function isLugarEstabelecimento(lugar) {
  return !isLugarPublico(lugar);
}

/**
 * Gera hash numérico determinístico a partir de uma string (para escolha de frase).
 * @param {unknown} value
 * @returns {number}
 */
function hashString(value) {
  let hash = 0;
  const str = String(value || "");
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Retorna frase persuasiva para o card do lugar (tags ou categoria).
 * @param {Object} lugar
 * @param {Array<{ nome?: string, icone?: string }>} [tags]
 * @returns {string}
 */
export function getFraseConvencimento(lugar, tags = []) {
  for (const tag of tags) {
    const nome = `${tag.nome || ""} ${tag.icone || ""}`;
    for (const { match, frase } of TAG_KEYWORDS) {
      if (match.test(nome)) return frase;
    }
  }

  const pool = FRASES_POR_CATEGORIA[lugar?.categoria] || [
    "Uma experiência que vale a pena viver hoje ✨",
    "Boa pedida para aproveitar a região agora 📍",
  ];

  return pool[hashString(lugar?.id) % pool.length];
}

/**
 * Monta bullets "Por que ir agora" para a tela de detalhe.
 * @param {Object} lugar
 * @param {Array<{ nome: string, icone?: string }>} [tags]
 * @param {import('@/lib/horarios').StatusFuncionamento} [status]
 * @param {number} [mediaAvaliacoes]
 * @param {number} [totalAvaliacoes]
 * @returns {Array<{ text: string, emoji: string }>}
 */
export function getPorQueIrAgora(lugar, tags = [], status, mediaAvaliacoes, totalAvaliacoes) {
  const bullets = [];
  const seen = new Set();

  function add(text, emoji) {
    const key = text.toLowerCase();
    if (seen.has(key) || bullets.length >= 5) return;
    seen.add(key);
    bullets.push({ text, emoji });
  }

  if (status?.aberto && isLugarEstabelecimento(lugar)) {
    add("Aberto agora — bom momento para ir", "🟢");
  }

  if (totalAvaliacoes > 0 && mediaAvaliacoes >= 4) {
    add("Muito bem avaliado pelos visitantes", "⭐");
  } else if (totalAvaliacoes >= 3) {
    add(`${totalAvaliacoes} pessoas já avaliaram este lugar`, "💬");
  }

  for (const tag of tags) {
    add(tag.nome, tag.icone || "✓");
  }

  const categoriaExtras = {
    Noite: ["Música e clima para curtir a noite", "🎵"],
    Natureza: ["Paisagem e ar livre de tirar o fôlego", "🌿"],
    Gastronomia: ["Boa pedida para refeição na região", "🍽️"],
  };

  const extra = categoriaExtras[lugar?.categoria];
  if (extra) add(extra[0], extra[1]);

  if (lugar?.destaque) {
    add("Destaque popular na região", "🔥");
  }

  if (bullets.length < 3) {
    add("Fácil de chegar e vale o deslocamento", "📍");
  }

  return bullets.slice(0, 5);
}

/**
 * Resume avaliações em percentual de recomendação e público-alvo.
 * @param {Array<{ nota: number }>} [avaliacoes]
 * @param {string} categoria
 * @returns {{ percentRecomenda: number, melhorPara: string[], total: number }|null}
 */
export function getResumoAvaliacoes(avaliacoes, categoria) {
  if (!avaliacoes?.length) return null;

  const total = avaliacoes.length;
  const recomendam = avaliacoes.filter((a) => Number(a.nota) >= 4).length;
  const percent = Math.round((recomendam / total) * 100);

  const melhorPara = MELHOR_PARA_POR_CATEGORIA[categoria] || ["amigos", "casais"];

  return {
    percentRecomenda: percent,
    melhorPara: melhorPara.slice(0, 3),
    total,
  };
}

/**
 * Formata status de funcionamento em texto curto para o detalhe.
 * @param {import('@/lib/horarios').StatusFuncionamento} [status]
 * @returns {string}
 */
export function getHorarioResumo(status) {
  if (!status) return "Horário não informado";

  const detail = status.detail || "";

  if (status.aberto) {
    const match = detail.match(/Fecha às\s+(.+)/i);
    if (match) return `Aberto até ${match[1]} hoje`;
    if (detail.includes("24 horas")) return "Aberto 24 horas hoje";
    return "Aberto agora";
  }

  if (detail.startsWith("Abre às")) return detail;
  if (detail.startsWith("Abre ")) return detail;

  return status.label === "Fechado" ? "Fechado agora" : detail;
}

/**
 * Texto do botão CTA "Ir agora" conforme tipo de lugar e status.
 * @param {import('@/lib/horarios').StatusFuncionamento} [status]
 * @param {boolean} [ehEstabelecimento=true]
 * @returns {string}
 */
export function getCtaIrAgoraText(status, ehEstabelecimento = true) {
  if (!ehEstabelecimento) return "Ir para este lugar";
  if (status?.aberto) return "Como chegar agora";
  return "Abrir rota no mapa";
}

/**
 * Estima tempo de deslocamento a partir do texto de distância.
 * @param {string} [distancia]
 * @returns {string|null}
 */
function estimarTempoDeslocamento(distancia) {
  if (!distancia) return null;

  const kmMatch = String(distancia).match(/([\d,.]+)\s*km/i);
  if (kmMatch) {
    const km = parseFloat(kmMatch[1].replace(",", "."));
    if (km < 1) return "~5 min de carro";
    if (km < 3) return `~${Math.round(km * 4)} min de carro`;
    return `~${Math.round(km * 3)} min de carro`;
  }

  const mMatch = String(distancia).match(/([\d,.]+)\s*m\b/i);
  if (mMatch) {
    const metros = parseFloat(mMatch[1].replace(",", "."));
    if (metros < 500) return "~2 min a pé ou de carro";
    return "~5 min de carro";
  }

  return null;
}

/**
 * Gera rótulo de acesso (fácil, trilha, orla, etc.) para lugares públicos.
 * @param {Object} lugar
 * @param {Array<{ nome?: string, icone?: string }>} [tags]
 * @returns {string}
 */
function getAcessoLabel(lugar, tags = []) {
  const textoTags = tags.map((t) => `${t.nome} ${t.icone || ""}`).join(" ");
  const base = `${lugar?.subcategoria || ""} ${textoTags} ${lugar?.descricao || ""}`.toLowerCase();

  if (/acesso f[aá]cil|f[aá]cil acesso|estacionamento/i.test(base)) {
    return "Acesso fácil";
  }
  if (/moderad|intermedi/i.test(base)) return "Acesso moderado";
  if (/dif[ií]cil|exigente|trilha longa/i.test(base)) return "Acesso mais exigente";

  const sub = (lugar?.subcategoria || "").toLowerCase();
  if (/trilha/.test(sub)) return "Trilha — calçado confortável";
  if (/praia/.test(sub)) return "Acesso pela orla";
  if (/cachoeira|lagoa/.test(sub)) return "Caminhada curta até o ponto";
  if (/mirante/.test(sub)) return "Visita rápida ao mirante";

  return "Acesso livre ao local";
}

/**
 * Sugere duração típica da visita para locais naturais/públicos.
 * @param {Object} lugar
 * @returns {string}
 */
function getDuracaoExperienciaLocal(lugar) {
  const sub = (lugar?.subcategoria || "").toLowerCase();
  if (/praia/.test(sub)) return "Reserve 2–4h na praia";
  if (/trilha/.test(sub)) return "Trilha ~1–2h";
  if (/cachoeira|lagoa/.test(sub)) return "Visita ~1–2h";
  if (/mirante/.test(sub)) return "Parada ~30–45min";
  if (lugar?.categoria === "Natureza") return "Experiência ~1–2h";
  if (lugar?.categoria === "Aventura") return "Atividade ~2–3h";
  return "Visita flexível";
}

/**
 * Sugere melhor horário de visita para locais públicos.
 * @param {Object} lugar
 * @param {Array<{ nome?: string }>} [tags]
 * @returns {string}
 */
function getMelhorHorarioVisita(lugar, tags = []) {
  const texto = tags.map((t) => t.nome).join(" ").toLowerCase();
  const sub = (lugar?.subcategoria || "").toLowerCase();

  if (/p[oô]r do sol|sunset/.test(texto) || /mirante/.test(sub)) {
    return "Melhor no fim da tarde";
  }
  if (/praia/.test(sub)) return "Ideal de manhã ou fim de tarde";
  if (/trilha|cachoeira/.test(sub)) return "Melhor pela manhã";
  if (lugar?.categoria === "Natureza") return "Visite com luz do dia";
  return "Aproveite com calma";
}

/**
 * Monta chips de ações rápidas para praias, trilhas e locais públicos.
 * @param {Object} lugar
 * @param {Array<Object>} [tags]
 * @param {string} [distancia] - Texto de distância formatado.
 * @returns {Array<{ id: string, emoji: string, label: string }>}
 */
export function getAcoesRapidasLocais(lugar, tags = [], distancia) {
  const acoes = [];

  const tempo = estimarTempoDeslocamento(distancia);
  if (tempo) acoes.push({ id: "tempo", emoji: "🚗", label: tempo });

  const acesso = getAcessoLabel(lugar, tags);
  if (acesso) acoes.push({ id: "acesso", emoji: "🥾", label: acesso });

  acoes.push({
    id: "duracao",
    emoji: "⏱️",
    label: getDuracaoExperienciaLocal(lugar),
  });

  acoes.push({
    id: "horario",
    emoji: "☀️",
    label: getMelhorHorarioVisita(lugar, tags),
  });

  return acoes;
}

/**
 * Monta ações rápidas (ligar, Instagram, cardápio, site) para estabelecimentos.
 * @param {{ telefone?: string, instagramHref?: string, cardapioUrl?: string, siteUrl?: string }} params
 * @returns {Array<{ id: string, label: string, href: string|null }>}
 */
export function getAcoesRapidasEstabelecimento({
  telefone,
  instagramHref,
  cardapioUrl,
  siteUrl,
}) {
  return [
    {
      id: "ligar",
      label: "Ligar",
      href: telefone ? `tel:${telefone}` : null,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: instagramHref || null,
    },
    {
      id: "cardapio",
      label: "Cardápio",
      href: cardapioUrl || null,
    },
    {
      id: "site",
      label: "Site",
      href: siteUrl || null,
    },
  ];
}

/**
 * Gera URL de mapa estático OpenStreetMap para preview de localização.
 * @param {{ latitude?: number|string, longitude?: number|string }} localizacao
 * @param {number} [width=600]
 * @param {number} [height=200]
 * @returns {string|null}
 */
export function getStaticMapUrl(localizacao, width = 600, height = 200) {
  const lat = Number(localizacao?.latitude);
  const lng = Number(localizacao?.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: "15",
    size: `${width}x${height}`,
    markers: `${lat},${lng},lightblue1`,
  });

  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
}
