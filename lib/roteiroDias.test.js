import assert from "node:assert/strict";
import { formatDiasViagem, parseDiasViagem } from "./roteiroDias.js";

assert.equal(parseDiasViagem("1 dia"), 1);
assert.equal(parseDiasViagem("2 dias"), 2);
assert.equal(parseDiasViagem("4+ dias"), 4);
assert.equal(parseDiasViagem(3), 3);
assert.equal(formatDiasViagem(1), "1 dia");
assert.equal(formatDiasViagem(4), "4+ dias");

console.log("roteiroDias.test.js: ok");
