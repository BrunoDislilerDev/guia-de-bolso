import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-[#1a4a3a] text-white shadow-[0_1px_2px_rgba(13,31,25,0.06),0_8px_20px_rgba(26,74,58,0.22)] hover:bg-[#153d31] active:scale-[0.98]",
  secondary:
    "bg-white text-[#0d1f19] ring-1 ring-[rgba(13,31,25,0.1)] shadow-sm hover:bg-[#fafaf9] active:scale-[0.98]",
  ghost: "bg-transparent text-[#1a4a3a] hover:bg-[#1a4a3a]/5",
  dark: "bg-[#0d1f19] text-white hover:bg-[#1a2e28] active:scale-[0.98]",
};

const SIZES = {
  md: "h-12 px-6 text-[15px]",
  lg: "h-[3.25rem] px-8 text-base",
};

const BASE =
  "inline-flex min-w-[10rem] items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4a3a]/40 focus-visible:ring-offset-2";

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
