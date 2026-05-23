/**
 * Garante linha em `perfis` após login (OAuth, SMS, etc.).
 * @module lib/ensurePerfil
 */

/**
 * Nome de exibição a partir do usuário Supabase Auth.
 * @param {import('@supabase/supabase-js').User} user
 * @returns {string}
 */
export function getPerfilDisplayName(user) {
  return (
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Usuário"
  );
}

/**
 * Upsert do perfil do usuário logado (client ou server Supabase).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {import('@supabase/supabase-js').User} user
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function ensurePerfil(supabase, user) {
  if (!user?.id) return { ok: false, error: "Usuário inválido" };

  const payload = {
    id: user.id,
    nome: getPerfilDisplayName(user),
    email: user.email ?? null,
    foto_url:
      user.user_metadata?.avatar_url ??
      user.user_metadata?.picture ??
      null,
  };

  const { error } = await supabase.from("perfis").upsert(payload, {
    onConflict: "id",
    ignoreDuplicates: false,
  });

  if (error) {
    const missingEmail =
      error.code === "42703" || error.message?.includes("email");

    if (missingEmail) {
      const { nome, foto_url, id } = payload;
      const { error: retryError } = await supabase.from("perfis").upsert(
        { id, nome, foto_url },
        { onConflict: "id" }
      );
      if (retryError) {
        console.error("[ensurePerfil]", retryError.message);
        return { ok: false, error: retryError.message };
      }
      return { ok: true };
    }

    console.error("[ensurePerfil]", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
