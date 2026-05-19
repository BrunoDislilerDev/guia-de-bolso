"use client";

import { useEffect, useRef, useState } from "react";
import { hasValidCoordinates, loadGoogleMaps } from "@/lib/googleMaps";

/**
 * EnderecoMapPicker - Google Map with draggable marker for fine-tuning coordinates.
 * @param {object} props
 * @param {number|null} props.latitude
 * @param {number|null} props.longitude
 * @param {(lat: number, lng: number) => void} props.onCoordinatesChange - Called after marker drag.
 * @returns {import('react').ReactElement|null}
 */
export default function EnderecoMapPicker({
  latitude,
  longitude,
  onCoordinatesChange,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onCoordinatesChange);
  const [mapUnavailable, setMapUnavailable] = useState(false);

  onChangeRef.current = onCoordinatesChange;

  const hasCoords = hasValidCoordinates(latitude, longitude);

  useEffect(() => {
    if (!hasCoords || !mapRef.current) return undefined;

    let cancelled = false;
    setMapUnavailable(false);

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !mapRef.current || mapInstanceRef.current) return;
        setMapUnavailable(false);

        const position = {
          lat: Number(latitude),
          lng: Number(longitude),
        };

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: position,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        markerRef.current = new google.maps.Marker({
          map: mapInstanceRef.current,
          position,
          draggable: true,
        });

        markerRef.current.addListener("dragend", () => {
          const pos = markerRef.current?.getPosition();
          if (!pos) return;
          onChangeRef.current?.(pos.lat(), pos.lng());
        });
      })
      .catch(() => {
        if (!cancelled) setMapUnavailable(true);
      });

    return () => {
      cancelled = true;
    };
  }, [hasCoords]);

  useEffect(() => {
    if (!hasCoords || !mapInstanceRef.current || !markerRef.current) return;

    const position = {
      lat: Number(latitude),
      lng: Number(longitude),
    };

    markerRef.current.setPosition(position);
    mapInstanceRef.current.panTo(position);
  }, [latitude, longitude, hasCoords]);

  if (!hasCoords) return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs text-[#5a6b66]">
        Arraste o marcador para ajustar a localização exata no mapa.
      </p>
      <div
        ref={mapRef}
        className="h-[350px] w-full overflow-hidden rounded-2xl border border-[#e3e9e6]"
        aria-label="Mapa da localização"
      />
      {mapUnavailable && (
        <p className="mt-2 text-sm text-gray-400">Mapa indisponível no momento</p>
      )}
    </div>
  );
}
