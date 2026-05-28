import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-[#1a4a3a] text-white shadow-lg shadow-[#1a4a3a]/30 hover:bg-[#0f3028] focus-visible:ring-[#7fd4ae]",
  secondary:
    "bg-white text-[#1a4a3a] ring-1 ring-[#1a4a3a]/15 hover:bg-[#f0f4f3] focus-visible:ring-[#1a4a3a]",
  mint: "bg-[#7fd4ae] text-[#0c241c] shadow-lg shadow-[#7fd4ae]/25 hover:bg-[#6bc99a] focus-visible:ring-[#7fd4ae]",
  sand: "bg-[#d4ede8] text-[#1a4a3a] shadow-md hover:bg-[#c5e5dc] focus-visible:ring-[#1a4a3a]",
  outline:
    "bg-transparent text-[#1a4a3a] ring-2 ring-[#1a4a3a]/30 hover:bg-[#1a4a3a]/5 focus-visible:ring-[#1a4a3a]",
  outlineLight:
    "bg-white/10 text-white ring-1 ring-white/35 backdrop-blur-sm hover:bg-white/20 focus-visible:ring-white",
  ghost: "bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20 focus-visible:ring-white",
};

const BASE =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

/**
 * @param {object} props
 * @param {"primary"|"secondary"|"mint"|"sand"|"outline"|"outlineLight"|"ghost"} [props.variant]
 * @param {string} [props.href]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.external]
 * @returns {import('react').ReactElement}
 */
export default function LandingButton({
  variant = "primary",
  href,
  className = "",
  children,
  external = false,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`.trim();

  if (href) {
    const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
    const isHash = href.startsWith("#");

    if (isExternal) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }

    if (isHash) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
