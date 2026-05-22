import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACIDADE_SECTIONS } from "@/lib/legalContent";

/**
 * Política de Privacidade do Guia de Bolso.
 * @returns {import("react").ReactElement}
 */
export default function PrivacidadePage() {
  return (
    <LegalDocument
      kind="privacidade"
      title="Política de Privacidade"
      sections={PRIVACIDADE_SECTIONS}
    />
  );
}
