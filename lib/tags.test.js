import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  deriveCategoriasFromSubcategorias,
  filterTagIdsBySubcategoria,
  filterTagsBySubcategoria,
  normalizeSubcategoriasJson,
  tagMatchesCategoria,
  tagMatchesSubcategoria,
} from "./tagSubcategorias.js";

describe("normalizeSubcategoriasJson", () => {
  it("remove duplicatas e entradas inválidas", () => {
    const result = normalizeSubcategoriasJson([
      { categoria: "Natureza", nome: "Praias" },
      { categoria: "Natureza", nome: "Praias" },
      { categoria: "", nome: "X" },
    ]);
    assert.equal(result.length, 1);
    assert.deepEqual(result[0], { categoria: "Natureza", nome: "Praias" });
  });
});

describe("tagMatchesSubcategoria", () => {
  it("corresponde quando subcategorias inclui o par", () => {
    const tag = {
      subcategorias: [{ categoria: "Natureza", nome: "Praias" }],
      categorias: ["Natureza"],
    };
    assert.equal(tagMatchesSubcategoria(tag, "Natureza", "Praias"), true);
    assert.equal(tagMatchesSubcategoria(tag, "Natureza", "Trilhas"), false);
  });

  it("usa fallback por categoria quando subcategorias vazio", () => {
    const tag = { categorias: ["Natureza"], subcategorias: [] };
    assert.equal(tagMatchesSubcategoria(tag, "Natureza", "Praias"), true);
    assert.equal(tagMatchesSubcategoria(tag, "Gastronomia", "Bares"), false);
  });

  it("retorna false sem subcategoria selecionada", () => {
    const tag = {
      subcategorias: [{ categoria: "Natureza", nome: "Praias" }],
    };
    assert.equal(tagMatchesSubcategoria(tag, "Natureza", ""), false);
  });
});

describe("filterTagsBySubcategoria", () => {
  it("filtra lista pelo par categoria + subcategoria", () => {
    const tags = [
      { id: 1, nome: "Surfe", subcategorias: [{ categoria: "Natureza", nome: "Praias" }] },
      { id: 2, nome: "Trilha curta", subcategorias: [{ categoria: "Natureza", nome: "Trilhas" }] },
    ];
    const result = filterTagsBySubcategoria(tags, "Natureza", "Praias");
    assert.equal(result.length, 1);
    assert.equal(result[0].nome, "Surfe");
  });
});

describe("filterTagIdsBySubcategoria", () => {
  it("remove ids incompatíveis", () => {
    const tags = [
      { id: 1, nome: "A", subcategorias: [{ categoria: "Natureza", nome: "Praias" }] },
      { id: 2, nome: "B", subcategorias: [{ categoria: "Natureza", nome: "Trilhas" }] },
    ];
    const ids = filterTagIdsBySubcategoria(["1", "2"], tags, "Natureza", "Praias");
    assert.deepEqual(ids, ["1"]);
  });
});

describe("deriveCategoriasFromSubcategorias", () => {
  it("extrai categorias únicas", () => {
    const cats = deriveCategoriasFromSubcategorias([
      { categoria: "Natureza", nome: "Praias" },
      { categoria: "Natureza", nome: "Trilhas" },
      { categoria: "Gastronomia", nome: "Bares" },
    ]);
    assert.deepEqual(cats.sort(), ["Gastronomia", "Natureza"]);
  });
});

describe("tagMatchesCategoria", () => {
  it("continua funcionando para compatibilidade", () => {
    assert.equal(tagMatchesCategoria({ categorias: ["Natureza"] }, "Natureza"), true);
  });
});
