"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthFlow from "@/components/AuthFlow";

/**
 * Map pin icon for the login hero badge.
 * @param {{ className?: string }} props - Optional Tailwind classes.
 * @returns {import("react").ReactElement}
 */
function IconPin({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
    </svg>
  );
}

/**
 * Full-screen login page; redirects authenticated users to home.
 * @returns {import("react").ReactElement}
 */
export default function LoginPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace("/");
      } else {
        setCheckingSession(false);
      }
    });
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a4a3a] text-white">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col overflow-hidden bg-[#1a4a3a]">
        <section className="relative min-h-[50vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://picsum.photos/seed/imbituba/430/600')",
            }}
            aria-label="Paisagem de Imbituba"
            role="img"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/80" />
          <div className="relative flex h-full min-h-[50vh] flex-col justify-end px-6 pb-16">
            <h1 className="max-w-xs text-4xl font-extrabold leading-tight tracking-tight text-white">
              Tudo que você precisa,
              <span className="block text-[#b8e6d4]">na palma da sua mão</span>
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
              Praias, trilhas, restaurantes e serviços da região
            </p>
          </div>
        </section>

        <section className="relative -mt-6 flex-1 rounded-t-[24px] bg-[#1a4a3a] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-14 shadow-2xl">
          <div className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#b8e6d4] text-[#1a4a3a] shadow-xl">
            <IconPin />
          </div>
          <AuthFlow />
        </section>
      </div>
    </div>
  );
}
