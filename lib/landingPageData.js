import {
  CATEGORIAS_EXPLORE,
  sortCategoriasPorContagem,
} from "@/lib/categorias";
import { getCapaFromLugar, getFotosFromRota } from "@/lib/fotos";
import { resolveRotaDoDia } from "@/lib/rotaDoDia";
import { enrichLugaresFlags, isParceiro } from "@/lib/lugarBadges";
import {
  pickEmAltaCuradoria,
  pickParceirosPorCategoria,
} from "@/lib/homeSelection";
import {
  collectPraiaHeroCapas,
  pickRandomHeroBackdrop,
  pickRandomSubset,
} from "@/lib/landingBeachHero";
import { normalizeLugaresTaxonomia } from "@/lib/lugarTaxonomia";
import { queryLugaresAtivos } from "@/lib/lugaresQuery";
import { getAnonServerClient } from "@/lib/supabaseAnonServer";

const LANDING_LUGAR_SELECT =
  "id, nome, slug, descricao, categoria, subcategoria, imagem_url, fotos, horarios, mostrar_horarios, status, eh_parceiro, conteudo_curadoria, created_at, localizacoes(endereco), lugares_tags(tags(id, nome))";

/**
 * @param {object} lugar
 * @returns {object}
 */
export function serializeLugarForLanding(lugar) {
  const loc = Array.isArray(lugar.localizacoes)
    ? lugar.localizacoes[0]
    : lugar.localizacoes;

  return {
    id: lugar.id,
    nome: lugar.nome,
    descricao: lugar.descricao?.slice(0, 120) ?? "",
    categoria: lugar.categoria,
    subcategoria: lugar.subcategoria ?? null,
    capa: getCapaFromLugar(lugar),
    endereco: loc?.endereco ?? null,
    ehParceiro: Boolean(lugar.eh_parceiro),
    tags: (lugar.lugares_tags ?? [])
      .map((lt) => lt?.tags?.nome)
      .filter(Boolean)
      .slice(0, 3),
    horarios: lugar.horarios ?? null,
    mostrarHorarios: Boolean(lugar.mostrar_horarios),
  };
}

/**
 * @param {object} rota
 * @returns {object|null}
 */
function serializeRotaForLanding(rota) {
  const capa = getFotosFromRota(rota)[0];
  if (!capa && !rota.titulo) return null;
  return {
    id: rota.id,
    titulo: rota.titulo,
    descricao: rota.descricao?.slice(0, 120) ?? "",
    capa: capa || null,
    categoria: rota.categoria ?? null,
    dificuldade: rota.dificuldade ?? null,
    duracaoMinutos: rota.duracao_minutos ?? null,
    distanciaKm: rota.distancia_km ?? null,
  };
}

/**
 * Dados dinâmicos da landing (SSR).
 * @returns {Promise<import('@/lib/landingPageData').LandingPageData|null>}
 */
export async function fetchLandingPageData() {
  const supabase = getAnonServerClient();
  if (!supabase) return getLandingFallbackData();

  const [lugaresRes, rotasRes, countLugaresRes, countParceirosRes, countAvaliacoesRes] =
    await Promise.all([
      queryLugaresAtivos(supabase, { limit: 120, select: LANDING_LUGAR_SELECT }),
      supabase
        .from("rotas")
        .select(
          "id, titulo, descricao, fotos, foto_capa, imagem_capa, categoria, dificuldade, duracao_minutos, distancia_km, ativa"
        )
        .eq("ativa", true)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("lugares")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativo"),
      supabase
        .from("lugares")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativo")
        .eq("eh_parceiro", true),
      supabase
        .from("avaliacoes")
        .select("*", { count: "exact", head: true })
        .eq("status", "aprovada"),
    ]);

  if (lugaresRes.error) {
    console.error("[landingPageData] lugares:", lugaresRes.error.message);
    return getLandingFallbackData();
  }

  const lugares = normalizeLugaresTaxonomia(enrichLugaresFlags(lugaresRes.data ?? []));

  /** @type {Record<string, number>} */
  const counts = {};
  /** @type {Record<string, string>} */
  const capas = {};

  for (const lugar of lugares) {
    const cat = lugar.categoria;
    if (!cat) continue;
    counts[cat] = (counts[cat] || 0) + 1;
    if (!capas[cat]) {
      const capa = getCapaFromLugar(lugar);
      if (capa) capas[cat] = capa;
    }
  }

  const categoriasOrdenadas = sortCategoriasPorContagem(CATEGORIAS_EXPLORE, counts)
    .filter((c) => (counts[c.nome] || 0) > 0)
    .slice(0, 8)
    .map((c) => ({
      nome: c.nome,
      icone: c.icone,
      descricaoCurta: c.descricaoCurta,
      gradient: c.gradient,
      chipClass: c.chipClass,
      count: counts[c.nome] || 0,
      capa: capas[c.nome] || null,
    }));

  const emAlta = pickEmAltaCuradoria(lugares, 8).map(serializeLugarForLanding);
  const parceiros = pickParceirosPorCategoria(lugares).map(serializeLugarForLanding);

  const comImagem = lugares.filter((l) => getCapaFromLugar(l));
  const showcaseRaw =
    emAlta.length >= 4
      ? emAlta.slice(0, 8)
      : comImagem.slice(0, 8).map(serializeLugarForLanding);
  const showcase = showcaseRaw.filter((l) => l.capa);

  const discoverPool = lugares.map(serializeLugarForLanding).filter((l) => l.capa);
  const discoverShowcase = pickRandomSubset(
    discoverPool.length > 0 ? discoverPool : showcase,
    6
  );

  const rotasAtivas = rotasRes.data ?? [];
  const { rota: rotaDoDia } = resolveRotaDoDia(rotasAtivas, { requireCapa: true });
  const rotasOrdenadas = rotaDoDia
    ? [rotaDoDia, ...rotasAtivas.filter((r) => r.id !== rotaDoDia.id)]
    : rotasAtivas;
  const rotas = rotasOrdenadas
    .map(serializeRotaForLanding)
    .filter(Boolean)
    .filter((r) => r.capa)
    .slice(0, 4);

  const totalLugares = countLugaresRes.count ?? lugares.length;
  const parceirosCount = countParceirosRes.count ?? lugares.filter((l) => isParceiro(l)).length;
  const avaliacoesCount = countAvaliacoesRes.count ?? 0;
  const categoriasComLugares = categoriasOrdenadas.length;

  const heroPraiaCapas = collectPraiaHeroCapas(lugares);
  const heroBackdrop = pickRandomHeroBackdrop(heroPraiaCapas);

  return {
    stats: {
      totalLugares,
      categoriasComLugares,
      parceirosCount,
      avaliacoesCount,
      rotasCount: rotasRes.data?.length ?? 0,
    },
    heroBackdrop,
    heroPraiaCapas,
    showcase,
    discoverShowcase,
    parceiros: parceiros.filter((l) => l.capa),
    categorias: categoriasOrdenadas,
    rotas,
    hasLiveData: totalLugares > 0,
  };
}

/**
 * @returns {import('@/lib/landingPageData').LandingPageData}
 */
export function getLandingFallbackData() {
  return {
    stats: {
      totalLugares: 0,
      categoriasComLugares: 0,
      parceirosCount: 0,
      avaliacoesCount: 0,
      rotasCount: 0,
    },
    heroBackdrop: null,
    heroPraiaCapas: [],
    showcase: [],
    discoverShowcase: [],
    parceiros: [],
    categorias: CATEGORIAS_EXPLORE.slice(0, 6).map((c) => ({
      nome: c.nome,
      icone: c.icone,
      descricaoCurta: c.descricaoCurta,
      gradient: c.gradient,
      chipClass: c.chipClass,
      count: 0,
      capa: null,
    })),
    rotas: [],
    hasLiveData: false,
  };
}

/**
 * @typedef {object} LandingLugarCard
 * @property {string} id
 * @property {string} nome
 * @property {string} descricao
 * @property {string} categoria
 * @property {string|null} subcategoria
 * @property {string} capa
 * @property {string|null} endereco
 * @property {boolean} ehParceiro
 * @property {string[]} tags
 */

/**
 * @typedef {object} LandingRotaCard
 * @property {string} id
 * @property {string} titulo
 * @property {string} descricao
 * @property {string|null} capa
 * @property {string|null} categoria
 * @property {string|null} dificuldade
 * @property {number|null} duracaoMinutos
 * @property {number|string|null} distanciaKm
 */

/**
 * @typedef {object} LandingPageData
 * @property {{ totalLugares: number, categoriasComLugares: number, parceirosCount: number, avaliacoesCount: number, rotasCount: number }} stats
 * @property {string|null} heroBackdrop
 * @property {string[]} heroPraiaCapas
 * @property {LandingLugarCard[]} showcase
 * @property {LandingLugarCard[]} discoverShowcase
 * @property {LandingLugarCard[]} parceiros
 * @property {Array<{ nome: string, icone: string, descricaoCurta: string, gradient: string, chipClass: string, count: number, capa: string|null }>} categorias
 * @property {LandingRotaCard[]} rotas
 * @property {boolean} hasLiveData
 */
