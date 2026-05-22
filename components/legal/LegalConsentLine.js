import Link from "next/link";

/**
 * Linha de consentimento com links para termos e privacidade.
 * @param {object} props
 * @param {"light" | "muted"} [props.variant]
 * @returns {import("react").ReactElement}
 */
export default function LegalConsentLine({ variant = "muted" }) {
  const className =
    variant === "light"
      ? "text-center text-[11px] leading-relaxed text-white/70"
      : "text-center text-[11px] leading-relaxed text-[#9aa8a3]";

  return (
    <p className={className}>
      Ao continuar, você concorda com os{" "}
      <Link href="/termos" className="font-semibold text-[#1a4a3a] underline underline-offset-2">
        Termos de Uso
      </Link>{" "}
      e a{" "}
      <Link
        href="/privacidade"
        className="font-semibold text-[#1a4a3a] underline underline-offset-2"
      >
        Política de Privacidade
      </Link>
      .
    </p>
  );
}
