/**
 * Extrai JSON de respostas do Claude (array ou objeto).
 * @module lib/parseModelJson
 */

/**
 * @param {string} text
 * @returns {unknown[]}
 */
export function parseJsonArrayFromText(text) {
  const trimmed = String(text || "").trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // tenta extrair array do texto
  }

  const matches = [...trimmed.matchAll(/\[[\s\S]*?\]/g)];
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(matches[i][0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // continua
    }
  }

  return [];
}

/**
 * @param {string} text
 * @returns {object|null}
 */
export function parseJsonObjectFromText(text) {
  const trimmed = String(text || "").trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // tenta extrair objeto JSON
  }

  const matches = [...trimmed.matchAll(/\{[\s\S]*?\}/g)];
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(matches[i][0]);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // continua
    }
  }

  return null;
}
