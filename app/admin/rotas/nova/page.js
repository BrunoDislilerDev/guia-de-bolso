"use client";

import Link from "next/link";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import RotaForm from "@/components/admin/RotaForm";

/**
 * Admin page to create a new route via `RotaForm`.
 * @returns {import("react").ReactElement}
 */
export default function NovaRotaPage() {
  const { loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell title="Nova Rota">
      <Link
        href="/admin/rotas"
        className="mb-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] shadow-sm"
      >
        ← Voltar para Rotas
      </Link>
      <RotaForm />
    </AdminShell>
  );
}
