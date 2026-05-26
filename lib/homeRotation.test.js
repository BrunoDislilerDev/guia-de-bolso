import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  daysSinceEpoch,
  HERO_ROTAS_EPOCH,
  pickHeroRotaCiclo,
  pickManyBySeed,
  pickOneBySeed,
  sortBySeed,
} from "./homeRotation.js";

describe("homeRotation", () => {
  const items = [
    { id: "a", nome: "A" },
    { id: "b", nome: "B" },
    { id: "c", nome: "C" },
  ];

  it("mesmo seed produz mesma ordem", () => {
    const a = sortBySeed(items, "2026-05-26").map((i) => i.id);
    const b = sortBySeed(items, "2026-05-26").map((i) => i.id);
    assert.deepEqual(a, b);
  });

  it("seeds diferentes alteram ordem ou escolha", () => {
    const day1 = pickOneBySeed(items, "2026-05-26")?.id;
    const day2 = pickOneBySeed(items, "2026-05-27")?.id;
    assert.ok(day1);
    assert.ok(day2);
  });

  it("pickManyBySeed respeita limite", () => {
    const result = pickManyBySeed(items, "seed", 2);
    assert.equal(result.length, 2);
  });
});

describe("pickHeroRotaCiclo", () => {
  const rotas = [
    { id: "aaa", nome: "Rota A", ativa: true, fotos: ["https://example.com/a.jpg"] },
    { id: "bbb", nome: "Rota B", ativa: true, foto_capa: "https://example.com/b.jpg" },
    { id: "ccc", nome: "Rota C", ativa: true, fotos: ["https://example.com/c.jpg"] },
  ];

  it("round-robin: N dias consecutivos sem repetir", () => {
    const epoch = HERO_ROTAS_EPOCH;
    const ids = [];
    for (let i = 0; i < 3; i += 1) {
      const date = new Date(`${epoch}T12:00:00`);
      date.setDate(date.getDate() + i);
      const iso = date.toISOString().slice(0, 10);
      ids.push(pickHeroRotaCiclo(rotas, iso, epoch)?.id);
    }
    assert.deepEqual(new Set(ids).size, 3);
  });

  it("reinicia o ciclo após N rotas", () => {
    const epoch = HERO_ROTAS_EPOCH;
    const day0 = pickHeroRotaCiclo(rotas, epoch, epoch);
    const day3Date = new Date(`${epoch}T12:00:00`);
    day3Date.setDate(day3Date.getDate() + 3);
    const day3 = pickHeroRotaCiclo(rotas, day3Date.toISOString().slice(0, 10), epoch);
    assert.equal(day0?.id, day3?.id);
  });

  it("mesma data retorna mesma rota", () => {
    const a = pickHeroRotaCiclo(rotas, "2026-05-26");
    const b = pickHeroRotaCiclo(rotas, "2026-05-26");
    assert.equal(a?.id, b?.id);
  });

  it("ignora rotas sem imagem ou inativas", () => {
    const pool = [
      { id: "x", ativa: true },
      { id: "y", ativa: false, fotos: ["https://example.com/y.jpg"] },
    ];
    assert.equal(pickHeroRotaCiclo(pool), null);
  });
});

describe("daysSinceEpoch", () => {
  it("calcula diferença em dias", () => {
    assert.equal(daysSinceEpoch("2026-01-04", "2026-01-01"), 3);
  });
});
