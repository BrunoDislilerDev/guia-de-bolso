import assert from "node:assert/strict";
import test from "node:test";
import {
  SITE_CONTACT_EMAIL,
  SITE_DOMAIN,
  SITE_PUBLIC_URL,
  SOCIAL_LINKS,
  getSiteDisplayDomain,
} from "./siteContact.js";

test("constantes de contato e domínio", () => {
  assert.equal(SITE_DOMAIN, "guiadebolso.app");
  assert.equal(SITE_PUBLIC_URL, "https://guiadebolso.app");
  assert.equal(SITE_CONTACT_EMAIL, "contato@guiadebolso.app");
  assert.equal(SOCIAL_LINKS.instagram, "https://www.instagram.com/guiadebolsoimbituba/");
  assert.equal(SOCIAL_LINKS.tiktok, "https://www.tiktok.com/@guiadebolsoimbituba");
});

test("getSiteDisplayDomain", () => {
  assert.equal(getSiteDisplayDomain("https://guiadebolso.app/q/foo"), "guiadebolso.app");
  assert.equal(getSiteDisplayDomain("https://www.guiadebolso.app"), "guiadebolso.app");
});
