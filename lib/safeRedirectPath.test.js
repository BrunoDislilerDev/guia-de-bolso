import assert from "node:assert/strict";
import { safeRedirectPath } from "./safeRedirectPath.js";

assert.equal(safeRedirectPath("/perfil"), "/perfil");
assert.equal(safeRedirectPath("//evil.com"), "/");
assert.equal(safeRedirectPath("https://evil.com"), "/");
assert.equal(safeRedirectPath(null, "/admin"), "/admin");

console.log("safeRedirectPath.test.js OK");
