"use client";

import { useEffect, useState } from "react";

/**
 * Parallax e animações contínuas só em desktop (evita travamento no scroll mobile).
 * @returns {boolean}
 */
export function useLandingRichMotion() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setEnabled(wide.matches && !reduced.matches);
    };

    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
