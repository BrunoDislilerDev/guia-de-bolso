"use client";

import { useEffect, useRef } from "react";

const COLLAPSE_DISTANCE = 300;
const HERO_EXPANDED_PX = 448;
const HERO_COLLAPSED_PX = 88;
const PARALLAX_FACTOR = 0.22;

/**
 * Scroll do detalhe (lugar): atualiza DOM via rAF para evitar re-render e flicker no parallax.
 * @returns {{
 *   heroShellRef: import("react").RefObject<HTMLDivElement|null>,
 *   parallaxRef: import("react").RefObject<HTMLDivElement|null>,
 *   heroActionsRef: import("react").RefObject<HTMLDivElement|null>,
 *   stickyHeaderRef: import("react").RefObject<HTMLElement|null>,
 * }}
 */
export function useDetalheScroll() {
  const heroShellRef = useRef(null);
  const parallaxRef = useRef(null);
  const heroActionsRef = useRef(null);
  const stickyHeaderRef = useRef(null);
  const rafIdRef = useRef(0);

  useEffect(() => {
    const applyScroll = () => {
      const y = window.scrollY;
      const progress = Math.min(1, Math.max(0, y / COLLAPSE_DISTANCE));
      const heroHeight =
        HERO_EXPANDED_PX - progress * (HERO_EXPANDED_PX - HERO_COLLAPSED_PX);

      if (heroShellRef.current) {
        heroShellRef.current.style.height = `${heroHeight}px`;
      }

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(0, ${-(y * PARALLAX_FACTOR)}px, 0)`;
      }

      if (heroActionsRef.current) {
        const actionsOpacity = Math.max(0, 1 - (progress - 0.15) / 0.35);
        const hideActions = progress > 0.22;
        heroActionsRef.current.style.opacity = String(actionsOpacity);
        heroActionsRef.current.style.pointerEvents = hideActions ? "none" : "auto";
        heroActionsRef.current.style.visibility = hideActions ? "hidden" : "visible";
      }

      if (stickyHeaderRef.current) {
        const headerOpacity = Math.min(1, Math.max(0, (progress - 0.2) / 0.45));
        const showHeader = progress > 0.35 && headerOpacity > 0.05;
        stickyHeaderRef.current.style.opacity = showHeader ? String(headerOpacity) : "0";
        stickyHeaderRef.current.style.transform = showHeader
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, -8px, 0)";
        stickyHeaderRef.current.style.pointerEvents = showHeader ? "auto" : "none";
        stickyHeaderRef.current.setAttribute(
          "aria-hidden",
          showHeader ? "false" : "true"
        );
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(applyScroll);
    };

    applyScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { heroShellRef, parallaxRef, heroActionsRef, stickyHeaderRef };
}
