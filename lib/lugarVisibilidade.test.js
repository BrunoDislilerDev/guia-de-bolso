import assert from "node:assert/strict";
import { getVisibilidadePerfil } from "./lugarVisibilidade.js";

const parceiro = getVisibilidadePerfil(true);
const gratuito = getVisibilidadePerfil(false);

assert.equal(parceiro.perfil, "completo");
assert.equal(gratuito.perfil, "completo");
assert.equal(parceiro.showTags, true);
assert.equal(gratuito.showTags, true);
assert.equal(parceiro.showGaleriaCompleta, true);
assert.equal(gratuito.showGaleriaCompleta, true);
assert.equal(parceiro.showAcoesRapidasEstabelecimento, true);
assert.equal(gratuito.showAcoesRapidasEstabelecimento, true);
assert.equal(parceiro.showBadgeParceiro, true);
assert.equal(gratuito.showBadgeParceiro, false);

console.log("lugarVisibilidade tests OK");
