#!/usr/bin/env node
/**
 * Regenera favicons e ícones do app a partir de public/logo.png.
 * Uso: node scripts/refresh-brand-icons.mjs
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public/logo.png");

if (!existsSync(src)) {
  console.error("Arquivo não encontrado:", src);
  process.exit(1);
}

/** @param {string} out @param {number} size */
function resize(out, size) {
  execSync(`sips -z ${size} ${size} "${src}" --out "${out}"`, { stdio: "inherit" });
}

resize(join(root, "app/icon.png"), 512);
resize(join(root, "app/apple-icon.png"), 180);
resize(join(root, "public/favicon-32.png"), 32);
resize(join(root, "public/apple-touch-icon.png"), 180);
resize(join(root, "public/icon-192.png"), 192);

console.log("Ícones atualizados a partir de public/logo.png");
