import { notFound } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import RotaGaleria from "@/components/rotas/RotaGaleria";
import { DETALHE_CARD_OVERLAP_CLASS } from "@/components/lugar/airbnb/lugarAirbnbTokens";
import { getFotosFromRota } from "@/lib/fotos";
import { getGoogleMapsDirectionsUrlForRota } from "@/lib/rotaMaps";
import { getDetalhesFromPonto } from "@/lib/rotaPontos";
import { getCategoriaRotaMeta } from "@/lib/rotas";
import { getTagsFromRota } from "@/lib/tags";
import { createClient } from "@/lib/supabase/server";

/**
 * Clock icon for route detail metrics.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconClock({ className = "h-5 w-5" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Pin icon for route detail metrics.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconPin({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

/**
 * Bolt icon for route difficulty.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconBolt({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 11-13h-8l0-7z" />
    </svg>
  );
}

/**
 * Send/share icon for route actions.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconSend({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
    </svg>
  );
}

/**
 * Display title for a route record.
 * @param {object} rota - Route row.
 * @returns {string} Route name.
 */
function getRotaNome(rota) {
  return rota.nome || rota.titulo || "Rota sem nome";
}

/**
 * Formats route duration from `duracao_minutos`.
 * @param {object} rota - Route row.
 * @returns {string} Human-readable duration or em dash.
 */
function formatDuracao(rota) {
  const minutos = rota.duracao_minutos;
  if (minutos === null || minutos === undefined) return "—";

  const totalMinutos = Number(minutos);
  if (!Number.isFinite(totalMinutos)) return "—";

  const horas = Math.floor(totalMinutos / 60);
  const mins = totalMinutos % 60;

  return horas > 0
    ? `${horas}h ${mins > 0 ? `${mins}m` : ""}`.trim()
    : `${mins}m`;
}

/**
 * Formats route distance for the detail page.
 * @param {object} rota - Route row.
 * @returns {string} Distance label.
 */
function formatDistancia(rota) {
  const value = rota.distancia_km ?? rota.distancia;
  if (!value) return "Livre";
  if (typeof value === "number") return `${value.toFixed(1)} km`;
  return String(value).includes("km") ? value : `${value} km`;
}

/**
 * Tailwind text color class for difficulty on detail page.
 * @param {string} [value] - Difficulty text.
 * @returns {string} CSS class name.
 */
function dificuldadeClass(value) {
  const dificuldade = String(value || "").toLowerCase();
  if (dificuldade.includes("dif")) return "text-red-500";
  if (dificuldade.includes("mod") || dificuldade.includes("méd") || dificuldade.includes("med")) {
    return "text-amber-800";
  }
  return "text-[#1a4a3a]";
}

/**
 * Single metric block on the route detail page.
 * @param {{ label: string, value: string, Icon: (props: { className?: string }) => import("react").ReactElement, valueClassName?: string }} props
 * @returns {import("react").ReactElement}
 */
function Metric({ label, value, Icon, valueClassName = "text-[#1a2e28]" }) {
  return (
    <div className="flex-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a6b66]">
        {label}
      </p>
      <p className={`mt-1 flex items-center gap-1.5 text-sm font-bold ${valueClassName}`}>
        <Icon className="h-4 w-4 text-[#5a6b66]" />
        {value}
      </p>
    </div>
  );
}

/**
 * Route detail page with cover, metrics, and step list.
 * @param {{ params: Promise<{ id: string }> }} props - Dynamic route params.
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
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md">
        <RotaGaleria
          rotaId={id}
          nome={nome}
          imagens={fotos}
          descricao={rota.descricao || ""}
        />

        <main className={`${DETALHE_CARD_OVERLAP_CLASS} px-6 pb-28 pt-6`}>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1a4a3a]">
            <span aria-hidden>{categoria.icone}</span>
            {categoria.nome}
          </p>
          <h1 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight">
            {nome}
          </h1>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a4a3a] shadow-sm"
                >
                  {tag.icone ? `${tag.icone} ` : ""}
                  {tag.nome}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-4 border-b border-[#e3e9e6] pb-5">
            <Metric label="Duração" value={formatDuracao(rota)} Icon={IconClock} />
            <Metric label="Distância" value={formatDistancia(rota)} Icon={IconPin} />
            <Metric
              label="Dificuldade"
              value={rota.dificuldade || "Fácil"}
              Icon={IconBolt}
              valueClassName={dificuldadeClass(rota.dificuldade)}
            />
          </div>

          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4a3a] py-4 text-sm font-bold text-white"
          >
            <IconSend />
            Abrir no Maps
          </a>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Sobre esta rota</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5a6b66]">
              {rota.descricao || "Descrição não informada."}
            </p>
          </section>

          {pontos.length > 0 && (
            <section className="mt-9">
              <h2 className="text-xl font-bold">Pontos do percurso</h2>
              <div className="relative mt-5 grid gap-5">
                <div className="absolute bottom-6 left-5 top-6 w-px bg-[#e3e9e6]" />
                {pontos.map((ponto, index) => {
                  const detalhes = getDetalhesFromPonto(ponto);

                  return (
                  <div key={ponto.id} className="relative flex gap-4">
                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a4a3a] text-sm font-bold text-white">
                      {ponto.ordem || index + 1}
                    </div>
                    <article className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                      <h3 className="font-bold text-[#1a2e28]">
                        {ponto.nome || ponto.titulo || `Ponto ${index + 1}`}
                      </h3>
                      {detalhes.length > 0 && (
                        <ol className="mt-3 grid list-none gap-2 p-0">
                          {detalhes.map((detalhe, detalheIndex) => (
                            <li
                              key={detalhe.id || `${ponto.id}-${detalheIndex}`}
                              className="flex gap-2 text-sm leading-relaxed text-[#5a6b66]"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef5f2] text-[11px] font-bold text-[#1a4a3a]">
                                {detalhe.ordem || detalheIndex + 1}
                              </span>
                              <span className="min-w-0 flex-1 pt-0.5">{detalhe.texto}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </article>
                  </div>
                  );
                })}
              </div>
            </section>
          )}

          {dicas.length > 0 && (
            <section className="mt-9">
              <h2 className="text-xl font-bold">Dicas</h2>
              <ol className="mt-4 grid list-none gap-3 p-0">
                {dicas.map((dica, index) => (
                  <li
                    key={dica.id}
                    className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4ede8] text-sm font-bold text-[#1a4a3a]">
                      {dica.ordem || index + 1}
                    </span>
                    <p className="min-w-0 flex-1 text-sm leading-relaxed text-[#5a6b66]">
                      {dica.texto}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="h-24" />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
