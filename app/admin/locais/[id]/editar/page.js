"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import LocalForm from "@/components/admin/LocalForm";
import IconBack from "@/components/IconBack";
import { createClient } from "@/lib/supabase";

/**
 * Admin page to edit a place, location, and tags via `LocalForm`.
 * @returns {import("react").ReactElement}
 */
export default function EditarLocalPage() {
  const { loading } = useAdminAuth();
  const { id } = useParams();
  const [local, setLocal] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [tags, setTags] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    if (loading || !id) return;
    const supabase = createClient();
    Promise.all([
      supabase
        .from("lugares")
        .select("*")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("localizacoes")
        .select("*")
        .eq("lugar_id", id)
        .maybeSingle(),
      supabase
        .from("lugares_tags")
        .select("tags(*)")
        .eq("lugar_id", id),
    ]).then(([localRes, localizacaoRes, tagsRes]) => {
      setLocal(localRes.data);
      setLocalizacao(localizacaoRes.data);
      setTags((tagsRes.data ?? []).map((item) => item.tags).filter(Boolean));
      setLoadingLocal(false);
    });
  }, [loading, id]);

  if (loading || loadingLocal) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">Carregando admin...</div>;
  }

  return (
    <AdminShell title={`Editar ${local?.nome || "local"}`}>
      <Link
        href="/admin/locais"
        className="mb-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] shadow-sm"
      >
        <IconBack className="h-4 w-4" />
        Voltar para Locais
      </Link>
      {local ? (
        <LocalForm
          initialData={local}
          initialLocalizacao={localizacao}
          initialTags={tags}
          editingId={local.id}
        />
      ) : (
        <p className="rounded-2xl bg-white p-5 text-sm text-[#5a6b66] shadow-sm">
          Local não encontrado.
        </p>
      )}
    </AdminShell>
  );
}
