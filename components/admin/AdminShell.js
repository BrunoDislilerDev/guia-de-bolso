"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/locais", label: "Locais" },
  { href: "/admin/avaliacoes", label: "Avaliações" },
  { href: "/admin/destaques", label: "Destaques" },
  { href: "/admin/usuarios", label: "Usuários" },
];

export function useAdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function checkAdmin() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!currentUser) {
        router.replace("/");
        return;
      }

      const { data: perfilData } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (cancelled) return;

      if (perfilData?.role !== "admin") {
        router.replace("/");
        return;
      }

      setUser(currentUser);
      setPerfil(perfilData);
      setLoading(false);
    }

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return { loading, user, perfil };
}

export default function AdminShell({ title, children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f0f4f3] font-sans text-[#1a2e28]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-[#1a4a3a] p-6 text-white md:block">
          <Link href="/" className="block text-2xl font-bold">
            Guia de bolso.
          </Link>
          <p className="mt-1 text-sm text-white/65">Painel administrativo</p>

          <nav className="mt-8 grid gap-2">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active ? "bg-white text-[#1a4a3a]" : "text-white/75 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#1a4a3a]">
                Admin
              </p>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="flex gap-2 overflow-x-auto md:hidden">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] shadow-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
