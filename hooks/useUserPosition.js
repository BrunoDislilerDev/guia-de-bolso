"use client";

import { useEffect, useState } from "react";

/**
 * Geolocalização do usuário (compartilhada entre home, explorar e detalhe).
 * @param {{ maximumAge?: number, timeout?: number }} [options]
 * @returns {{ userPosition: { latitude: number, longitude: number } | null }}
 */
export function useUserPosition(options = {}) {
  const { maximumAge = 5 * 60 * 1000, timeout = 10000 } = options;
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return undefined;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: false, maximumAge, timeout }
    );

    return undefined;
  }, [maximumAge, timeout]);

  return { userPosition };
}
