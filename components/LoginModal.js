"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const subtitles = {
  favoritar: "Salve seus lugares favoritos para acessar quando quiser",
  avaliar: "Compartilhe sua experiência e ajude outros viajantes",
  rotas: "Acesse rotas detalhadas com dicas exclusivas para chegar lá",
};

function IconHeart({ className = "h-9 w-9" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function IconLock({ className = "h-9 w-9" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 8h-1V6A5 5 0 007 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z" />
    </svg>
  );
}

function IconGoogle({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#fff"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#fff"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#fff"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#fff"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function IconApple({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05 1.88-3.51 1.9-1.48.02-1.95-.87-3.63-.87-1.68 0-2.2.85-3.6.89-1.44.04-2.54-1.35-3.51-2.29C2.44 16.96 1.05 12.34 2.89 8.58c.92-1.77 2.58-2.89 4.39-2.92 1.72-.03 3.34 1.16 4.4 1.16 1.05 0 3.03-1.43 5.1-1.22.87.04 3.31.35 4.87 2.64-.13.08-2.91 1.7-2.88 5.06.03 4.02 3.51 5.36 3.55 5.38-.03.09-.56 1.92-1.87 3.8zM14.88 4.78c.75-.91 1.26-2.17 1.12-3.43-1.08.04-2.39.72-3.17 1.63-.7.81-1.31 2.11-1.15 3.35 1.22.1 2.47-.62 3.2-1.55z" />
    </svg>
  );
}

export default function LoginModal({ isOpen, onClose, motivo = "favoritar" }) {
  const [loading, setLoading] = useState(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const MainIcon = motivo === "favoritar" ? IconHeart : IconLock;
  const subtitle =
    subtitles[motivo] ??
    "Salve seus lugares favoritos e acesse conteúdo exclusivo";

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return undefined;
    }

    const timeout = setTimeout(() => {
      setShouldRender(false);
      setLoading(null);
    }, 240);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!shouldRender) return null;

  async function handleOAuthSignIn(provider) {
    setLoading(provider);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setLoading(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 font-sans backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: `${isOpen ? "loginOverlayIn" : "loginOverlayOut"} 220ms ease-out forwards`,
      }}
    >
      <style>{`
        @keyframes loginOverlayIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes loginOverlayOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes loginSheetIn {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes loginSheetOut {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
      `}</style>

      <div
        className="w-full rounded-t-[24px] bg-white px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-3 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{
          animation: `${isOpen ? "loginSheetIn" : "loginSheetOut"} 240ms ease-out forwards`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d4ede8] text-[#1a4a3a]">
          <MainIcon />
        </div>

        <h2
          id="login-modal-title"
          className="mt-5 text-2xl font-bold tracking-tight text-[#1a4a3a]"
        >
          Faça login para continuar
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#5a6b66]">
          {subtitle}
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleOAuthSignIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528] disabled:opacity-70"
          >
            <IconGoogle />
            {loading === "google" ? "Redirecionando..." : "Entrar com Google"}
          </button>

          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleOAuthSignIn("apple")}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528] disabled:opacity-70"
          >
            <IconApple />
            {loading === "apple" ? "Redirecionando..." : "Entrar com Apple"}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 text-sm font-medium text-[#5a6b66] transition-colors hover:text-[#1a4a3a]"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
