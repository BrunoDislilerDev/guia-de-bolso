import { getStatusFuncionamento } from "@/lib/horarios";

export const FILTRO_STATUS_BUSCA = {
  TODOS: "todos",
  ABERTOS: "abertos",
  FECHADOS: "fechados",
};

export function lugarEstaAberto(lugar) {
  return getStatusFuncionamento(lugar?.horarios).aberto;
}

export function filtrarLugaresPorStatus(lugares, filtroStatus) {
  if (!filtroStatus || filtroStatus === FILTRO_STATUS_BUSCA.TODOS) {
    return lugares ?? [];
  }

  if (filtroStatus === FILTRO_STATUS_BUSCA.ABERTOS) {
    return (lugares ?? []).filter((lugar) => lugarEstaAberto(lugar));
  }

  if (filtroStatus === FILTRO_STATUS_BUSCA.FECHADOS) {
    return (lugares ?? []).filter((lugar) => !lugarEstaAberto(lugar));
  }

  return lugares ?? [];
}

export function buildLugarBuscaResumo(lugar) {
  const tags = (lugar.lugares_tags ?? [])
    .map((item) => item.tags?.nome)
    .filter(Boolean);

  const status = getStatusFuncionamento(lugar.horarios);

  return {
    id: lugar.id,
    nome: lugar.nome,
    categoria: lugar.categoria,
    subcategoria: lugar.subcategoria,
    abertoAgora: status.aberto,
    statusLabel: status.label,
    statusDetail: status.detail,
    tags,
    descricao: lugar.descricao,
  };
}

export function getFiltroStatusLabel(filtroStatus) {
  if (filtroStatus === FILTRO_STATUS_BUSCA.ABERTOS) return "abertos agora";
  if (filtroStatus === FILTRO_STATUS_BUSCA.FECHADOS) return "fechados agora";
  return "todos os horários";
}
