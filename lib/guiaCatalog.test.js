import assert from "node:assert/strict";
import test from "node:test";
import { getAllGuiaSlugs, getGuiaBySlug, GUIA_GUIDES } from "./guiaCatalog.js";

test("guia slugs are unique", () => {
  const slugs = getAllGuiaSlugs();
  assert.equal(slugs.length, new Set(slugs).size);
  assert.equal(slugs.length, GUIA_GUIDES.length);
});

test("getGuiaBySlug", () => {
  assert.ok(getGuiaBySlug("o-que-fazer-em-imbituba"));
  assert.equal(getGuiaBySlug("invalid"), undefined);
});
