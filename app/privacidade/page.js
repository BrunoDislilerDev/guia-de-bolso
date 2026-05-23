import { Suspense } from "react";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACIDADE_SECTIONS } from "@/lib/legalContent";

/**
 * Política de Privacidade do Guia de Bolso.
 * @returns {import("react").ReactElement}
 */
export default function PrivacidadePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
          Carregando...
        </div>
      }
    >
      <LegalDocument
        kind="privacidade"
        title="Política de Privacidade"
        sections={PRIVACIDADE_SECTIONS}
      />
    </Suspense>
  );
}
