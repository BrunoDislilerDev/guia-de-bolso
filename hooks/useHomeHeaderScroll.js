"use client";

import { useCallback, useEffect, useRef } from "react";

const SCROLL_ON = 56;
const SCROLL_OFF = 24;

/**
 * Alterna `.is-scrolled` no shell via callback ref (sem setState).
 * @returns {(node: HTMLDivElement | null) => void}
 */
export function useHomeHeaderShellRef() {
  const cleanupRef = useRef(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  return useCallback((el) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!el) return;

    let rafId = 0;
    let isScrolled = false;

    const apply = () => {
      rafId = 0;
      const y = window.scrollY;
      let next = isScrolled;

      if (!isScrolled && y > SCROLL_ON) next = true;
      else if (isScrolled && y < SCROLL_OFF) next = false;

      if (next === isScrolled) return;
      isScrolled = next;
      el.classList.toggle("is-scrolled", next);
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });

    cleanupRef.current = () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      el.classList.remove("is-scrolled");
    };
  }, []);
}
