/**
 * Extrai o registro de localização de um lugar (suporta relação 1:1 ou array).
 * @param {{ localizacoes?: Object|Object[] }} [lugar]
 * @returns {Object|null}
 */
export function getLocalizacaoFromLugar(lugar) {
  const localizacao = lugar?.localizacoes;

  if (Array.isArray(localizacao)) return localizacao[0] ?? null;
  return localizacao ?? null;
}

/**
 * @typedef {{ latitude: number, longitude: number }} Coordenadas
 */

/**
 * Obtém coordenadas válidas de um lugar.
 * @param {Object} lugar
 * @returns {Coordenadas|null}
 */
export function getCoordenadasLugar(lugar) {
  const localizacao = getLocalizacaoFromLugar(lugar);
  const latitude = Number(localizacao?.latitude);
  const longitude = Number(localizacao?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return { latitude, longitude };
}

/**
 * Converte graus decimais para radianos.
 * @param {number} value
 * @returns {number}
 */
function toRadians(value) {
  return (value * Math.PI) / 180;
}

/**
 * Calcula distância em linha reta entre dois pontos (fórmula de Haversine).
 * @param {Coordenadas|null} origem
 * @param {Coordenadas|null} destino
 * @returns {number|null} Distância em km, ou `null` se coordenadas inválidas.
 */
export function calcularDistanciaKm(origem, destino) {
  if (!origem || !destino) return null;

  const earthRadiusKm = 6371;
  const deltaLat = toRadians(destino.latitude - origem.latitude);
  const deltaLng = toRadians(destino.longitude - origem.longitude);
  const origemLat = toRadians(origem.latitude);
  const destinoLat = toRadians(destino.latitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(origemLat) *
      Math.cos(destinoLat) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Formata distância em km para texto amigável ("Xm de você" / "Xkm de você").
 * @param {number|null|undefined} distanciaKm
 * @returns {string|null}
 */
export function formatarDistancia(distanciaKm) {
  if (!Number.isFinite(distanciaKm)) return null;

  if (distanciaKm < 1) {
    return `${Math.max(1, Math.round(distanciaKm * 1000))}m de você`;
  }

  return `${distanciaKm.toFixed(1)}km de você`;
}

/**
 * Retorna texto de distância do lugar ao usuário, com fallback ao campo estático.
 * @param {Object} lugar
 * @param {Coordenadas|null} [userPosition]
 * @returns {string}
 */
export function getDistanciaLugar(lugar, userPosition) {
  const coordenadas = getCoordenadasLugar(lugar);
  const distanciaKm = calcularDistanciaKm(userPosition, coordenadas);

  return formatarDistancia(distanciaKm) || lugar?.distancia || "";
}

/**
 * Enriquece lugar com `distancia_calculada` baseada na posição do usuário.
 * @param {Object} lugar
 * @param {Coordenadas|null} [userPosition]
 * @returns {Object}
 */
export function withDistanciaDinamica(lugar, userPosition) {
  return {
    ...lugar,
    distancia_calculada: getDistanciaLugar(lugar, userPosition),
  };
}
