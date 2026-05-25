import GalleryPhotosIcon from "@/components/shared/GalleryPhotosIcon";
import { GALLERY_GLASS_PILL_CLASS } from "@/components/lugar/airbnb/lugarAirbnbTokens";

/**
 * Contador de fotos com glassmorphism estilo Apple.
 * @param {{ current: number, total: number, className?: string }} props
 * @returns {import("react").JSX.Element}
 */
export default function GalleryPhotoCounter({ current, total, className = "" }) {
  return (
    <span
      className={`${GALLERY_GLASS_PILL_CLASS} ${className}`.trim()}
      aria-label={`Foto ${current} de ${total}`}
    >
      <GalleryPhotosIcon />
      {current} / {total}
    </span>
  );
}
