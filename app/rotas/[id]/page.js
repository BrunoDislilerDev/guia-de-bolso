import { notFound } from "next/navigation";
import RotaDetalhePremium from "@/components/rotas/RotaDetalhePremium";
import { getFotosFromRota } from "@/lib/fotos";
import { getGoogleMapsDirectionsUrlForRota } from "@/lib/rotaMaps";
import {
  formatRotaDistancia,
  formatRotaDuracao,
  getRotaMapsSubtitulo,
  getRotaNome,
} from "@/lib/rotaDetalheDisplay";
import { getCategoriaRotaMeta } from "@/lib/rotas";
import { getTagsFromRota } from "@/lib/tags";
import { createClient } from "@/lib/supabase/server";

/**
 * Página de detalhe da rota/trilha.
 * @param {{ params: Promise<{ id: string }> }} props
 * @returns {Promise<import("react").ReactElement>}
 */
export default async function RotaDetalhePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rota } = await supabase
    .from("rotas")
    .select("*, rotas_tags(tags(*))")
    .eq("id", id)
    .maybeSingle();

  if (!rota) notFound();

  const { data: pontosData } = await supabase
    .from("rota_pontos")
    .select("*, rota_ponto_detalhes(id, texto, ordem)")
    .eq("rota_id", id)
    .order("ordem", { ascending: true });

  const { data: dicasData } = await supabase
    .from("rota_dicas")
    .select("*")
    .eq("rota_id", id)
    .order("ordem", { ascending: true });

  const { data: localizacao } = await supabase
    .from("rotas_localizacoes")
    .select("*")
    .eq("rota_id", id)
    .maybeSingle();

  const pontos = pontosData ?? [];
  const dicas = dicasData ?? [];
  const nome = getRotaNome(rota);
  const categoria = getCategoriaRotaMeta(rota.categoria);
  const tags = getTagsFromRota(rota);
  const fotos = getFotosFromRota(rota);
  const mapsHref = getGoogleMapsDirectionsUrlForRota(rota, localizacao);
  return (
    <RotaDetalhePremium
      rotaId={id}
      nome={nome}
      descricao={rota.descricao || ""}
      fotos={fotos}
      categoria={{ nome: categoria.nome, icone: categoria.icone }}
      tags={tags.map((t) => ({ id: t.id, nome: t.nome, icone: t.icone }))}
      duracao={formatRotaDuracao(rota)}
      distancia={formatRotaDistancia(rota)}
      dificuldade={rota.dificuldade || "Fácil"}
      mapsHref={mapsHref}
      mapsSubtitulo={getRotaMapsSubtitulo(rota, localizacao)}
      infoCards={[]}
      pontos={pontos}
      dicas={dicas}
    />
  );
}
