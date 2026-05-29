import assert from "node:assert/strict";
import {
  addDaysISO,
  deveAlertarExclusao1Dia,
  deveAlertarExclusao7Dias,
  getDiasRestantesExclusao,
  getExclusaoPrevistaISO,
  isElegivelPurgeImediato,
  LUGAR_PURGE_DIAS,
} from "./lugarPurge.js";

const hoje = "2026-05-28";
const desativado = "2026-04-28";

assert.equal(getExclusaoPrevistaISO(desativado, hoje), addDaysISO(desativado, LUGAR_PURGE_DIAS));
assert.equal(getDiasRestantesExclusao(desativado, hoje), 0);
assert.equal(isElegivelPurgeImediato(desativado, hoje), true);

const desativado7d = addDaysISO(hoje, -(LUGAR_PURGE_DIAS - 7));
assert.equal(getDiasRestantesExclusao(desativado7d, hoje), 7);
assert.equal(deveAlertarExclusao7Dias(desativado7d, hoje), true);
assert.equal(deveAlertarExclusao1Dia(desativado7d, hoje), false);

const desativado1d = addDaysISO(hoje, -(LUGAR_PURGE_DIAS - 1));
assert.equal(getDiasRestantesExclusao(desativado1d, hoje), 1);
assert.equal(deveAlertarExclusao7Dias(desativado1d, hoje), false);
assert.equal(deveAlertarExclusao1Dia(desativado1d, hoje), true);

const desativado15d = addDaysISO(hoje, -15);
assert.equal(deveAlertarExclusao7Dias(desativado15d, hoje), false);
assert.equal(deveAlertarExclusao1Dia(desativado15d, hoje), false);

console.log("lugarPurge.test.js: ok");
