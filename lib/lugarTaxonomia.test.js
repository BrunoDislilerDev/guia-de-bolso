import assert from "node:assert/strict";
import {
  filterLugaresByCategoria,
  getEffectiveCategoria,
  normalizeLugarTaxonomia,
} from "./lugarTaxonomia.js";

const pubNatureza = {
  categoria: "Natureza",
  subcategoria: "Pubs",
  nome: "Empório Zimbeer",
};

assert.equal(getEffectiveCategoria(pubNatureza), "Noite");
assert.equal(filterLugaresByCategoria([pubNatureza], "Natureza").length, 0);
assert.equal(filterLugaresByCategoria([pubNatureza], "Noite").length, 1);
assert.equal(normalizeLugarTaxonomia(pubNatureza).categoria, "Noite");

const barGastronomia = { categoria: "Gastronomia", subcategoria: "Bares" };
assert.equal(getEffectiveCategoria(barGastronomia), "Gastronomia");

const emporioGourmet = { categoria: "Compras", subcategoria: "Empório Gourmet" };
assert.equal(getEffectiveCategoria(emporioGourmet), "Gastronomia");
assert.equal(normalizeLugarTaxonomia(emporioGourmet).categoria, "Gastronomia");

const cachoeiraCompras = { categoria: "Compras", subcategoria: "Cachoeiras" };
assert.equal(getEffectiveCategoria(cachoeiraCompras), "Natureza");
assert.equal(normalizeLugarTaxonomia(cachoeiraCompras).categoria, "Natureza");

console.log("lugarTaxonomia.test.js: ok");
