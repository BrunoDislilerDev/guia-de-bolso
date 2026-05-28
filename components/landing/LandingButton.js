import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-[#1a4a3a] text-white shadow-[0_1px_2px_rgba(10,22,18,0.08),0_12px_28px_rgba(26,74,58,0.28)] hover:bg-[#153d31] hover:shadow-[0_1px_2px_rgba(10,22,18,0.08),0_16px_36px_rgba(26,74,58,0.32)] active:scale-[0.98]",
  secondary:
    "landing-glass text-[#0a1612] hover:bg-white/90 active:scale-[0.98]",
  ghost:
    "bg-transparent text-[#1a4a3a] hover:bg-[#1a4a3a]/[0.06] active:scale-[0.98]",
  dark: "bg-[#0a1612] text-white shadow-lg hover:bg-[#0f2e24] active:scale-[0.98]",
};

const SIZES = {
  md: "h-11 px-5 text-[14px]",
  lg: "h-[3.25rem] px-7 text-[15px] sm:text-base",
};

const BASE =
  "inline-flex min-h-[44px] min-w-[10rem] items-center justify-center rounded-full font-medium tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4a3a]/35 focus-visible:ring-offset-2";

/**
 * @param {object} props
 * @param {"primary"|"secondary"|"ghost"|"dark"} [props.variant]
 * @param {"md"|"lg"} [props.size]
 * @param {string} [props.href]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.external]
 * @returns {import('react').ReactElement}
 */
export default function LandingButton({
  variant = "primary",
  size = "lg",
  href,
  className = "",
  children,
  external = false,
  ...rest
}) {
  const classes =
    `${BASE} ${SIZES[size] ?? SIZES.lg} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`.trim();

  if (href) {
    const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal || href.startsWith("#")) {
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
