import assert from "node:assert/strict";
import {
  ensureUniqueSlug,
  isSlugAutoFromNome,
  resolveLugarSlug,
  slugifyNome,
} from "./slug.js";
import { buildQrUrl, isLugarElegivelQr } from "./lugarQr.js";
import { getSiteUrl } from "./siteUrl.js";

assert.equal(slugifyNome("Bar do Zé!"), "bar-do-ze");
assert.equal(slugifyNome("  Café & Cia  "), "cafe-cia");

const taken = new Set(["bar-do-ze", "bar-do-ze-2"]);
assert.equal(ensureUniqueSlug("bar-do-ze", taken), "bar-do-ze-3");
assert.equal(ensureUniqueSlug("bar-do-ze", taken, "bar-do-ze"), "bar-do-ze");

assert.equal(isSlugAutoFromNome("bar-do-ze", "Bar do Zé"), true);
assert.equal(isSlugAutoFromNome("bar-do-ze-2", "Bar do Zé"), true);
assert.equal(isSlugAutoFromNome("outro-nome", "Bar do Zé"), false);

assert.equal(
  resolveLugarSlug({
    nome: "Bar do Zé",
    slugAuto: true,
    lugarId: 1,
    takenSlugs: new Set(["bar-do-ze"]),
  }),
  "bar-do-ze-2"
);

assert.equal(isLugarElegivelQr({ categoria: "Gastronomia" }), true);
assert.equal(isLugarElegivelQr({ categoria: "Natureza" }), false);
assert.equal(isLugarElegivelQr({ categoria: "Aventura" }), false);

assert.equal(
  buildQrUrl("bar-do-ze", "https://guiadebolso.app"),
  "https://guiadebolso.app/q/bar-do-ze"
);

assert.equal(getSiteUrl("https://preview.vercel.app"), "https://preview.vercel.app");

console.log("qrPdf/slug/lugarQr tests OK");
