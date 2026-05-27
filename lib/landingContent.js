import { SITE_CONTACT_EMAIL } from "@/lib/siteContact";

/** IDs de âncora para navegação. */
export const LANDING_SECTION_IDS = {
  funcionalidades: "funcionalidades",
  estabelecimentos: "para-estabelecimentos",
  usuarios: "para-usuarios",
  contato: "contato",
  comoFunciona: "como-funciona",
};

export const LANDING_CONTACT_EMAIL = SITE_CONTACT_EMAIL;

/** @param {string} [subject] */
export function landingContactMailto(subject = "Contato — Guia de Bolso") {
  return `mailto:${LANDING_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const LANDING_NAV_LINKS = [
  { label: "Funcionalidades", href: `#${LANDING_SECTION_IDS.funcionalidades}` },
  { label: "Para Estabelecimentos", href: `#${LANDING_SECTION_IDS.estabelecimentos}` },
  { label: "Para Usuários", href: `#${LANDING_SECTION_IDS.usuarios}` },
  { label: "Contato", href: `#${LANDING_SECTION_IDS.contato}` },
];

/** @type {{ id: string, title: string, description: string }[]} */
export const LANDING_FEATURES = [
  {
    id: "geo",
    title: "Descoberta por geolocalização",
    description: "Veja o que está perto de você, com distância real e sugestões na hora.",
  },
  {
    id: "categorias",
    title: "Filtros por categoria",
    description: "Restaurantes, lojas, turismo, serviços e muito mais — tudo organizado.",
  },
  {
    id: "horario",
    title: "Aberto ou fechado agora",
    description: "Horário de funcionamento em tempo real para não perder tempo.",
  },
  {
    id: "avaliacoes",
    title: "Avaliações verificadas",
    description: "Reviews moderados para você decidir com confiança.",
  },
  {
    id: "login",
    title: "Login rápido",
    description: "Entre com Google ou celular (código SMS) em poucos toques.",
  },
  {
    id: "ux",
    title: "Feito para quem visita e mora aqui",
    description: "Interface clara para turistas e moradores da região Garopaba/Imbituba.",
  },
];

/** @type {string[]} */
export const LANDING_BUSINESS_BENEFITS = [
  "Visibilidade para turistas que chegam na região",
  "Perfil completo com fotos, horários e localização",
  "Receba avaliações e construa reputação online",
  "Cadastro gratuito para começar",
];

/** @type {string[]} */
export const LANDING_USER_BENEFITS = [
  "Encontre praias, trilhas, restaurantes e serviços curados",
  "Busca inteligente e rotas para planejar o dia",
  "Salve favoritos e volte quando quiser",
  "Navegue até o lugar no app de mapas que você prefere",
];

/** @type {{ step: number, title: string, description: string }[]} */
export const LANDING_STEPS_BUSINESS = [
  {
    step: 1,
    title: "Cadastre",
    description: "Entre em contato e envie os dados básicos do seu negócio.",
  },
  {
    step: 2,
    title: "Configure seu perfil",
    description: "Fotos, horários, endereço e links — tudo no seu painel.",
  },
  {
    step: 3,
    title: "Apareça para os clientes",
    description: "Seu estabelecimento entra no mapa do guia para turistas e moradores.",
  },
];

/** @type {{ step: number, title: string, description: string }[]} */
export const LANDING_STEPS_USER = [
  {
    step: 1,
    title: "Abra o guia",
    description: "Acesse pelo celular — sem complicação.",
  },
  {
    step: 2,
    title: "Escolha a categoria",
    description: "Natureza, gastronomia, noite, serviços e mais.",
  },
  {
    step: 3,
    title: "Encontre o lugar perfeito",
    description: "Veja detalhes, avaliações e vá até lá com um toque.",
  },
];
