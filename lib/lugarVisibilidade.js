/**
 * Regras de exibição do perfil do lugar no app público (V1).
 * Parceiro = destaque comercial vigente em `destaques`.
 * Básico = cadastro gratuito (sem destaque vigente).
 */

/**
 * @typedef {Object} VisibilidadePerfil
 * @property {"basico"|"completo"} perfil
 * @property {boolean} showGaleriaCompleta
 * @property {boolean} showDescricaoLonga
 * @property {boolean} showAcoesRapidasEstabelecimento
 * @property {boolean} showTags
 * @property {boolean} showBadgeParceiro
 */

/**
 * @param {boolean} ehParceiro - Destaque vigente ativo.
 * @returns {VisibilidadePerfil}
 */
export function getVisibilidadePerfil(ehParceiro) {
  if (ehParceiro) {
    return {
      perfil: "completo",
      showGaleriaCompleta: true,
      showDescricaoLonga: true,
      showAcoesRapidasEstabelecimento: true,
      showTags: true,
      showBadgeParceiro: true,
    };
  }

  return {
    perfil: "basico",
    showGaleriaCompleta: false,
    showDescricaoLonga: false,
    showAcoesRapidasEstabelecimento: false,
    showTags: false,
    showBadgeParceiro: false,
  };
}

/**
 * Fotos exibidas na página do lugar conforme o perfil.
 * @param {string[]} fotosCompletas
 * @param {string} capaUrl
 * @param {boolean} showGaleriaCompleta
 * @returns {string[]}
 */
export function getFotosParaExibicao(fotosCompletas, capaUrl, showGaleriaCompleta) {
  if (showGaleriaCompleta && fotosCompletas?.length > 0) {
    return fotosCompletas;
  }
  if (capaUrl) return [capaUrl];
  return fotosCompletas?.length ? [fotosCompletas[0]] : [];
}

/**
 * Texto da seção Sobre.
 * @param {object} lugar
 * @param {boolean} showDescricaoLonga
 * @returns {string|null}
 */
export function getTextoSobre(lugar, showDescricaoLonga) {
  if (!lugar) return null;
  if (showDescricaoLonga) {
    return lugar.descricao_longa || lugar.descricao || null;
  }
  return lugar.descricao || null;
}
