import assert from "node:assert/strict";
import { rankLugaresForBusca } from "./buscaRetrieval.js";

const lugares = [
  { id: "1", nome: "Praia da Vila", categoria: "Natureza", tags: ["praia"], parceiroComercial: false },
  { id: "2", nome: "Restaurante X", categoria: "Gastronomia", tags: [], parceiroComercial: true },
];

const ranked = rankLugaresForBusca(lugares, "praia");
assert.equal(ranked[0].id, "1");

console.log("buscaRetrieval.test.js OK");
