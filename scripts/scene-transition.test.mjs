import assert from "node:assert/strict";
import test from "node:test";
import { createSceneTransition } from "../src/motion/transition.ts";

const chapters = ["home", "brain", "work", "now", "codex", "about", "contact"];
const make = () => createSceneTransition("home", chapters);
function converge(controller, destination, reduced = false) {
  const frames = [];
  for (let i = 0; i < 120; i++) {
    const next = controller.advance(destination, 50, reduced);
    frames.push(next);
    if (!controller.active) break;
  }
  assert.equal(controller.active, false, "shutter must finish and release black");
  assert.equal(frames.at(-1).visualChapter, destination);
  assert.equal(frames.at(-1).transitionState.coverage, 0);
  return frames;
}
function protectedCommits(frames) {
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].visualChapter === frames[i - 1].visualChapter) continue;
    assert.equal(frames[i - 1].transitionState.coverage, 1, "a full black frame precedes every scene commit");
    assert.equal(frames[i].transitionState.coverage, 1, "scene commit stays behind black");
    assert.equal(frames[i + 1]?.transitionState.coverage, 1, "new scene has a full black frame before opening");
  }
}

test("every boundary works both ways and scene commits are protected on both sides", () => {
  const controller = make();
  const frames = [controller.snapshot()];
  for (const destination of [...chapters.slice(1), ...chapters.slice(0, -1).reverse()]) frames.push(...converge(controller, destination));
  protectedCommits(frames);
  assert.equal(frames.at(-1).visualChapter, "home");
});

test("reversing halfway through closure reopens the original world without a scene cut", () => {
  const controller = make();
  controller.advance("brain", 80);
  const halfway = controller.advance("brain", 50);
  assert.equal(halfway.transitionState.phase, "closing");
  assert.ok(halfway.transitionState.coverage > .4 && halfway.transitionState.coverage < .6);
  const frames = converge(controller, "home");
  assert.ok(frames[0].transitionState.coverage < halfway.transitionState.coverage);
  assert.ok(frames.every(frame => frame.visualChapter === "home"));
});

test("navigation jumps coalesce to the latest destination while closing", () => {
  const controller = make();
  const frames = [controller.snapshot(), controller.advance("brain", 50), controller.advance("work", 50), controller.advance("contact", 50)];
  frames.push(...converge(controller, "about"));
  assert.deepEqual([...new Set(frames.map(frame => frame.visualChapter))], ["home", "about"]);
  protectedCommits(frames);
});

test("a new target during opening closes the current aperture before committing", () => {
  const controller = make();
  const frames = [controller.snapshot()];
  do { frames.push(controller.advance("work", 50)); } while (frames.at(-1).transitionState.phase !== "opening");
  frames.push(controller.advance("work", 80));
  const aperture = frames.at(-1).transitionState.coverage;
  frames.push(controller.advance("home", 50));
  assert.equal(frames.at(-1).transitionState.phase, "closing");
  assert.ok(frames.at(-1).transitionState.coverage > aperture);
  assert.equal(frames.at(-1).visualChapter, "work");
  frames.push(...converge(controller, "home"));
  protectedCommits(frames);
});

test("a destination changed under full coverage commits the latest scene without exposing either", () => {
  const controller = make();
  const frames = [controller.snapshot()];
  do { frames.push(controller.advance("brain", 80)); } while (frames.at(-1).transitionState.phase !== "covered");
  frames.push(controller.advance("work", 50));
  frames.push(controller.advance("contact", 50));
  frames.push(...converge(controller, "contact"));
  protectedCommits(frames);
});

test("reduced motion shortens travel but retains the protected cut", () => {
  const controller = make();
  const frames = [controller.snapshot(), ...converge(controller, "contact", true)];
  assert.ok(frames.length <= 6);
  protectedCommits(frames);
});

test("hidden pause and resume, resize frames, and timing preference changes converge", () => {
  const controller = make();
  const frames = [controller.snapshot(), controller.advance("work", 50)];
  const paused = controller.snapshot();
  // Hidden pages deliver no ticks. Resize has no dimensions in this viewport-independent state.
  assert.deepEqual(controller.snapshot(), paused);
  frames.push(controller.advance("about", 0));
  assert.equal(frames.at(-1).transitionState.coverage, paused.transitionState.coverage);
  frames.push(controller.advance("contact", 20_000, true));
  frames.push(...converge(controller, "contact", true));
  protectedCommits(frames);
});

test("adversarial rapid reversals never mutate snapshots or leave a stale black scene", () => {
  const controller = make();
  const frames = [controller.snapshot()];
  const saved = structuredClone(frames[0]);
  for (let i = 0; i < 80; i++) frames.push(controller.advance(chapters[(i * 5) % chapters.length], 16 + i % 35, i % 9 === 0));
  frames.push(...converge(controller, "brain"));
  assert.deepEqual(frames[0], saved);
  assert.ok(frames.every(frame => frame.transitionState.coverage >= 0 && frame.transitionState.coverage <= 1));
  protectedCommits(frames);
});
