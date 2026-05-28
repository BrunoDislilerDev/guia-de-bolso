"use client";

import { useEffect, useState } from "react";

/**
 * Anima número até o valor final (stats da landing).
 * @param {number} target
 * @param {number} [duration=1200]
 * @returns {number}
 */
export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      const resetId = requestAnimationFrame(() => setValue(0));
      return () => cancelAnimationFrame(resetId);
    }

    const startTime = performance.now();
    let frameId = 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}
