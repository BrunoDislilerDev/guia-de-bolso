"use client";

import Link from "next/link";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import LocalForm from "@/components/admin/LocalForm";

/**
 * Admin page to create a new place via `LocalForm`.
 * @returns {import("react").ReactElement}
 */
export default function NovoLocalPage() {
  const { loading } = useAdminAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">Carregando admin...</div>;
  }

  return (
    <AdminShell title="Novo local">
      <Link href="/admin/locais" className="mb-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] shadow-sm">
        ← Voltar para Locais
      </Link>
      <LocalForm />
    </AdminShell>
  );
}
