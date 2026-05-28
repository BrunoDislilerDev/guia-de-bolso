import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectPraiaHeroCapas,
  isPraiaLugar,
  pickRandomHeroBackdrop,
} from "./landingBeachHero.js";

describe("landingBeachHero", () => {
  it("identifica praia por subcategoria", () => {
    assert.equal(isPraiaLugar({ subcategoria: "Praias", categoria: "Natureza" }), true);
    assert.equal(
      isPraiaLugar({ subcategoria: "Restaurantes", categoria: "Gastronomia" }),
      false
    );
  });

  it("prioriza capas de praia no pool", () => {
    const pool = collectPraiaHeroCapas([
      { subcategoria: "Praias", imagem_url: "https://a.test/1.jpg" },
      { categoria: "Gastronomia", imagem_url: "https://a.test/2.jpg" },
    ]);
    assert.deepEqual(pool, ["https://a.test/1.jpg"]);
  });

  it("pickRandomHeroBackdrop retorna item do pool", () => {
    const url = pickRandomHeroBackdrop(["a", "b", "c"]);
    assert.ok(["a", "b", "c"].includes(url));
  });
});
