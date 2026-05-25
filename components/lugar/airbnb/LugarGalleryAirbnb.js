"use client";

import GalleryHeroAirbnb from "@/components/shared/GalleryHeroAirbnb";

/**
 * Galeria do detalhe do lugar — wrapper sobre o hero compartilhado.
 * @param {object} props
 * @returns {import("react").JSX.Element}
 */
export default function LugarGalleryAirbnb({
  nome,
  imagens,
  isFavorito,
  onFavoritar,
  onShare,
  parceiroBadgeLabel = null,
  parallaxRef = null,
  heroActionsRef = null,
}) {
  return (
    <GalleryHeroAirbnb
      nome={nome}
      imagens={imagens}
      backHref="/"
      isFavorito={isFavorito}
      onFavoritar={onFavoritar}
      onShare={onShare}
      parceiroBadgeLabel={parceiroBadgeLabel}
      parallaxRef={parallaxRef}
      heroActionsRef={heroActionsRef}
    />
  );
}
