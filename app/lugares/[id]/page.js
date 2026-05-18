import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

function IconPin({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

const categoriaStyles = {
  Natureza: "bg-[#b8e6d4] text-[#1a4a3a]",
  Gastronomia: "bg-[#f0e4d4] text-[#6b5344]",
  Noite: "bg-[#e4d4f0] text-[#5c4a6e]",
  Serviços: "bg-[#c5dff5] text-[#2a5a7a]",
  Hospedagem: "bg-[#f5e6b8] text-[#7a6520]",
};

function googleMapsUrl(lugar) {
  const query = encodeURIComponent(`${lugar.nome} Imbituba Santa Catarina`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default async function LugarPage({ params }) {
  const { id } = await params;

  const { data: lugar } = await supabase
    .from("lugares")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!lugar) {
    notFound();
  }

  const badgeStyle =
    categoriaStyles[lugar.categoria] ?? "bg-white text-[#1a4a3a]";

  return (
    <div className="min-h-screen bg-[#f0f4f3] font-sans text-[#1a2e28]">
      <div className="mx-auto max-w-md">
        <div className="px-4 pt-6 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#1a4a3a] transition-opacity hover:opacity-80"
          >
            ← Voltar
          </Link>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lugar.imagem_url}
          alt={lugar.nome}
          className="h-56 w-full object-cover"
        />

        <div className="px-4 pb-10 pt-5">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
          >
            {lugar.categoria}
          </span>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1a2e28]">
            {lugar.nome}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-[#5a6b66]">
            {lugar.descricao}
          </p>

          <p className="mt-4 flex items-center gap-1.5 text-sm text-[#5a6b66]">
            <IconPin className="w-4 h-4 shrink-0 text-[#1a4a3a]" />
            {lugar.distancia}
          </p>

          <a
            href={googleMapsUrl(lugar)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-xl bg-[#1a4a3a] py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528]"
          >
            Abrir no Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
