import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-[#0d5c7a] text-white shadow-lg shadow-[#0d5c7a]/25 hover:bg-[#0a4d66] focus-visible:ring-[#0d5c7a]",
  secondary:
    "bg-white/90 text-[#0d5c7a] ring-1 ring-[#0d5c7a]/20 hover:bg-white focus-visible:ring-[#0d5c7a]",
  sand: "bg-[#c4a574] text-[#1a2e28] shadow-md hover:bg-[#b89563] focus-visible:ring-[#c4a574]",
  outline:
    "bg-transparent text-[#0d5c7a] ring-2 ring-[#0d5c7a]/40 hover:bg-[#0d5c7a]/5 focus-visible:ring-[#0d5c7a]",
  ghost: "bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20 focus-visible:ring-white",
};

const BASE =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/**
 * @param {object} props
 * @param {"primary"|"secondary"|"sand"|"outline"|"ghost"} [props.variant]
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
    if (isExternal) {
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
