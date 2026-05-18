"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import LocalForm from "@/components/admin/LocalForm";
import { createClient } from "@/lib/supabase";

export default function EditarLocalPage() {
  const { loading } = useAdminAuth();
  const { id } = useParams();
  const [local, setLocal] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    if (loading || !id) return;
    const supabase = createClient();
    supabase
      .from("lugares")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setLocal(data);
        setLoadingLocal(false);
      });
  }, [loading, id]);

  if (loading || loadingLocal) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">Carregando admin...</div>;
  }

  return (
    <AdminShell title={`Editar ${local?.nome || "local"}`}>
      <Link href="/admin/locais" className="mb-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] shadow-sm">
        ← Voltar para Locais
      </Link>
      {local ? (
        <LocalForm initialData={local} editingId={local.id} />
      ) : (
        <p className="rounded-2xl bg-white p-5 text-sm text-[#5a6b66] shadow-sm">
          Local não encontrado.
        </p>
      )}
    </AdminShell>
  );
}
