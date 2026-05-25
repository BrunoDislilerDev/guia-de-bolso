/**
 * Ícone de galeria de fotos (moldura + paisagem).
 * @param {{ className?: string }} props
 * @returns {import("react").JSX.Element}
 */
export default function GalleryPhotosIcon({ className = "h-4 w-4 shrink-0" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" stroke="none" />
      <path d="M3 17l4.5-4.5a1.5 1.5 0 012.12 0L14 17" />
      <path d="M14 14l2-2a1.5 1.5 0 012.12 0L21 15" />
    </svg>
  );
}
