import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Browser scheduling harness: exercise the actual shared runtime without a second animation loop.
function browserRuntime({ reduced = false, mobile = false } = {}) {
  let now = 100, nextHandle = 0;
  const rafs = new Map(), timers = new Map(), styles = new Map();
  const makeEvents = () => {
    const listeners = new Map();
    return {
      addEventListener(name, callback) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback); },
      removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
      emit(name, detail = {}) { for (const callback of listeners.get(name) ?? []) callback(detail); },
      count() { return [...listeners.values()].reduce((total, callbacks) => total + callbacks.size, 0); },
    };
  };
  const window = { ...makeEvents(), scrollY: 0, innerWidth: mobile ? 390 : 1440, innerHeight: 900 };
  const ids = ["home", "brain", "work", "now", "codex", "about", "contact"];
  const nodes = ids.map((id, index) => ({ id, isConnected: true, style: { setProperty() {} }, getBoundingClientRect() { return { top: index * 1000 - window.scrollY, height: 1000 }; } }));
  const document = { ...makeEvents(), hidden: false, body: {}, documentElement: { dataset: {}, style: { setProperty(name, value) { styles.set(name, value); } } }, getElementById(id) { return nodes.find(node => node.id === id); } };
  const media = { reduced: { ...makeEvents(), matches: reduced }, coarse: { ...makeEvents(), matches: mobile } };
  const scheduleTimer = (callback, delay) => { const handle = ++nextHandle; timers.set(handle, { callback, at: now + delay }); return handle; };
  window.setTimeout = scheduleTimer;
  const sandbox = {
    window, document, performance: { now: () => now },
    matchMedia: query => query.includes("reduced") ? media.reduced : media.coarse,
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: callback => { const handle = ++nextHandle; rafs.set(handle, callback); return handle; },
    cancelAnimationFrame: handle => rafs.delete(handle),
    setTimeout: scheduleTimer, clearTimeout: handle => timers.delete(handle),
  };
  const modules = new Map();
  function load(name) {
    if (modules.has(name)) return modules.get(name).exports;
    const compiled = { exports: {} };
    modules.set(name, compiled);
    const source = readFileSync(new URL(`../src/motion/${name}.ts`, import.meta.url), "utf8");
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    vm.runInNewContext(code, { ...sandbox, module: compiled, exports: compiled.exports, require: path => load(path.replace("./", "")) }, { filename: `${name}.ts` });
    return compiled.exports;
  }
  const runtime = load("runtime");
  function run(duration) {
    for (let elapsed = 0; elapsed < duration; elapsed += 16) {
      now += 16;
      for (const [handle, timer] of [...timers]) if (timer.at <= now) { timers.delete(handle); timer.callback(); }
      for (const [handle, callback] of [...rafs]) { rafs.delete(handle); callback(now); }
    }
  }
  return { runtime, window, document, media, run, pending: () => rafs.size + timers.size };
}

test("quiet and reduced navigation updates the background without queuing a blackout", () => {
  for (const reduced of [false, true]) {
    const browser = browserRuntime({ reduced });
    const frames = [];
    const dispose = browser.runtime.subscribeMotion(frame => frames.push(frame), { continuous: true });
    browser.runtime.setMotionQuiet(true);
    browser.run(100);
    browser.window.scrollY = 6400;
    browser.window.emit("scroll");
    browser.run(1800);
    assert.equal(frames.at(-1).chapter, "contact");
    assert.equal(frames.at(-1).visualChapter, "contact");
    assert.equal("transitionState" in frames.at(-1), false);
    const ticks = browser.runtime.getMotionDiagnostics().ticks;
    browser.run(1000);
    assert.equal(browser.runtime.getMotionDiagnostics().ticks, ticks);
    assert.equal(browser.pending(), 0);
    dispose();
  }
});

test("hidden tab cancels work and resumes at the current background destination", () => {
  const browser = browserRuntime();
  const frames = [];
  const dispose = browser.runtime.subscribeMotion(frame => frames.push(frame), { continuous: true });
  browser.run(100);
  browser.window.scrollY = 2300; browser.window.emit("scroll"); browser.run(100);
  assert.equal(frames.at(-1).visualChapter, "work");
  browser.document.hidden = true; browser.document.emit("visibilitychange");
  const paused = browser.runtime.getMotionDiagnostics().ticks;
  browser.run(10_000);
  assert.equal(browser.runtime.getMotionDiagnostics().ticks, paused);
  assert.equal(browser.pending(), 0);
  browser.window.scrollY = 6400;
  browser.document.hidden = false; browser.document.emit("visibilitychange");
  browser.runtime.setMotionQuiet(true); browser.run(1800);
  assert.equal(frames.at(-1).visualChapter, "contact");
  dispose();
  assert.equal(browser.window.count(), 0);
  assert.equal(browser.document.count(), 0);
  assert.equal(browser.media.reduced.count(), 0);
  assert.equal(browser.media.coarse.count(), 0);
  assert.equal(browser.pending(), 0);
});

test("pointer creates bounded force, damps position, and relaxes after inactivity and leave", () => {
  const browser = browserRuntime();
  const frames = [];
  const dispose = browser.runtime.subscribeMotion(frame => frames.push(frame));
  browser.runtime.setMotionQuiet(true); browser.run(100);
  browser.window.emit("pointermove", { pointerType: "mouse", clientX: 720, clientY: 450 }); browser.run(48);
  browser.window.emit("pointermove", { pointerType: "mouse", clientX: 1400, clientY: 40 }); browser.run(48);
  assert.ok(frames.at(-1).pointerX > 0 && frames.at(-1).pointerX < .94, "position should approach input with damping");
  assert.ok(frames.at(-1).pointerForce > .1 && frames.at(-1).pointerForce <= 1);
  assert.ok(Math.abs(frames.at(-1).pointerVelocityX) <= 4 && Math.abs(frames.at(-1).pointerVelocityY) <= 4);
  browser.run(10_000);
  assert.ok(Math.abs(frames.at(-1).pointerX) < .001 && Math.abs(frames.at(-1).pointerY) < .001);
  assert.ok(frames.at(-1).pointerForce < .001);
  assert.equal(browser.pending(), 0);
  browser.window.emit("pointermove", { pointerType: "mouse", clientX: 0, clientY: 900 }); browser.run(150);
  browser.window.emit("pointerout", { relatedTarget: null }); browser.run(3500);
  assert.ok(Math.abs(frames.at(-1).pointerX) < .001 && Math.abs(frames.at(-1).pointerY) < .001);
  const before = frames.at(-1).pointerForce;
  browser.window.emit("pointermove", { pointerType: "mouse", clientX: 1400, clientY: 10 }); browser.run(48);
  assert.ok(frames.at(-1).pointerForce <= before + .001, "re-entry must not synthesize a fast-motion impulse");
  dispose();
});

test("bursts obey one desktop/mobile clock and a visual override preserves semantic destination", () => {
  for (const mobile of [false, true]) {
    const browser = browserRuntime({ mobile });
    const frames = [];
    const dispose = browser.runtime.subscribeMotion(frame => frames.push(frame), { continuous: true });
    browser.window.scrollY = 6400; browser.runtime.setMotionVisualChapter("brain");
    for (let i = 0; i < 150; i++) { browser.window.emit("scroll"); browser.window.emit("resize"); browser.run(16); }
    assert.ok(frames.every((frame, index) => !index || (frame.time - frames[index - 1].time) * 1000 >= (mobile ? 50 : 33.3) - .01));
    assert.equal(frames.at(-1).chapter, "contact");
    assert.equal(frames.at(-1).visualChapter, "brain");
    browser.runtime.setMotionVisualChapter(null); browser.run(1300);
    assert.equal(frames.at(-1).visualChapter, "contact");
    dispose();
    assert.equal(browser.pending(), 0);
  }
});
