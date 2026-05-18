"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import LoginModal from "@/components/LoginModal";
import PlaceCard from "@/components/PlaceCard";
import { createClient } from "@/lib/supabase";
import { registrarLog } from "@/lib/logs";

function EmptyIllustration() {
  return (
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#d4ede8] text-[#1a4a3a]">
      <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </div>
  );
}

function normalizeLugarFromFavorito(favorito) {
  const nested = favorito.lugares || favorito.lugar;
  if (Array.isArray(nested)) return nested[0];
  return nested;
}

export default function FavoritosPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lugares, setLugares] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (!currentUser) setLugares([]);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setLugares([]);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const supabase = createClient();
    const loadingTimer = setTimeout(() => {
      if (!cancelled) setLoadingFavoritos(true);
    }, 0);

    supabase
      .from("favoritos")
      .select("id,lugar_id,lugares!inner(*)")
      .eq("user_id", user.id)
      .eq("lugares.status", "ativo")
      .then(async ({ data, error }) => {
        if (cancelled) return;

        if (!error) {
          setLugares((data ?? []).map(normalizeLugarFromFavorito).filter(Boolean));
          setLoadingFavoritos(false);
          return;
        }

        const { data: favoritos } = await supabase
          .from("favoritos")
          .select("lugar_id")
          .eq("user_id", user.id);

        const ids = (favoritos ?? []).map((favorito) => favorito.lugar_id);

        if (ids.length === 0) {
          setLugares([]);
          setLoadingFavoritos(false);
          return;
        }

        const { data: lugaresData } = await supabase
          .from("lugares")
          .select("*")
          .in("id", ids)
          .eq("status", "ativo");

        setLugares(lugaresData ?? []);
        setLoadingFavoritos(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(loadingTimer);
    };
  }, [user]);

  async function handleRemoverFavorito(lugar) {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    const supabase = createClient();
    const anteriores = lugares;

    setLugares((atuais) =>
      atuais.filter((item) => String(item.id) !== String(lugar.id))
    );

    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id);

    if (error) {
      setLugares(anteriores);
    } else {
      await registrarLog(supabase, user, "desfavoritou", {
        lugar_id: lugar.id,
        lugar_nome: lugar.nome,
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2e28]">
            Favoritos
          </h1>
          <p className="mt-1 text-sm text-[#5a6b66]">
            Seus lugares salvos para visitar quando quiser.
          </p>
        </header>

        {authLoading ? (
          <p className="py-8 text-center text-sm text-[#5a6b66]">
            Carregando...
          </p>
        ) : !user ? (
          <section className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <EmptyIllustration />
            <h2 className="mt-5 text-xl font-bold text-[#1a4a3a]">
              Faça login para ver seus favoritos
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
              Salve lugares especiais e acesse tudo depois com facilidade.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528]"
            >
              Fazer login
            </button>
          </section>
        ) : loadingFavoritos ? (
          <p className="py-8 text-center text-sm text-[#5a6b66]">
            Carregando favoritos...
          </p>
        ) : lugares.length === 0 ? (
          <section className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <EmptyIllustration />
            <h2 className="mt-5 text-xl font-bold text-[#1a4a3a]">
              Nenhum favorito ainda
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
              Explore o guia e toque no coração para salvar seus lugares.
            </p>
            <Link
              href="/"
              className="mt-6 block w-full rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528]"
            >
              Explorar lugares
            </Link>
          </section>
        ) : (
          <div className="grid gap-4">
            {lugares.map((lugar) => (
              <PlaceCard
                key={lugar.id}
                lugar={lugar}
                isFavorito
                onFavoritar={handleRemoverFavorito}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />

      <LoginModal
        isOpen={isModalOpen}
        motivo="favoritar"
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
