import assert from "node:assert/strict";
import test from "node:test";
import {
  getMarketingHomePath,
  isLandingHomePath,
  resolveLandingSectionHref,
} from "./landingNav.js";

test("getMarketingHomePath", () => {
  const prev = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";
  assert.equal(getMarketingHomePath(), "/landing");
  process.env.NODE_ENV = "production";
  assert.equal(getMarketingHomePath(), "/");
  process.env.NODE_ENV = prev;
});

test("resolveLandingSectionHref from subpage", () => {
  const prev = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  assert.equal(resolveLandingSectionHref("/para-negocios", "categorias"), "/#categorias");
  assert.equal(resolveLandingSectionHref("/", "categorias"), "#categorias");
  assert.equal(isLandingHomePath("/landing"), true);
  process.env.NODE_ENV = "development";
  assert.equal(resolveLandingSectionHref("/para-negocios", "app"), "/landing#app");
  process.env.NODE_ENV = prev;
});
