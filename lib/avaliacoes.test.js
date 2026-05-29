import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getNotaEmoji, getSentimentoEmoji } from "./avaliacoes.js";

describe("getNotaEmoji", () => {
  it("maps 1–5 stars to progressively happier faces", () => {
    assert.equal(getNotaEmoji(1), "😞");
    assert.equal(getNotaEmoji(2), "😕");
    assert.equal(getNotaEmoji(3), "😐");
    assert.equal(getNotaEmoji(4), "😊");
    assert.equal(getNotaEmoji(5), "🤩");
  });

  it("rounds fractional notes", () => {
    assert.equal(getNotaEmoji(4.6), "🤩");
    assert.equal(getNotaEmoji(2.4), "😕");
  });

  it("falls back to neutral for invalid notes", () => {
    assert.equal(getNotaEmoji(0), "😐");
    assert.equal(getNotaEmoji(null), "😐");
  });
});

describe("getSentimentoEmoji", () => {
  it("still maps IA sentiment labels for admin", () => {
    assert.equal(getSentimentoEmoji("positivo"), "😊");
    assert.equal(getSentimentoEmoji("negativo"), "😞");
    assert.equal(getSentimentoEmoji(""), "😐");
  });
});
