/** Caminho público do logo (SVG na UI; PNG para ícones do sistema). */
export const LOGO_SRC = "/logo.svg";
export const LOGO_PNG_SRC = "/logo.png";

const SIZE_HEIGHT = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
};

const SIZE_CLASS = {
  xs: "h-6 w-auto",
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-14 w-auto",
};

/**
 * Logo do Guia de Bolso (ícone SVG em `public/logo.svg`).
 * @param {object} props
 * @param {"xs"|"sm"|"md"|"lg"} [props.size="md"]
 * @param {"default"|"light"} [props.variant="default"] - `light` para fundos escuros.
 * @param {string} [props.className]
 * @param {boolean} [props.priority] - Carregamento prioritário (login/onboarding).
 * @param {boolean} [props.showWordmark] - Exibe texto ao lado do ícone.
 * @returns {import("react").ReactElement}
 */
export default function Logo({
  size = "md",
  variant = "default",
  className = "",
  priority = false,
  showWordmark = false,
}) {
  const height = SIZE_HEIGHT[size] ?? SIZE_HEIGHT.md;
  const sizeClass = SIZE_CLASS[size] ?? SIZE_CLASS.md;
  const variantClass = variant === "light" ? "brightness-0 invert" : "";

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Guia de Bolso"
      role="img"
      width={height}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={`shrink-0 ${sizeClass} ${variantClass} ${className}`.trim()}
    />
  );

  if (!showWordmark) {
    return img;
  }

  const wordmarkClass =
    variant === "light"
      ? "text-sm font-bold tracking-tight text-white"
      : "text-sm font-bold tracking-tight text-[#1a4a3a]";

  return (
    <span className="inline-flex items-center gap-2">
      {img}
      <span className={wordmarkClass}>Guia de Bolso</span>
    </span>
  );
}
