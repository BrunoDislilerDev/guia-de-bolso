"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import EnderecoMapPicker from "@/components/EnderecoMapPicker";
import { loadGoogleMaps } from "@/lib/googleMaps";

const initialLocalizacao = {
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
  pais: "Brasil",
  endereco_completo: "",
  latitude: null,
  longitude: null,
};

/**
 * Extracts a single address component from Google Places results.
 * @param {object[]} components - Google address_components array.
 * @param {string} type - Component type to find.
 * @param {boolean} [shortName] - Use short_name instead of long_name.
 * @returns {string} Component value or empty string.
 */
function getAddressPart(components, type, shortName = false) {
  const component = components.find((item) => item.types.includes(type));
  return shortName ? component?.short_name ?? "" : component?.long_name ?? "";
}

/**
 * Maps a Google Geocoder place result to localizacao fields.
 * @param {object} place - Google Geocoder place object.
 * @returns {object} Parsed localization object.
 */
function parsePlace(place) {
  const components = place.address_components ?? [];
  const geometryLocation = place.geometry?.location;
  const latitude =
    typeof geometryLocation?.lat === "function" ? geometryLocation.lat() : null;
  const longitude =
    typeof geometryLocation?.lng === "function" ? geometryLocation.lng() : null;

  return {
    rua: getAddressPart(components, "route"),
    numero: getAddressPart(components, "street_number"),
    bairro:
      getAddressPart(components, "sublocality_level_1") ||
      getAddressPart(components, "sublocality") ||
      getAddressPart(components, "neighborhood"),
    cidade:
      getAddressPart(components, "administrative_area_level_2") ||
      getAddressPart(components, "locality"),
    estado: getAddressPart(components, "administrative_area_level_1", true),
    cep: getAddressPart(components, "postal_code"),
    pais: getAddressPart(components, "country") || "Brasil",
    endereco_completo: place.formatted_address ?? "",
    latitude,
    longitude,
  };
}

/**
 * Builds a human-readable full address from structured fields.
 * @param {object} localizacao - Structured address fields.
 * @returns {string} Formatted full address.
 */
function buildEnderecoCompleto(localizacao) {
  const ruaNumero = [localizacao.rua, localizacao.numero].filter(Boolean).join(", ");
  return [
    ruaNumero,
    localizacao.bairro,
    localizacao.cidade,
    localizacao.estado,
    localizacao.cep,
  ]
    .filter(Boolean)
    .join(" - ");
}

/**
 * Field - Labeled text input for address form fields.
 * @param {object} props
 * @param {string} props.label - Field label.
 * @param {string} props.value - Current value.
 * @param {(value: string) => void} props.onChange - Called when the value changes.
 * @returns {import('react').ReactElement}
 */
function Field({ label, value, onChange }) {
  return (
    <label className="block text-sm font-semibold text-[#1a2e28]">
      {label}
      <input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-[#d8dfdc] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#1a4a3a]/20 focus:ring-2"
      />
    </label>
  );
}

/**
 * EnderecoAutocomplete - Google Places autocomplete with manual fields and map picker.
 * @param {object} props
 * @param {object} [props.initialValue] - Initial localization values.
 * @param {(localizacao: object) => void} [props.onSave] - Called when address data changes.
 * @returns {import('react').ReactElement}
 */
export default function EnderecoAutocomplete({ initialValue, onSave }) {
  const [googleReady, setGoogleReady] = useState(false);
  const [query, setQuery] = useState(initialValue?.endereco_completo ?? "");
  const [localizacao, setLocalizacao] = useState({
    ...initialLocalizacao,
    ...(initialValue ?? {}),
  });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);
  const sessionTokenRef = useRef(null);

  useEffect(() => {
    loadGoogleMaps()
      .then((google) => {
        autocompleteRef.current = new google.maps.places.AutocompleteService();
        geocoderRef.current = new google.maps.Geocoder();
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        setGoogleReady(true);
      })
      .catch(() => {
        setError("Não foi possível carregar o Google Places.");
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalizacao({ ...initialLocalizacao, ...(initialValue ?? {}) });
      setQuery(initialValue?.endereco_completo ?? "");
    }, 0);

    return () => clearTimeout(timer);
  }, [initialValue]);

  useEffect(() => {
    if (!googleReady || query.trim().length < 3) {
      const timer = setTimeout(() => setSuggestions([]), 0);
      return () => clearTimeout(timer);
    }

    const timeout = setTimeout(() => {
      autocompleteRef.current?.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "br" },
          sessionToken: sessionTokenRef.current,
          types: ["address"],
        },
        (predictions) => setSuggestions(predictions ?? [])
      );
    }, 250);

    return () => clearTimeout(timeout);
  }, [googleReady, query]);

  const canUseAutocomplete = useMemo(() => googleReady && !error, [googleReady, error]);

  /**
   * Normalizes and emits the updated localization to the parent.
   * @param {object} next - Partial or full localization object.
   * @returns {void}
   */
  function emit(next) {
    const enderecoCompleto = next.endereco_completo || buildEnderecoCompleto(next);
    const value = { ...next, endereco_completo: enderecoCompleto };
    setLocalizacao(value);
    onSave?.(value);
  }

  /**
   * Updates a single address field and notifies the parent.
   * @param {string} field - Field key on localizacao.
   * @param {string} value - New field value.
   * @returns {void}
   */
  function updateField(field, value) {
    emit({ ...localizacao, [field]: value, endereco_completo: "" });
  }

  /**
   * Updates latitude and longitude from the map picker.
   * @param {number} lat - Latitude.
   * @param {number} lng - Longitude.
   * @returns {void}
   */
  function handleCoordinatesChange(lat, lng) {
    emit({
      ...localizacao,
      latitude: lat,
      longitude: lng,
    });
  }

  /**
   * Geocodes a Places prediction and fills structured address fields.
   * @param {object} prediction - Google Places prediction object.
   * @returns {void}
   */
  function handleSelect(prediction) {
    if (!geocoderRef.current) return;

    setQuery(prediction.description);
    setSuggestions([]);
    geocoderRef.current.geocode(
      { placeId: prediction.place_id },
      (results, status) => {
        if (status !== "OK" || !results?.[0]) {
          setError("Não foi possível buscar os detalhes do endereço.");
          return;
        }

        const parsed = parsePlace(results[0]);
        emit(parsed);
        setQuery(parsed.endereco_completo || prediction.description);
        sessionTokenRef.current =
          new window.google.maps.places.AutocompleteSessionToken();
      }
    );
  }

  return (
    <div className="rounded-2xl border border-[#e3e9e6] bg-[#f7faf9] p-4">
      <label className="block text-sm font-semibold text-[#1a2e28]">
        Buscar endereço
        <div className="relative">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setError("");
            }}
            placeholder="Digite rua, número, cidade..."
            className="mt-1 w-full rounded-xl border border-[#d8dfdc] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#1a4a3a]/20 focus:ring-2"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[#d8dfdc] bg-white shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className="block w-full px-3 py-2 text-left text-sm text-[#1a2e28] hover:bg-[#f0f4f3]"
                >
                  {suggestion.description}
                </button>
              ))}
            </div>
          )}
        </div>
      </label>

      {!canUseAutocomplete && (
        <p className="mt-2 text-xs text-[#d9534f]">
          {error || "Carregando endereços..."}
        </p>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Rua" value={localizacao.rua} onChange={(value) => updateField("rua", value)} />
        <Field label="Número" value={localizacao.numero} onChange={(value) => updateField("numero", value)} />
        <Field label="Bairro" value={localizacao.bairro} onChange={(value) => updateField("bairro", value)} />
        <Field label="Cidade" value={localizacao.cidade} onChange={(value) => updateField("cidade", value)} />
        <Field label="Estado" value={localizacao.estado} onChange={(value) => updateField("estado", value)} />
        <Field label="CEP" value={localizacao.cep} onChange={(value) => updateField("cep", value)} />
      </div>

      <EnderecoMapPicker
        latitude={localizacao.latitude}
        longitude={localizacao.longitude}
        onCoordinatesChange={handleCoordinatesChange}
      />
    </div>
  );
}
