"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/observability";

/**
 * Error boundary de segmento (App Router).
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    reportError(error, { boundary: "app/error" });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[390px] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-semibold text-[#1a4a3a]">Algo deu errado</h1>
      <p className="text-sm text-gray-600">
        Não foi possível carregar esta página. Tente novamente.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-[#1a4a3a] px-6 py-2.5 text-sm font-medium text-white"
      >
        Tentar de novo
      </button>
    </main>
  );
}
