import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import RoteiroSection from "@/components/rotas/RoteiroSection";
import { getCapaFromRota } from "@/lib/fotos";
import { createClient } from "@/lib/supabase/server";

/**
 * Clock icon for route duration metrics.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconClock({ className = "h-4 w-4" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Pin icon for route distance metrics.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconPin({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

/**
 * Bolt icon for route difficulty metrics.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconBolt({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 11-13h-8l0-7z" />
    </svg>
  );
}

/**
 * Map icon for empty route list state.
 * @returns {import("react").ReactElement}
 */
function IconMapEmpty() {
  return (
    <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
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
 * Cover image URL for a route.
 * @param {object} rota - Route row.
 * @returns {string|undefined} Image URL.
 */
function getFotoCapa(rota) {
  return getCapaFromRota(rota);
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
 * Formats route distance from km field or legacy `distancia`.
 * @param {object} rota - Route row.
 * @returns {string} Distance label.
 */
function formatDistancia(rota) {
  const value = rota.distancia_km ?? rota.distancia;
  if (!value) return "Distância livre";
  if (typeof value === "number") return `${value.toFixed(1)} km`;
  return String(value).includes("km") ? value : `${value} km`;
}

/**
 * Tailwind text color class for difficulty label.
 * @param {string} [value] - Difficulty text.
 * @returns {string} CSS class name.
 */
function dificuldadeClass(value) {
  const dificuldade = String(value || "").toLowerCase();
  if (dificuldade.includes("dif")) return "text-red-600";
  if (dificuldade.includes("mod") || dificuldade.includes("méd") || dificuldade.includes("med")) {
    return "text-amber-800";
  }
  return "text-[#1a4a3a]";
}

/**
 * Route cover image or gradient placeholder.
 * @param {{ rota: object, className: string }} props
 * @returns {import("react").ReactElement}
 */
function CoverImage({ rota, className, priority = false, sizes = "(max-width: 768px) 100vw, 400px" }) {
  const foto = getFotoCapa(rota);

  if (!foto) {
    return <div className={`${className} bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54]`} />;
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      <Image
        src={foto}
        alt={getRotaNome(rota)}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

/**
 * Duration, distance, and difficulty row for a route card.
 * @param {{ rota: object, compact?: boolean }} props
 * @returns {import("react").ReactElement}
 */
function Metrics({ rota, compact = false }) {
  const dificuldade = rota.dificuldade || "Fácil";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${compact ? "text-xs" : "text-sm"} text-[#5a6b66]`}>
      <span className="flex items-center gap-1">
        <IconClock />
        {formatDuracao(rota)}
      </span>
      <span className="flex items-center gap-1">
        <IconPin />
        {formatDistancia(rota)}
      </span>
      <span className={`flex items-center gap-1 font-semibold ${dificuldadeClass(dificuldade)}`}>
        <IconBolt />
        {dificuldade}
      </span>
    </div>
  );
}

/**
 * Featured route card with large cover image.
 * @param {{ rota: object }} props
 * @returns {import("react").ReactElement}
 */
function DestaqueCard({ rota }) {
  return (
    <Link href={`/rotas/${rota.id}`} className="block overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative h-48 w-full">
        <CoverImage rota={rota} className="h-full w-full" priority />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1a4a3a] shadow-sm backdrop-blur-md">
          ⭐ Destaque
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold leading-tight text-[#1a2e28]">{getRotaNome(rota)}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5a6b66]">
          {rota.descricao}
        </p>
        <div className="mt-4">
          <Metrics rota={rota} />
        </div>
      </div>
    </Link>
  );
}

/**
 * Compact horizontal route list card.
 * @param {{ rota: object }} props
 * @returns {import("react").ReactElement}
 */
function CompactRouteCard({ rota }) {
  return (
    <Link href={`/rotas/${rota.id}`} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
        <CoverImage rota={rota} className="h-full w-full" sizes="96px" />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <h2 className="truncate text-base font-bold text-[#1a2e28]">{getRotaNome(rota)}</h2>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#5a6b66]">
          {rota.descricao}
        </p>
        <div className="mt-2">
          <Metrics rota={rota} compact />
        </div>
      </div>
    </Link>
  );
}

/**
 * Routes listing with featured route, AI roteiro section, and saved roteiros.
 * @returns {Promise<import("react").ReactElement>}
 */
export default async function RotasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("rotas")
    .select("*")
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: false });

  let roteiros = [];
  if (user) {
    const { data: roteirosData } = await supabase
      .from("roteiros")
      .select("id, titulo, dias, perfil, interesses, conteudo, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    roteiros = roteirosData ?? [];
  }

  const rotas = data ?? [];
  const destaque = rotas.find((rota) => rota.destaque === true);
  const outrasRotas = destaque ? rotas.filter((rota) => rota.id !== destaque.id) : rotas;

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <header className="sticky top-0 z-30 border-b border-[#e3e9e6]/70 bg-[#f0f4f3]/95 px-4 py-5 backdrop-blur">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2e28]">Rotas</h1>
          <p className="mt-1 text-sm text-[#5a6b66]">Trilhas e caminhos selecionados</p>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-28 pt-5">
        <RoteiroSection isLoggedIn={Boolean(user)} roteirosIniciais={roteiros} />

        {rotas.length === 0 ? (
          <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d4ede8] text-[#1a4a3a]">
              <IconMapEmpty />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#1a2e28]">
              Nenhuma rota cadastrada ainda
            </h2>
            <p className="mt-2 text-sm text-[#5a6b66]">
              Em breve novas trilhas e caminhos aparecerão aqui.
            </p>
          </section>
        ) : (
          <ul className="grid list-none gap-4 p-0">
            {destaque && (
              <li>
                <DestaqueCard rota={destaque} />
              </li>
            )}
            {outrasRotas.map((rota) => (
              <li key={rota.id}>
                <CompactRouteCard rota={rota} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
