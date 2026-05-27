import {
  CATEGORIAS_EXPLORE,
  getCategoriasEmDestaque,
  sortCategoriasPorContagem,
} from "@/lib/categorias";
import { getCapaFromLugar } from "@/lib/fotos";
import { normalizeLugaresTaxonomia } from "@/lib/lugarTaxonomia";
import { queryLugaresAtivos } from "@/lib/lugaresQuery";
import { getAnonServerClient } from "@/lib/supabaseAnonServer";

/**
 * Contagens e capas por categoria para a tela Explorar.
 * @returns {Promise<{ counts: Record<string, number>, capas: Record<string, string>, totalLugares: number }|null>}
 */
export async function fetchExplorarPageData() {
  const supabase = getAnonServerClient();
  if (!supabase) return null;

  const { data, error } = await queryLugaresAtivos(supabase, { limit: 100 });
  if (error) {
    console.error("[explorarPageData]", error.message);
    return null;
  }

  const lugares = normalizeLugaresTaxonomia(data ?? []);
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

  const categoriasOrdenadas = sortCategoriasPorContagem(CATEGORIAS_EXPLORE, counts);
  const destaques = getCategoriasEmDestaque(CATEGORIAS_EXPLORE, counts, 3);
  const totalLugares = Object.values(counts).reduce((acc, n) => acc + n, 0);
  const categoriasComLugares = categoriasOrdenadas.filter((c) => (counts[c.nome] || 0) > 0).length;

  return {
    counts,
    capas,
    totalLugares,
    categoriasComLugares,
    destaques: destaques.map((c) => c.nome),
    categorias: categoriasOrdenadas.map((c) => c.nome),
  };
}
