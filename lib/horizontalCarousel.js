import { useEffect, useState } from "react";

/** Classes do trilho horizontal — sem scroll-smooth (evita pular vários slides). */
export const CAROUSEL_TRACK_CLASS =
  "flex h-full snap-x snap-proximity overflow-x-auto overscroll-x-contain scrollbar-hide [-webkit-overflow-scrolling:touch]";

/** Cada slide para em um snap por gesto (scroll-snap-stop: always). */
export const CAROUSEL_SLIDE_CLASS =
  "relative h-full w-full shrink-0 snap-center snap-always";

/**
 * Índice do slide visível com base na posição de scroll.
 * @param {HTMLDivElement | null} element
 * @returns {number}
 */
export function getCarouselSlideIndex(element) {
  if (!element || element.clientWidth <= 0) return 0;

  const slideWidth = element.clientWidth;
  const maxIndex = Math.max(0, Math.round(element.scrollWidth / slideWidth) - 1);
  const raw = element.scrollLeft / slideWidth;

  // Só muda de slide após ~35% do deslocamento — reduz flicker em toques acidentais.
  const index = raw - Math.floor(raw) >= 0.35 ? Math.ceil(raw) : Math.floor(raw);

  return Math.min(maxIndex, Math.max(0, index));
}

/**
 * Sincroniza índice do carrossel no scrollend (e debounce curto durante scroll).
 * @param {HTMLDivElement} element
 * @param {(index: number) => void} onIndexChange
 * @returns {() => void}
 */
export function bindCarouselScrollIndex(element, onIndexChange) {
  let debounceId = 0;

  const sync = () => {
    onIndexChange(getCarouselSlideIndex(element));
  };

  const onScroll = () => {
    window.clearTimeout(debounceId);
    debounceId = window.setTimeout(sync, 120);
  };

  element.addEventListener("scroll", onScroll, { passive: true });
  element.addEventListener("scrollend", sync, { passive: true });

  sync();

  return () => {
    window.clearTimeout(debounceId);
    element.removeEventListener("scroll", onScroll);
    element.removeEventListener("scrollend", sync);
  };
}

/**
 * Hook para carrossel horizontal com snap menos agressivo.
 * @param {import("react").RefObject<HTMLDivElement | null>} carouselRef
 * @param {number} [slideCount=0]
 * @returns {number}
 */
export function useCarouselScrollIndex(carouselRef, slideCount = 0) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const element = carouselRef.current;
    if (element) element.scrollLeft = 0;
  }, [slideCount, carouselRef]);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element || slideCount <= 1) return undefined;
    return bindCarouselScrollIndex(element, setIndex);
  }, [carouselRef, slideCount]);

  return index;
}
