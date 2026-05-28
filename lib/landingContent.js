import { SITE_CONTACT_EMAIL } from "@/lib/siteContact";

export const LANDING_SECTION_IDS = {
  categorias: "categorias",
  comoFunciona: "como-funciona",
  turistas: "turistas",
  negocios: "negocios",
  app: "app",
  parceiros: "parceiros",
  depoimentos: "depoimentos",
  contato: "contato",
};

/** @deprecated Use LANDING_SECTION_IDS.categorias */
export const LANDING_SECTION_IDS_LEGACY = {
  descobrir: LANDING_SECTION_IDS.categorias,
  funcionalidades: LANDING_SECTION_IDS.turistas,
  estabelecimentos: LANDING_SECTION_IDS.negocios,
  usuarios: LANDING_SECTION_IDS.categorias,
  contato: LANDING_SECTION_IDS.contato,
  comoFunciona: LANDING_SECTION_IDS.comoFunciona,
};

export const LANDING_CONTACT_EMAIL = SITE_CONTACT_EMAIL;

/** @param {string} [subject] */
export function landingContactMailto(subject = "Contato — Guia de Bolso") {
  return `mailto:${LANDING_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const LANDING_NAV_LINKS = [
  { label: "Categorias", href: `#${LANDING_SECTION_IDS.categorias}` },
  { label: "Como funciona", href: `#${LANDING_SECTION_IDS.comoFunciona}` },
  { label: "Negócios", href: `#${LANDING_SECTION_IDS.negocios}` },
  { label: "Contato", href: `#${LANDING_SECTION_IDS.contato}` },
];

/** @type {{ title: string; body: string }[]} */
export const LANDING_TOURIST_BENEFITS = [
  {
    title: "Curadoria local real",
    body: "Lugares verificados em Imbituba — sem listas genéricas.",
  },
  {
    title: "Decida na hora",
    body: "Horário ao vivo, distância e detalhes para não perder tempo.",
  },
  {
    title: "Planeje o dia",
    body: "Rotas, categorias e favoritos quando o app estiver nas lojas.",
  },
  {
    title: "Confie nas avaliações",
    body: "Reviews moderados por quem conhece a cidade.",
  },
];

/** @type {{ title: string; body: string }[]} */
export const LANDING_BUSINESS_BENEFITS = [
  {
    title: "Visibilidade na chegada",
    body: "Turistas encontram você quando exploram Imbituba.",
  },
  {
    title: "Perfil completo",
    body: "Fotos, horários, mapa e links — tudo em um só lugar.",
  },
  {
    title: "Reputação que cresce",
    body: "Avaliações aprovadas constroem confiança orgânica.",
  },
  {
    title: "Comece sem custo",
    body: "Cadastro gratuito para entrar no guia oficial da cidade.",
  },
];

/** @type {{ step: string; title: string; body: string }[]} */
export const LANDING_STEPS = [
  {
    step: "01",
    title: "Abra o guia",
    body: "Interface clara, feita para o celular.",
  },
  {
    step: "02",
    title: "Escolha a categoria",
    body: "Natureza, gastronomia, noite — tudo organizado.",
  },
  {
    step: "03",
    title: "Vá com confiança",
    body: "Detalhes, mapa e horário antes de sair.",
  },
];

/** @type {{ quote: string; name: string; role: string }[]} */
export const LANDING_TESTIMONIALS = [
  {
    quote:
      "Finalmente um guia que parece feito por quem mora aqui — não por algoritmo genérico.",
    name: "Marina L.",
    role: "Turista · Praia do Rosa",
  },
  {
    quote:
      "Nosso restaurante passou a aparecer para quem chega na cidade sem conhecer nada.",
    name: "Ricardo M.",
    role: "Gastronomia · Imbituba",
  },
  {
    quote: "Visual limpo, informação certa. É o que faltava em Imbituba.",
    name: "Ana P.",
    role: "Moradora · Imbituba",
  },
];

export const LANDING_FEATURES = LANDING_TOURIST_BENEFITS.map((b, i) => ({
  id: String(i),
  title: b.title,
  description: b.body,
}));

export const LANDING_STEPS_USER = LANDING_STEPS.map((s, i) => ({
  step: i + 1,
  title: s.title,
  description: s.body,
}));

export const LANDING_STEPS_BUSINESS = [
  { step: 1, title: "Contato", description: "Envie os dados do seu negócio." },
  { step: 2, title: "Perfil", description: "Fotos, horário e localização." },
  { step: 3, title: "Publicação", description: "Você entra no mapa do guia." },
];
