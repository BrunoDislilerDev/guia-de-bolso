/**
 * Seta voltar (chevron) — padrão do app para navegação “voltar”.
 * @param {{ className?: string }} props
 * @returns {import("react").ReactElement}
 */
export default function IconBack({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
