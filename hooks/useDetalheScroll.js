"use client";

import { useEffect, useState } from "react";

const COLLAPSE_DISTANCE = 300;
const HERO_EXPANDED_PX = 448;
const HERO_COLLAPSED_PX = 88;

/**
 * Scroll do detalhe (lugar/rota): parallax, altura do hero e header colapsável.
 * @returns {{
 *   scrollY: number,
 *   progress: number,
 *   heroHeightPx: number,
 *   parallaxY: number,
 *   headerOpacity: number,
 *   showCollapsedTitle: boolean,
 * }}
 */
export function useDetalheScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const progress = Math.min(1, Math.max(0, scrollY / COLLAPSE_DISTANCE));
  const heroHeightPx =
    HERO_EXPANDED_PX - progress * (HERO_EXPANDED_PX - HERO_COLLAPSED_PX);
  const parallaxY = scrollY * 0.42;
  const headerOpacity = Math.min(1, Math.max(0, (progress - 0.2) / 0.45));
  const showCollapsedTitle = progress > 0.35;

  return {
    scrollY,
    progress,
    heroHeightPx,
    parallaxY,
    headerOpacity,
    showCollapsedTitle,
  };
}
