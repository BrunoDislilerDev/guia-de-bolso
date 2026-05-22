import LegalDocument from "@/components/legal/LegalDocument";
import { TERMOS_SECTIONS } from "@/lib/legalContent";

/**
 * Termos de Uso do Guia de Bolso.
 * @returns {import("react").ReactElement}
 */
export default function TermosPage() {
  return (
    <LegalDocument kind="termos" title="Termos de Uso" sections={TERMOS_SECTIONS} />
  );
}
