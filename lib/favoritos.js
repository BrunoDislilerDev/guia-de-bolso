import { registrarLog } from "@/lib/logs";

/**
 * Carrega ids de lugares favoritos do usuário.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<string[]>}
 */
export async function fetchFavoritoIds(supabase, userId) {
  const { data, error } = await supabase
    .from("favoritos")
    .select("lugar_id")
    .eq("user_id", userId);

  if (error) {
    console.error("[favoritos] fetch:", error);
    return [];
  }

  return (data ?? []).map((f) => String(f.lugar_id));
}

/**
 * Alterna favorito de um lugar (otimista) e registra log.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {import('@supabase/supabase-js').User} user
 * @param {object} lugar - Precisa `id` e `nome`.
 * @param {string[]} favoritoIds - Estado atual.
 * @param {(ids: string[]) => void} setFavoritoIds
 * @returns {Promise<void>}
 */
export async function toggleFavoritoLugar(supabase, user, lugar, favoritoIds, setFavoritoIds) {
  const lugarId = String(lugar.id);
  const jaFavorito = favoritoIds.includes(lugarId);

  if (jaFavorito) {
    setFavoritoIds(favoritoIds.filter((id) => id !== lugarId));
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id);

    if (error) {
      setFavoritoIds([...favoritoIds.filter((id) => id !== lugarId), lugarId]);
      return;
    }

    await registrarLog(supabase, user, "desfavoritou", {
      lugar_id: lugar.id,
      lugar_nome: lugar.nome,
    });
    return;
  }

  setFavoritoIds([...favoritoIds, lugarId]);
  const { error } = await supabase
    .from("favoritos")
    .insert({ user_id: user.id, lugar_id: lugar.id });

  if (error) {
    setFavoritoIds(favoritoIds.filter((id) => id !== lugarId));
    return;
  }

  await registrarLog(supabase, user, "favoritou", {
    lugar_id: lugar.id,
    lugar_nome: lugar.nome,
  });
}

/**
 * Alterna favorito com estado booleano (detalhe do lugar).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {import('@supabase/supabase-js').User} user
 * @param {object} lugar - Precisa `id` e `nome`.
 * @param {boolean} isFavorito - Estado atual.
 * @param {(value: boolean) => void} setIsFavorito
 * @returns {Promise<void>}
 */
export async function toggleFavoritoLugarBoolean(
  supabase,
  user,
  lugar,
  isFavorito,
  setIsFavorito
) {
  const proximoEstado = !isFavorito;
  setIsFavorito(proximoEstado);

  if (isFavorito) {
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id);

    if (error) {
      setIsFavorito(true);
      return;
    }

    await registrarLog(supabase, user, "desfavoritou", {
      lugar_id: lugar.id,
      lugar_nome: lugar.nome,
    });
    return;
  }

  const { error } = await supabase
    .from("favoritos")
    .insert({ user_id: user.id, lugar_id: lugar.id });

  if (error) {
    setIsFavorito(false);
    return;
  }

  await registrarLog(supabase, user, "favoritou", {
    lugar_id: lugar.id,
    lugar_nome: lugar.nome,
  });
}
