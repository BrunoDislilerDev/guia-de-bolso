/**
 * Aspectos selecionáveis no formulário de avaliação, por categoria/subcategoria do lugar.
 */

const ASPECTOS_PRAIAS = [
  "Água limpa",
  "Estrutura",
  "Acessível",
  "Movimento tranquilo",
  "Salva-vidas",
  "Estacionamento",
  "Pôr do sol",
  "Boa para crianças",
];

const ASPECTOS_GASTRONOMIA = [
  "Comida",
  "Atendimento",
  "Ambiente",
  "Preço justo",
  "Boa para família",
  "Tempo de espera",
  "Cardápio variado",
  "Higiene",
];

const ASPECTOS_HOSPEDAGEM = [
  "Limpeza",
  "Conforto",
  "Localização",
  "Atendimento",
  "Café da manhã",
  "Wi-Fi",
  "Custo-benefício",
  "Silencioso",
];

const ASPECTOS_TRILHAS_AVENTURA = [
  "Sinalização",
  "Dificuldade real",
  "Paisagem",
  "Segurança",
  "Limpeza",
  "Guia necessário",
  "Vale a pena",
  "Acessível",
];

const ASPECTOS_PADRAO = [
  "Atendimento",
  "Localização",
  "Custo-benefício",
  "Recomendo",
  "Voltaria",
  "Limpeza",
  "Ambiente",
  "Acessível",
];

/** @type {Record<string, string>} */
const CATEGORIA_CHIP = {
  Natureza: "bg-[#d4ede8] text-[#1a4a3a]",
  Gastronomia: "bg-[#f0e4d4] text-[#6b5344]",
  Noite: "bg-[#e4d4f0] text-[#5c4a6e]",
  Serviços: "bg-[#c5dff5] text-[#2a5a7a]",
  Hospedagem: "bg-[#f5e6b8] text-[#7a6520]",
  Cultura: "bg-purple-100 text-purple-700",
  Aventura: "bg-orange-100 text-orange-700",
  "Bem-estar": "bg-pink-100 text-pink-700",
  Compras: "bg-blue-100 text-blue-700",
};

export const MAX_COMENTARIO_AVALIACAO = 300;

/**
 * @param {string} [categoria]
 * @returns {string}
 */
export function getCategoriaChipClass(categoria) {
  return CATEGORIA_CHIP[categoria] || "bg-gray-100 text-gray-700";
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isPraia(value) {
  const text = String(value || "").toLowerCase();
  return text.includes("praia");
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isTrilhaOuAventura(value) {
  const text = String(value || "").toLowerCase();
  return (
    text.includes("trilha") ||
    text.includes("cachoeira") ||
    text.includes("mirante") ||
    text === "aventura"
  );
}

/**
 * Lista de aspectos para o formulário conforme categoria e subcategoria do lugar.
 * @param {{ categoria?: string, subcategoria?: string }} lugar
 * @returns {string[]}
 */
export function getAspectosParaLugar(lugar) {
  const categoria = lugar?.categoria || "";
  const subcategoria = lugar?.subcategoria || "";

  if (categoria === "Gastronomia") return ASPECTOS_GASTRONOMIA;
  if (categoria === "Hospedagem") return ASPECTOS_HOSPEDAGEM;

  if (categoria === "Natureza") {
    if (isPraia(subcategoria)) return ASPECTOS_PRAIAS;
    if (isTrilhaOuAventura(subcategoria)) return ASPECTOS_TRILHAS_AVENTURA;
    return ASPECTOS_TRILHAS_AVENTURA;
  }

  if (categoria === "Aventura") return ASPECTOS_TRILHAS_AVENTURA;

  return ASPECTOS_PADRAO;
}
