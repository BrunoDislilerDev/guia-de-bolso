import { Suspense } from "react";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMOS_SECTIONS } from "@/lib/legalContent";

/**
 * Termos de Uso do Guia de Bolso.
 * @returns {import("react").ReactElement}
 */
export default function TermosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
          Carregando...
        </div>
      }
    >
      <LegalDocument kind="termos" title="Termos de Uso" sections={TERMOS_SECTIONS} />
    </Suspense>
  );
}
