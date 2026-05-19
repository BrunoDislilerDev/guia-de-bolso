"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCapaFromLugar } from "@/lib/fotos";
import { getStatusFuncionamento } from "@/lib/horarios";
import { getTagsFromLugar } from "@/lib/tags";
import { createClient } from "@/lib/supabase";

export default function EmAltaCard({ lugar }) {
  const status = getStatusFuncionamento(lugar.horarios);
  const tags = getTagsFromLugar(lugar).slice(0, 2);
  const distancia = lugar.distancia_calculada || lugar.distancia;
  const [rating, setRating] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("avaliacoes")
      .select("nota")
      .eq("lugar_id", lugar.id)
      .eq("status", "aprovada")
      .then(({ data }) => {
        if (cancelled || !data?.length) return;
        const total = data.reduce((sum, row) => sum + Number(row.nota || 0), 0);
        setRating(total / data.length);
      });

    return () => {
      cancelled = true;
    };
  }, [lugar.id]);

  return (
    <Link
      href={`/lugares/${lugar.id}`}
      className="group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
    >
      <div className="relative h-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getCapaFromLugar(lugar)}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            status.aberto ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {status.aberto ? "Aberto" : "Fechado"}
        </span>
        {rating && (
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            ⭐ {rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-[#1a2e28]">{lugar.nome}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-[#5a6b66]">{distancia}</p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag.id ?? tag.nome}
                className="rounded-full bg-[#f0f4f3] px-2 py-0.5 text-[10px] font-medium text-[#1a4a3a]"
              >
                {tag.nome}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
