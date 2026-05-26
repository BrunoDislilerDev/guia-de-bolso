import assert from "node:assert/strict";
import { rankLugaresForBusca } from "./buscaRetrieval.js";

const lugares = [
  { id: "1", nome: "Praia da Vila", categoria: "Natureza", tags: ["praia"] },
  { id: "2", nome: "Restaurante X", categoria: "Gastronomia", tags: [] },
];

const ranked = rankLugaresForBusca(lugares, "praia");
assert.equal(ranked[0].id, "1");

console.log("buscaRetrieval.test.js OK");
