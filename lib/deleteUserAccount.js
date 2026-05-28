/**
 * Exclusão completa de conta (dados do app + auth.users).
 * Requer cliente Supabase com service role — apenas server-side.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} admin
 * @param {string} userId
 * @returns {Promise<{ ok: true }>}
 */
export async function deleteUserAccount(admin, userId) {
  if (!admin || !userId) {
    throw new Error("Parâmetros inválidos para exclusão de conta.");
  }

  const tablesWithUserId = ["roteiros", "favoritos", "avaliacoes", "rotas_favoritas"];

  for (const table of tablesWithUserId) {
    const { error } = await admin.from(table).delete().eq("user_id", userId);
    if (error) {
      throw new Error(`Falha ao remover ${table}: ${error.message}`);
    }
  }

  const { error: feedbackError } = await admin.from("feedback").delete().eq("user_id", userId);
  if (feedbackError) {
    throw new Error(`Falha ao remover feedback: ${feedbackError.message}`);
  }

  const { error: perfilError } = await admin.from("perfis").delete().eq("id", userId);
  if (perfilError) {
    throw new Error(`Falha ao remover perfil: ${perfilError.message}`);
  }

  const avatarPrefix = `avatars/${userId}`;
  const { data: avatarFiles, error: listError } = await admin.storage
    .from("imagens")
    .list(`avatars/${userId}`);

  if (listError && !listError.message?.includes("not found")) {
    console.warn("[deleteUserAccount] list avatar:", listError.message);
  } else if (avatarFiles?.length) {
    const paths = avatarFiles.map((file) => `${avatarPrefix}/${file.name}`);
    const { error: removeError } = await admin.storage.from("imagens").remove(paths);
    if (removeError) {
      console.warn("[deleteUserAccount] remove avatar:", removeError.message);
    }
  }

  const { error: authError } = await admin.auth.admin.deleteUser(userId);
  if (authError) {
    throw new Error(`Falha ao excluir autenticação: ${authError.message}`);
  }

  return { ok: true };
}
