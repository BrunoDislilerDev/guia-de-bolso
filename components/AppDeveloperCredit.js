import { APP_DEVELOPER } from "@/lib/appMeta";

/**
 * Crédito discreto do desenvolvedor do app.
 * @param {object} props
 * @param {string} [props.className] - Classes no wrapper.
 * @param {boolean} [props.showProductLine] - Exibe "Guia de Bolso · Imbituba" acima.
 * @param {"light" | "muted"} [props.variant] - Tom do texto (fundo escuro vs claro).
 * @returns {import("react").ReactElement}
 */
export default function AppDeveloperCredit({
  className = "",
  showProductLine = false,
  variant = "muted",
}) {
  const mutedClass =
    variant === "light" ? "text-white/55" : "text-[#9aa8a3]";
  const linkClass =
    variant === "light"
      ? "font-semibold text-white/90 underline underline-offset-2"
      : "font-semibold text-[#1a4a3a] underline underline-offset-2";

  return (
    <div className={className}>
      {showProductLine && (
        <p className={`text-center text-[10px] ${mutedClass}`}>
          Guia de Bolso · Imbituba
        </p>
      )}
      <p className={`text-center text-[10px] leading-relaxed ${mutedClass}`}>
        Desenvolvido por{" "}
        <a
          href={APP_DEVELOPER.url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {APP_DEVELOPER.name}
        </a>
      </p>
    </div>
  );
}
