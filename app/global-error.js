"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/observability";

/**
 * Error boundary global (fallback de layout raiz).
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    reportError(error, { boundary: "app/global-error" });
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="bg-[#f0f4f3] antialiased">
        <main className="mx-auto flex min-h-screen max-w-[390px] flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-lg font-semibold text-[#1a4a3a]">Erro inesperado</h1>
          <p className="text-sm text-gray-600">Recarregue o app ou tente novamente.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[#1a4a3a] px-6 py-2.5 text-sm font-medium text-white"
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
}
