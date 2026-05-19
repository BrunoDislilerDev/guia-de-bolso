let googleMapsPromise;

/**
 * Carrega o script do Google Maps (singleton) e retorna `window.google`.
 * @returns {Promise<typeof google>}
 */
export function loadGoogleMaps() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Browser only"));
  }
  if (window.google?.maps) return Promise.resolve(window.google);

  if (!googleMapsPromise) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    googleMapsPromise = new Promise((resolve, reject) => {
      if (!apiKey) {
        reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não configurada"));
        return;
      }

      const existingScript = document.querySelector("script[data-google-maps]");
      if (existingScript) {
        if (window.google?.maps) {
          resolve(window.google);
          return;
        }
        existingScript.addEventListener("load", () => resolve(window.google));
        existingScript.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = "true";
      script.onload = () => resolve(window.google);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}

/**
 * Valida se latitude e longitude são números finitos.
 * @param {unknown} latitude
 * @param {unknown} longitude
 * @returns {boolean}
 */
export function hasValidCoordinates(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  return Number.isFinite(lat) && Number.isFinite(lng);
}
