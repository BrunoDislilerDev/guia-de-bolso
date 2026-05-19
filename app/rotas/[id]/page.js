import Link from "next/link";
import { notFound } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getCapaFromRota } from "@/lib/fotos";
import { createClient } from "@/lib/supabase/server";

function IconClock({ className = "h-5 w-5" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPin({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function IconBolt({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 11-13h-8l0-7z" />
    </svg>
  );
}

function IconSend({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
    </svg>
  );
}

function IconBookmark({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 3h12a1 1 0 011 1v18l-7-4-7 4V4a1 1 0 011-1z" />
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
  if (!value) return "Livre";
  if (typeof value === "number") return `${value.toFixed(1)} km`;
  return String(value).includes("km") ? value : `${value} km`;
}

function dificuldadeClass(value) {
  const dificuldade = String(value || "").toLowerCase();
  if (dificuldade.includes("dif")) return "text-red-500";
  if (dificuldade.includes("mod") || dificuldade.includes("méd") || dificuldade.includes("med")) {
    return "text-amber-600";
  }
  return "text-emerald-600";
}

function Cover({ rota }) {
  const foto = getFotoCapa(rota);

  if (!foto) {
    return <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={foto} alt={getRotaNome(rota)} className="absolute inset-0 h-full w-full object-cover" />
  );
}

function Metric({ label, value, Icon, valueClassName = "text-gray-950" }) {
  return (
    <div className="flex-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
        {label}
      </p>
      <p className={`mt-1 flex items-center gap-1.5 text-sm font-bold ${valueClassName}`}>
        <Icon className="h-4 w-4 text-gray-500" />
        {value}
      </p>
    </div>
  );
}

export default async function RotaDetalhePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rota } = await supabase
    .from("rotas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!rota) notFound();

  const { data: pontosData } = await supabase
    .from("rota_pontos")
    .select("*")
    .eq("rota_id", id)
    .order("ordem", { ascending: true });

  const pontos = pontosData ?? [];
  const nome = getRotaNome(rota);
  const cidade = rota.cidade || "Imbituba";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nome} ${cidade}`)}`;

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <div className="mx-auto max-w-md">
        <section className="relative h-64 overflow-hidden bg-[#1a4a3a]">
          <Cover rota={rota} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-transparent" />

          <Link
            href="/rotas"
            className="absolute left-4 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-2xl font-semibold text-gray-950 shadow-md backdrop-blur"
            aria-label="Voltar para rotas"
          >
            ←
          </Link>
          <button
            type="button"
            className="absolute right-4 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-gray-950 shadow-md backdrop-blur"
            aria-label="Salvar rota"
          >
            <IconBookmark />
          </button>
        </section>

        <main className="px-4 pb-28 pt-6">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1a4a3a]">
            <IconPin className="h-3.5 w-3.5" />
            {rota.categoria || "Rota"}
          </p>
          <h1 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight">
            {nome}
          </h1>

          <div className="mt-6 flex gap-4 border-b border-gray-200 pb-5">
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 text-sm font-bold text-white"
          >
            <IconSend />
            Abrir no Maps
          </a>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Sobre esta rota</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {rota.descricao || "Descrição não informada."}
            </p>
          </section>

          {pontos.length > 0 && (
            <section className="mt-9">
              <h2 className="text-xl font-bold">Pontos do percurso</h2>
              <div className="relative mt-5 grid gap-5">
                <div className="absolute bottom-6 left-5 top-6 w-px bg-gray-200" />
                {pontos.map((ponto, index) => (
                  <div key={ponto.id} className="relative flex gap-4">
                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                      {ponto.ordem || index + 1}
                    </div>
                    <article className="flex-1 rounded-3xl bg-gray-100 p-4">
                      <h3 className="font-bold text-gray-950">
                        {ponto.nome || ponto.titulo || `Ponto ${index + 1}`}
                      </h3>
                      {ponto.descricao && (
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                          {ponto.descricao}
                        </p>
                      )}
                    </article>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="h-24" />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
