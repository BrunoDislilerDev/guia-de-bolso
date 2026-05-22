"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import PremiumPaywallSheet from "@/components/PremiumPaywallSheet";
import PerfilHero from "@/components/perfil/PerfilHero";
import PerfilLoggedOut from "@/components/perfil/PerfilLoggedOut";
import PerfilNavAppSheet from "@/components/perfil/PerfilNavAppSheet";
import PerfilPremiumCard from "@/components/perfil/PerfilPremiumCard";
import PerfilQuickLinks from "@/components/perfil/PerfilQuickLinks";
import PerfilSettingsGroup from "@/components/perfil/PerfilSettingsGroup";
import PerfilSkeleton from "@/components/perfil/PerfilSkeleton";
import PerfilStats from "@/components/perfil/PerfilStats";
import PerfilBottomSheet from "@/components/perfil/PerfilBottomSheet";
import {
  MAP_PREFERENCE_STORAGE_KEY,
  getNavAppLabel,
  getUserName,
  providerName,
  resolveAvatarUrl,
} from "@/lib/perfil";
import { isPremiumActive } from "@/lib/premium";
import { usePremiumUsage } from "@/lib/usePremiumUsage";
import { createClient } from "@/lib/supabase";
import { registrarLog } from "@/lib/logs";

/**
 * Aba Perfil — conta, preferências e estatísticas.
 * @returns {import("react").JSX.Element}
 */
export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [avaliacoesCount, setAvaliacoesCount] = useState(0);
  const [roteirosCount, setRoteirosCount] = useState(0);
  const [navPreference, setNavPreference] = useState("google");
  const [showNavSheet, setShowNavSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { usage: premiumUsage } = usePremiumUsage(user);
  const isPremium = isPremiumActive(perfil) || Boolean(premiumUsage?.premium);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(MAP_PREFERENCE_STORAGE_KEY)
        : null;

    if (stored) setNavPreference(stored);

    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        const { data: perfilData } = await supabase
          .from("perfis")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (perfilData) {
          setPerfil(perfilData);
          if (perfilData.maps_preferido) {
            setNavPreference(perfilData.maps_preferido);
            localStorage.setItem(
              MAP_PREFERENCE_STORAGE_KEY,
              perfilData.maps_preferido
            );
          }
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (!session?.user) {
        setPerfil(null);
        setFavoritosCount(0);
        setAvaliacoesCount(0);
        setRoteirosCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const supabase = createClient();

    Promise.all([
      supabase
        .from("favoritos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("avaliacoes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("roteiros")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]).then(([favoritosRes, avaliacoesRes, roteirosRes]) => {
      setFavoritosCount(favoritosRes.count ?? 0);
      setAvaliacoesCount(avaliacoesRes.count ?? 0);
      setRoteirosCount(roteirosRes.count ?? 0);
    });

    return undefined;
  }, [user]);

  /** @returns {Promise<void>} */
  async function handleLogout() {
    const supabase = createClient();
    await registrarLog(supabase, user, "logout");
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    setShowLogoutConfirm(false);
    router.push("/");
  }

  /** @returns {Promise<void>} */
  async function handleDeleteAccountRequest() {
    const supabase = createClient();
    await registrarLog(supabase, user, "deletou_conta");
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    setFeedbackMessage(
      "Exclusão solicitada. Saímos da sua conta por segurança."
    );
    setShowDeleteConfirm(false);
    router.push("/");
  }

  /**
   * @param {string} value
   */
  async function handleSelectNavigationApp(value) {
    localStorage.setItem(MAP_PREFERENCE_STORAGE_KEY, value);
    setNavPreference(value);
    setShowNavSheet(false);

    if (!user) return;

    const supabase = createClient();
    await supabase
      .from("perfis")
      .upsert({ id: user.id, maps_preferido: value }, { onConflict: "id" });
  }

  const nome = getUserName(user, perfil);
  const avatarUrl = resolveAvatarUrl(user, perfil);
  const membroDesde = perfil?.created_at || user?.created_at;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f0f4f3]">
        <header className="px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="mx-auto max-w-md">
            <h1 className="text-2xl font-bold text-[#1a2e28]">Perfil</h1>
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 pb-28 pt-5">
          <PerfilSkeleton />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <header className="sticky top-0 z-30 border-b border-[#e8eeee]/80 bg-[#f0f4f3]/90 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2e28]">
            Perfil
          </h1>
          <p className="mt-1 text-sm text-[#5a6b66]">
            {user
              ? "Sua conta e preferências na região"
              : "Entre para salvar favoritos e avaliar lugares"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-32 pt-5">
        {!user ? (
          <PerfilLoggedOut />
        ) : (
          <div className="space-y-6">
            <PerfilHero
              nome={nome}
              email={user.email}
              avatarUrl={avatarUrl}
              membroDesde={membroDesde}
              isPremium={isPremium}
            />

            <PerfilStats
              favoritos={favoritosCount}
              avaliacoes={avaliacoesCount}
              roteiros={roteirosCount}
            />

            <PerfilPremiumCard
              isPremium={isPremium}
              usage={premiumUsage}
              onUpgrade={() => setPaywallOpen(true)}
            />

            <PerfilQuickLinks />

            <PerfilSettingsGroup
              title="Preferências"
              items={[
                {
                  key: "nav",
                  icon: "🗺️",
                  label: "App de navegação",
                  detail: getNavAppLabel(navPreference),
                  onClick: () => setShowNavSheet(true),
                },
              ]}
            />

            <PerfilSettingsGroup
              title="Conta"
              items={[
                {
                  key: "editar",
                  icon: "✏️",
                  label: "Editar perfil",
                  detail: "Nome e foto",
                  href: "/perfil/editar",
                },
                {
                  key: "provider",
                  icon: "📱",
                  label: "Conta vinculada",
                  detail: providerName(user),
                },
              ]}
            />

            <PerfilSettingsGroup
              title="Legal"
              items={[
                {
                  key: "termos",
                  icon: "📄",
                  label: "Termos de Uso",
                  href: "/termos",
                },
                {
                  key: "privacidade",
                  icon: "🔒",
                  label: "Política de Privacidade",
                  href: "/privacidade",
                },
              ]}
            />

            <PerfilSettingsGroup
              title="Sessão"
              items={[
                {
                  key: "logout",
                  icon: "🚪",
                  label: "Sair",
                  onClick: () => setShowLogoutConfirm(true),
                },
                {
                  key: "delete",
                  icon: "🗑️",
                  label: "Excluir conta",
                  detail: "Ação permanente",
                  danger: true,
                  onClick: () => setShowDeleteConfirm(true),
                },
              ]}
            />

            {feedbackMessage && (
              <p
                className="rounded-2xl bg-white p-4 text-sm text-[#5a6b66] shadow-sm ring-1 ring-[#e8eeee]"
                role="status"
              >
                {feedbackMessage}
              </p>
            )}

            <p className="pb-2 text-center text-[10px] text-[#9aa8a3]">
              Guia de Bolso · Imbituba
            </p>
          </div>
        )}
      </main>

      <BottomNav />

      <PerfilNavAppSheet
        isOpen={showNavSheet}
        onClose={() => setShowNavSheet(false)}
        selected={navPreference}
        onSelect={handleSelectNavigationApp}
      />

      <PerfilBottomSheet
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Excluir conta"
      >
        <p className="text-sm leading-relaxed text-[#5a6b66]">
          Esta ação é permanente. Seus favoritos, avaliações e roteiros serão
          removidos.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccountRequest}
          className="mt-5 w-full rounded-xl bg-[#d9534f] py-3.5 text-sm font-semibold text-white"
        >
          Excluir permanentemente
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(false)}
          className="mt-3 w-full rounded-xl bg-[#f0f4f3] py-3.5 text-sm font-semibold text-[#5a6b66]"
        >
          Cancelar
        </button>
      </PerfilBottomSheet>

      <PerfilBottomSheet
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Sair da conta"
      >
        <p className="text-sm leading-relaxed text-[#5a6b66]">
          Tem certeza que deseja sair?
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 w-full rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white"
        >
          Sair
        </button>
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(false)}
          className="mt-3 w-full rounded-xl bg-[#f0f4f3] py-3.5 text-sm font-semibold text-[#5a6b66]"
        >
          Cancelar
        </button>
      </PerfilBottomSheet>

      <PremiumPaywallSheet
        isOpen={paywallOpen}
        feature="geral"
        onClose={() => setPaywallOpen(false)}
        onLogin={() => setPaywallOpen(false)}
      />
    </div>
  );
}
