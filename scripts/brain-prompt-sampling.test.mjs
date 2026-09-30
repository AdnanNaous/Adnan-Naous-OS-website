import assert from "node:assert/strict";
import test from "node:test";
import { samplePromptIndexes } from "../src/data/brainPromptSampling.ts";

test("selects exactly three unique questions and excludes the current set", () => {
  const first = samplePromptIndexes(6, 3, [], () => 0);
  const second = samplePromptIndexes(6, 3, first, () => 0);
  assert.deepEqual(first, [0, 1, 2]);
  assert.deepEqual(second, [3, 4, 5]);
  assert.equal(new Set([...first, ...second]).size, 6);
});

test("samples a large catalog without duplicate indexes", () => {
  const selected = samplePromptIndexes(10_000, 3, [100, 200, 300], () => 0.9999);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected).size, 3);
  assert.ok(selected.every(index => index >= 0 && index < 10_000 && ![100, 200, 300].includes(index)));
});

test("falls back to the full catalog when fewer than three alternatives exist", () => {
  const selected = samplePromptIndexes(4, 3, [0, 1, 2], () => 0);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected).size, 3);
});
