import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { getCapaFromRota } from "@/lib/fotos";
import { createClient } from "@/lib/supabase/server";

function IconClock({ className = "h-4 w-4" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPin({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function IconBolt({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 11-13h-8l0-7z" />
    </svg>
  );
}

function getRotaNome(rota) {
  return rota.nome || rota.titulo || "Rota sem nome";
}

function getFotoCapa(rota) {
  return getCapaFromRota(rota);
}

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

function formatDistancia(rota) {
  const value = rota.distancia_km ?? rota.distancia;
  if (!value) return "Distância livre";
  if (typeof value === "number") return `${value.toFixed(1)} km`;
  return String(value).includes("km") ? value : `${value} km`;
}

function dificuldadeClass(value) {
  const dificuldade = String(value || "").toLowerCase();
  if (dificuldade.includes("dif")) return "text-red-600";
  if (dificuldade.includes("mod") || dificuldade.includes("méd") || dificuldade.includes("med")) {
    return "text-amber-600";
  }
  return "text-emerald-600";
}

function CoverImage({ rota, className }) {
  const foto = getFotoCapa(rota);

  if (!foto) {
    return <div className={`${className} bg-gradient-to-br from-emerald-400 to-teal-600`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={foto} alt={getRotaNome(rota)} className={`${className} object-cover`} />
  );
}

function Metrics({ rota, compact = false }) {
  const dificuldade = rota.dificuldade || "Fácil";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${compact ? "text-xs" : "text-sm"} text-gray-500`}>
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

function DestaqueCard({ rota }) {
  return (
    <Link href={`/rotas/${rota.id}`} className="block overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="relative h-48 w-full">
        <CoverImage rota={rota} className="h-full w-full" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1a4a3a] shadow-sm backdrop-blur-md">
          ⭐ Destaque
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold leading-tight text-gray-950">{getRotaNome(rota)}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {rota.descricao}
        </p>
        <div className="mt-4">
          <Metrics rota={rota} />
        </div>
      </div>
    </Link>
  );
}

function CompactRouteCard({ rota }) {
  return (
    <Link href={`/rotas/${rota.id}`} className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
        <CoverImage rota={rota} className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <h2 className="truncate text-base font-bold text-gray-950">{getRotaNome(rota)}</h2>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {rota.descricao}
        </p>
        <div className="mt-2">
          <Metrics rota={rota} compact />
        </div>
      </div>
    </Link>
  );
}

export default async function RotasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rotas")
    .select("*")
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: false });

  const rotas = data ?? [];
  const destaque = rotas.find((rota) => rota.destaque === true);
  const outrasRotas = destaque ? rotas.filter((rota) => rota.id !== destaque.id) : rotas;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <header className="sticky top-0 z-30 border-b border-gray-200/70 bg-gray-50/95 px-4 py-5 backdrop-blur">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">Rotas</h1>
          <p className="mt-1 text-sm text-gray-500">Trilhas e caminhos selecionados</p>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-28 pt-5">
        {rotas.length === 0 ? (
          <p className="rounded-3xl bg-white p-5 text-sm text-gray-500 shadow-sm">
            Nenhuma rota cadastrada ainda.
          </p>
        ) : (
          <div className="grid gap-4">
            {destaque && <DestaqueCard rota={destaque} />}
            {outrasRotas.map((rota) => (
              <CompactRouteCard key={rota.id} rota={rota} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
