import { getLugarPublicPath } from "@/lib/lugarPublicPath";
import { queryLugaresAtivos } from "@/lib/lugaresQuery";
import { createClient } from "@/lib/supabase/server";

/**
 * @typedef {{ id: string, nome: string, href: string, categoria?: string, descricao?: string }} GuiaPlaceCard
 */

/**
 * Lugares ativos de uma categoria para listagem em guias SEO.
 * @param {string} categoria
 * @param {number} [limit=10]
 * @returns {Promise<GuiaPlaceCard[]>}
 */
export async function fetchGuiaPlacesByCategoria(categoria, limit = 10) {
  if (!categoria) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await queryLugaresAtivos(supabase, {
      eq: { categoria },
      limit,
      select: "id, nome, slug, descricao, categoria",
    });

    if (error) {
      console.warn("[guia] lugares:", error.message);
      return [];
    }

    return (data ?? []).map((lugar) => ({
      id: lugar.id,
      nome: lugar.nome,
      href: getLugarPublicPath(lugar),
      categoria: lugar.categoria,
      descricao: lugar.descricao,
    }));
  } catch (err) {
    console.warn("[guia] fetch:", err instanceof Error ? err.message : err);
    return [];
  }
}
