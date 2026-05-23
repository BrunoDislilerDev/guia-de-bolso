import { LIMITS, PREMIUM_PRICE_LABEL } from "@/lib/premium";

/**
 * Fotos estáveis para onboarding e login (Unsplash — substituir por assets próprios quando disponível).
 */

/** Hero da página /login — litoral / praia. */
export const LOGIN_HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
  alt: "Praia e mar em Imbituba, Santa Catarina",
};

/** Benefícios exibidos na tela de login (carrossel de valor). */
export const LOGIN_VALUE_PILLS = [
  { emoji: "🌊", label: "Praias e clima ao vivo" },
  { emoji: "🗺️", label: "Rotas curadas com mapa" },
  { emoji: "✨", label: "Busca em português com IA" },
  { emoji: "❤️", label: "Favoritos e avaliações" },
];

/**
 * Slides do onboarding — uma paisagem por tela (praia, lagoa, montanha, cachoeira).
 */
export const ONBOARDING_SLIDES = [
  {
    image: {
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=85",
      alt: "Praia e ondas na costa de Santa Catarina",
    },
    kicker: "Guia oficial · Imbituba",
    title: "O litoral que moradores recomendam",
    subtitle:
      "Praias, restaurantes e experiências selecionadas — sem lista genérica de internet.",
    stat: { value: "25+", label: "lugares ativos no guia" },
    highlights: [
      { emoji: "🏖️", text: "Praias e natureza perto de você" },
      { emoji: "🍽️", text: "Gastronomia e vida local" },
      { emoji: "📍", text: "Distância em tempo real com GPS" },
    ],
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1475924156734-496f6cfc56b5?auto=format&fit=crop&w=1400&q=85",
      alt: "Lagoa e águas calmas ao amanhecer",
    },
    kicker: "Natureza · Lagoa",
    title: "Lagoas, mirantes e cantos escondidos",
    subtitle:
      "Explore por categoria, veja o que está aberto agora e salve favoritos com sua conta.",
    stat: { value: "8", label: "categorias para explorar" },
    highlights: [
      { emoji: "🌿", text: "Natureza, aventura e bem-estar" },
      { emoji: "🟢", text: "Filtro “Abertos agora” na busca" },
      { emoji: "❤️", text: "Favoritos sincronizados na nuvem" },
    ],
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1464822759844-d150ba278995?auto=format&fit=crop&w=1400&q=85",
      alt: "Montanhas e trilhas com vista panorâmica",
    },
    kicker: "Trilhas · Montanha",
    title: "Rotas curadas com mapa e etapas",
    subtitle:
      "Trilhas e caminhos publicados pelo guia, com distância, dicas e navegação no Maps.",
    stat: { value: "1 toque", label: "para abrir no Google ou Waze" },
    highlights: [
      { emoji: "🥾", text: "Rotas passo a passo no app" },
      { emoji: "🗺️", text: "IR AGORA com app de mapas preferido" },
      { emoji: "⭐", text: "Avalie lugares após visitar" },
    ],
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1433086966358-548ef52fe371?auto=format&fit=crop&w=1400&q=85",
      alt: "Cachoeira em meio à mata atlântica",
    },
    kicker: "Inteligência artificial",
    title: "Busque e monte roteiros em português",
    subtitle:
      "Na home, descreva o que quer (“almoço romântico”, “praia aberta agora”). Em Rotas, gere um roteiro de vários dias com lugares reais do guia.",
    stat: {
      value: `${LIMITS.busca}+${LIMITS.roteiro}`,
      label: `grátis/dia · Premium ${PREMIUM_PRICE_LABEL}`,
    },
    highlights: [
      {
        emoji: "💬",
        text: `${LIMITS.busca} buscas IA grátis por dia (renova à meia-noite, horário de Brasília)`,
      },
      {
        emoji: "🧭",
        text: `${LIMITS.roteiro} roteiros personalizados grátis por dia — ideal para planejar o fim de semana`,
      },
      {
        emoji: "✨",
        text: `Premium (${PREMIUM_PRICE_LABEL}): buscas e roteiros ilimitados`,
      },
    ],
  },
];
