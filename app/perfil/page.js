"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFlow from "@/components/AuthFlow";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase";
import { registrarLog } from "@/lib/logs";

function IconPerson({ className = "h-16 w-16" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

const navigationApps = [
  { key: "google", label: "Google Maps" },
  { key: "apple", label: "Apple Maps" },
  { key: "waze", label: "Waze" },
];

function providerName(user) {
  const provider = user?.app_metadata?.provider;
  if (provider === "google") return "Google";
  return provider || "Conta";
}

function getUserName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Usuário"
  );
}

function getInitial(user) {
  return getUserName(user).charAt(0).toUpperCase();
}

function BottomSheet({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[24px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{ animation: "sheetIn 220ms ease-out" }}
      >
        <style>{`
          @keyframes sheetIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />
        <h2 className="mb-4 text-lg font-bold text-[#1a2e28]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ icon, label, detail, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="text-xl">{icon}</span>
      <span className={`flex-1 text-sm font-semibold ${danger ? "text-[#d9534f]" : "text-[#1a2e28]"}`}>
        {label}
        {detail && (
          <span className="mt-0.5 block text-xs font-medium text-[#5a6b66]">
            {detail}
          </span>
        )}
      </span>
      <span className={danger ? "text-[#d9534f]" : "text-[#1a4a3a]"}>→</span>
    </button>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [navPreference, setNavPreference] = useState("google");
  const [showNavSheet, setShowNavSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const preferenceTimer = setTimeout(() => {
      setNavPreference(localStorage.getItem("map_app_preferido") || "google");
    }, 0);

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      clearTimeout(preferenceTimer);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    supabase
      .from("favoritos")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => setFavoritosCount(count ?? 0));
  }, [user]);

  async function handleLogout() {
    const supabase = createClient();
    await registrarLog(supabase, user, "logout");
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  }

  async function handleDeleteAccountRequest() {
    const supabase = createClient();
    await registrarLog(supabase, user, "deletou_conta");
    await supabase.auth.signOut();
    setUser(null);
    setDeleteMessage("Exclusão solicitada. Saímos da sua conta por segurança.");
    setShowDeleteConfirm(false);
    router.push("/");
  }

  function handleSelectNavigationApp(value) {
    localStorage.setItem("map_app_preferido", value);
    setNavPreference(value);
    setShowNavSheet(false);
  }

  const selectedNavLabel =
    navigationApps.find((app) => app.key === navPreference)?.label || "Google Maps";

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 pb-28 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#d4ede8] text-[#1a4a3a]">
            <IconPerson />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[#1a4a3a]">
            Sua experiência personalizada
          </h1>

          <div className="mt-7 grid gap-3 text-left">
            {[
              ["❤️", "Salve seus lugares favoritos"],
              ["📍", "Veja lugares perto de você em tempo real"],
              ["⭐", "Avalie e compartilhe experiências"],
              ["🗺️", "Acesse rotas exclusivas"],
            ].map(([icon, text]) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-semibold text-[#1a2e28]">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl bg-white p-5 text-left shadow-sm">
            <AuthFlow compact />
          </div>

          <Link
            href="/"
            className="mt-5 text-sm font-medium text-[#5a6b66] transition-colors hover:text-[#1a4a3a]"
          >
            Continuar sem login
          </Link>
        </div>

        <BottomNav />
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        <header className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-20 w-20 rounded-full object-cover ring-4 ring-[#d4ede8]"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1a4a3a] text-2xl font-bold text-white ring-4 ring-[#d4ede8]">
                {getInitial(user)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold text-[#1a2e28]">
                {getUserName(user)}
              </h1>
              <p className="truncate text-sm text-[#5a6b66]">{user.email}</p>
              <Link
                href="/perfil/editar"
                className="mt-3 rounded-full bg-[#d4ede8] px-3 py-1 text-xs font-semibold text-[#1a4a3a]"
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 grid grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-r border-[#f0f4f3] p-5 text-center">
            <p className="text-2xl font-bold text-[#1a4a3a]">{favoritosCount}</p>
            <p className="mt-1 text-xs font-medium text-[#5a6b66]">Favoritos</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-2xl font-bold text-[#1a4a3a]">0</p>
            <p className="mt-1 text-xs font-medium text-[#5a6b66]">Avaliações</p>
          </div>
        </section>

        <section className="mt-6 grid gap-3">
          <SettingRow icon="🔔" label="Notificações" />
          <SettingRow
            icon="🗺️"
            label="App de navegação preferido"
            detail={selectedNavLabel}
            onClick={() => setShowNavSheet(true)}
          />
          <SettingRow
            icon="📱"
            label="Conta vinculada"
            detail={providerName(user)}
          />
          <SettingRow
            icon="🗑️"
            label="Excluir conta"
            danger
            onClick={() => setShowDeleteConfirm(true)}
          />
          <SettingRow icon="🚪" label="Sair" onClick={() => setShowLogoutConfirm(true)} />
        </section>
        {deleteMessage && (
          <p className="mt-4 rounded-2xl bg-white p-4 text-sm text-[#5a6b66] shadow-sm">
            {deleteMessage}
          </p>
        )}
      </div>

      <BottomNav />

      <BottomSheet
        isOpen={showNavSheet}
        onClose={() => setShowNavSheet(false)}
        title="App de navegação preferido"
      >
        <div className="grid gap-2">
          {navigationApps.map((app) => {
            const selected = app.key === navPreference;
            return (
              <button
                key={app.key}
                type="button"
                onClick={() => handleSelectNavigationApp(app.key)}
                className="flex items-center justify-between rounded-2xl bg-[#f0f4f3] px-4 py-3 text-left"
              >
                <span className="font-medium text-[#1a2e28]">{app.label}</span>
                {selected && (
                  <span className="text-lg font-bold text-[#1a4a3a]">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Excluir conta"
      >
        <p className="text-sm leading-relaxed text-[#5a6b66]">
          Esta ação é permanente e não pode ser desfeita. Todos os seus favoritos
          e avaliações serão removidos.
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
      </BottomSheet>

      <BottomSheet
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
      </BottomSheet>
    </div>
  );
}
