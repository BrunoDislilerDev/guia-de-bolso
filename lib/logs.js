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

export function getLogAcaoBadge(acao) {
  const badges = {
    acessou_app: { label: "Acesso ao app", className: "bg-blue-100 text-blue-700" },
    favoritou: { label: "Favorito", className: "bg-purple-100 text-purple-700" },
    desfavoritou: { label: "Favorito", className: "bg-purple-100 text-purple-700" },
    ir_agora: { label: "IR AGORA", className: "bg-emerald-100 text-emerald-700" },
    login: { label: "Login", className: "bg-gray-100 text-gray-600" },
    logout: { label: "Logout", className: "bg-gray-100 text-gray-600" },
  };

  return (
    badges[acao] || {
      label: acao || "Ação",
      className: "bg-gray-100 text-gray-600",
    }
  );
}

export function formatarDetalhesLog(detalhes = {}) {
  const appLabels = {
    google_maps: "Google Maps",
    google: "Google Maps",
    apple: "Apple Maps",
    waze: "Waze",
  };

  const metodoLabels = {
    google: "Google",
    apple: "Apple",
    waze: "Waze",
  };

  if (detalhes.pagina) return `Página: ${detalhes.pagina}`;
  if (detalhes.app) return appLabels[detalhes.app] || String(detalhes.app);
  if (detalhes.metodo) return metodoLabels[detalhes.metodo] || String(detalhes.metodo);
  if (detalhes.lugar_id) return `Local #${detalhes.lugar_id}`;
  if (detalhes.lugar_nome) return detalhes.lugar_nome;

  const entries = Object.entries(detalhes).filter(([, value]) => value !== null && value !== "");
  if (entries.length === 0) return "—";

  return entries.map(([key, value]) => `${key}: ${value}`).join(" · ");
}
