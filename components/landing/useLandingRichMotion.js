"use client";

import { useEffect, useState } from "react";
import {
  defaultViewport,
  fadeInstant,
  fadeUpCinematic,
  fadeUpLite,
  liteViewport,
  scaleReveal,
  scaleRevealLite,
  staggerCinematic,
  staggerLite,
} from "@/components/landing/landingMotion";

const LANDING_ROOT_CLASS = "landing-root";

/**
 * Perfil de motion da landing (mobile-first, sem travar scroll).
 * @returns {{ richMotion: boolean, liteMotion: boolean, staticMotion: boolean }}
 */
export function useLandingMotion() {
  const [richMotion, setRichMotion] = useState(false);
  const [liteMotion, setLiteMotion] = useState(true);
  const [staticMotion, setStaticMotion] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const reducedOn = reduced.matches;
      const wideOn = wide.matches;
      setStaticMotion(reducedOn);
      setRichMotion(wideOn && !reducedOn);
      setLiteMotion(!wideOn && !reducedOn);
    };

    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector(`.${LANDING_ROOT_CLASS}`);
    if (!root) return;
    root.classList.toggle("landing-motion-lite", liteMotion);
    root.classList.toggle("landing-motion-rich", richMotion);
    return () => {
      root.classList.remove("landing-motion-lite", "landing-motion-rich");
    };
  }, [liteMotion, richMotion]);

  return { richMotion, liteMotion, staticMotion };
}

/**
 * Parallax e animações contínuas só em desktop (evita travamento no scroll mobile).
 * @returns {boolean}
 */
export function useLandingRichMotion() {
  const { richMotion } = useLandingMotion();
  return richMotion;
}

/**
 * Variantes de reveal conforme perfil (desktop cinematográfico vs mobile leve).
 * @returns {{ reveal: object, stagger: object, scaleReveal: object, viewport: import('framer-motion').ViewportOptions, skipEntrance: boolean }}
 */
export function useLandingRevealMotion() {
  const { richMotion, staticMotion } = useLandingMotion();

  if (staticMotion) {
    return {
      reveal: fadeInstant,
      stagger: staggerLite,
      scaleReveal: fadeInstant,
      viewport: defaultViewport,
      skipEntrance: true,
    };
  }

  if (!richMotion) {
    return {
      reveal: fadeUpLite,
      stagger: staggerLite,
      scaleReveal: scaleRevealLite,
      viewport: liteViewport,
      skipEntrance: false,
    };
  }

  return {
    reveal: fadeUpCinematic,
    stagger: staggerCinematic,
    scaleReveal,
    viewport: defaultViewport,
    skipEntrance: false,
  };
}
