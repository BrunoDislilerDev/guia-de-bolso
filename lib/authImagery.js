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
 * Slides do onboarding — copy orientada a valor e desejo de uso.
 */
export const ONBOARDING_SLIDES = [
  {
    image: {
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=85",
      alt: "Ondas e costa de Santa Catarina",
    },
    kicker: "Guia oficial · Imbituba",
    title: "O litoral que moradores recomendam",
    subtitle:
      "Praias, trilhas e restaurantes selecionados — sem lista genérica de internet.",
    stat: { value: "25+", label: "lugares ativos no guia" },
    highlights: [
      { emoji: "🏖️", text: "Praias e natureza" },
      { emoji: "🍽️", text: "Gastronomia local" },
      { emoji: "📍", text: "Distância em tempo real" },
    ],
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1433086966358-548ef52fe371?auto=format&fit=crop&w=1400&q=85",
      alt: "Cachoeira e trilha na região",
    },
    kicker: "Inteligência local",
    title: "Pergunte: o que fazer agora?",
    subtitle:
      "Busca em português natural e rotas com etapas — a IA usa o que está aberto perto de você.",
    stat: { value: "IA", label: "busca e roteiros no app" },
    highlights: [
      { emoji: "💬", text: "Perguntas em português" },
      { emoji: "🧭", text: "Rotas passo a passo" },
      { emoji: "🗺️", text: "Abrir no Maps em 1 toque" },
    ],
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1559339352-11d035aa52de?auto=format&fit=crop&w=1400&q=85",
      alt: "Experiência à beira-mar ao entardecer",
    },
    kicker: "Sua viagem",
    title: "Guarde, volte e compartilhe",
    subtitle:
      "Crie conta para favoritos e avaliações — ou explore agora, sem cadastro.",
    stat: { value: "0", label: "custo para explorar" },
    highlights: [
      { emoji: "❤️", text: "Lista de favoritos" },
      { emoji: "⭐", text: "Avalie e ajude viajantes" },
      { emoji: "🌤️", text: "Clima nas praias" },
    ],
  },
];
