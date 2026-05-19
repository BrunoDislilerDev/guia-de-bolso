"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { canAccessAdmin } from "@/lib/adminRoles";
import { createClient } from "@/lib/supabase";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/locais", label: "Locais", icon: "📍" },
  { href: "/admin/rotas", label: "Rotas", icon: "🗺️" },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: "⭐" },
  { href: "/admin/destaques", label: "Destaques", icon: "✨" },
  { href: "/admin/usuarios", label: "Usuários", icon: "👥" },
];

/**
 * Hook que valida sessão Supabase e role admin; redireciona para home se não autorizado.
 * @returns {{ loading: boolean, user: import("@supabase/supabase-js").User|null, perfil: object|null }}
 */
export function useAdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    /** Carrega usuário e perfil; redireciona se não autenticado ou sem permissão admin. */
    async function checkAdmin() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!currentUser) {
        router.replace("/");
        return;
      }

      const { data: perfilData, error: perfilError } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (cancelled) return;

      if (!canAccessAdmin(perfilData?.role)) {
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

/**
 * Layout do painel admin com sidebar (desktop), chips de navegação (mobile) e área de conteúdo.
 * @param {object} props
 * @param {string} props.title - Título da página no header.
 * @param {string} [props.subtitle] - Subtítulo opcional abaixo do título.
 * @param {import("react").ReactNode} [props.headerAction] - Ação extra alinhada à direita do header.
 * @param {string} [props.contentClassName] - Classes extras no `<main>`.
 * @param {import("react").ReactNode} props.children - Conteúdo da página.
 * @returns {import("react").JSX.Element}
 */
export default function AdminShell({
  title,
  subtitle,
  headerAction,
  contentClassName = "",
  children,
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
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
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className={`flex-1 p-4 md:p-8 ${contentClassName}`}>
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#1a4a3a]">
                Admin
              </p>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-[#5a6b66]">{subtitle}</p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] shadow-sm"
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
