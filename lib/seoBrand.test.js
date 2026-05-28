import assert from "node:assert/strict";
import test from "node:test";
import {
  GUIA_FINANCE_DISAMBIGUATION_FAQ,
  mergeGuiaFaq,
  SITE_BRAND_NAME,
} from "./seoBrand.js";

test("mergeGuiaFaq prepends disambiguation when missing", () => {
  const merged = mergeGuiaFaq([{ question: "Outra?", answer: "Sim." }]);
  assert.equal(merged[0].question, GUIA_FINANCE_DISAMBIGUATION_FAQ.question);
  assert.equal(merged.length, 2);
});

test("mergeGuiaFaq skips duplicate disambiguation", () => {
  const existing = [
    {
      question: "Guia de Bolso é o Guiabolso de finanças?",
      answer: "Não.",
    },
  ];
  const merged = mergeGuiaFaq(existing);
  assert.equal(merged.length, 1);
});

test("SITE_BRAND_NAME includes Imbituba", () => {
  assert.match(SITE_BRAND_NAME, /Imbituba/i);
});
