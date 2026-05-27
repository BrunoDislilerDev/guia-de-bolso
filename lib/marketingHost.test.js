import assert from "node:assert/strict";
import test from "node:test";
import {
  getMarketingRouteAction,
  getRequestHostname,
  isMarketingHost,
  isPublicMarketingPath,
} from "./marketingHost.js";

test("isMarketingHost", () => {
  assert.equal(isMarketingHost("guiadebolso.app"), true);
  assert.equal(isMarketingHost("www.guiadebolso.app"), true);
  assert.equal(isMarketingHost("guia-de-bolso-puce.vercel.app"), false);
  assert.equal(isMarketingHost("localhost"), false);
});

test("isPublicMarketingPath", () => {
  assert.equal(isPublicMarketingPath("/"), true);
  assert.equal(isPublicMarketingPath("/termos"), true);
  assert.equal(isPublicMarketingPath("/login"), false);
  assert.equal(isPublicMarketingPath("/lugares/foo"), false);
});

test("getMarketingRouteAction", () => {
  assert.equal(getMarketingRouteAction("/"), "rewrite-landing");
  assert.equal(getMarketingRouteAction("/landing"), "redirect-root");
  assert.equal(getMarketingRouteAction("/termos"), "continue");
  assert.equal(getMarketingRouteAction("/login"), "redirect-home");
});

test("getRequestHostname", () => {
  assert.equal(
    getRequestHostname({ headers: new Headers({ host: "guiadebolso.app:443" }) }),
    "guiadebolso.app"
  );
});
