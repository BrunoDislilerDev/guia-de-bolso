function userName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    null
  );
}

export async function registrarLog(supabase, user, acao, detalhes = {}) {
  try {
    await supabase.from("logs").insert({
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      user_nome: userName(user),
      acao,
      detalhes,
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
}

export function formatarAcaoLog(log) {
  const detalhes = log.detalhes || {};
  const appLabels = {
    google: "Google Maps",
    apple: "Apple Maps",
    waze: "Waze",
  };

  const labels = {
    login: "Fez login",
    logout: "Fez logout",
    favoritou: `Favoritou ${detalhes.lugar_nome || "um local"}`,
    desfavoritou: `Desfavoritou ${detalhes.lugar_nome || "um local"}`,
    ir_agora: `Clicou IR AGORA no ${
      appLabels[detalhes.app] || detalhes.app || "app de navegação"
    }`,
    acessou_app: "Acessou o app",
    deletou_conta: "Solicitou exclusão da conta",
  };

  return labels[log.acao] || log.acao;
}
