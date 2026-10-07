import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";
import { chromium } from "playwright";

const baseURL = process.env.BASE_URL || "http://localhost:3000";
const output = process.env.POINTER_SCREENSHOT_DIR || path.join(tmpdir(), "an-os-pointer-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const errors = [];
const trackErrors = page => page.on("pageerror", error => errors.push(error.message));

async function assertHotspot(page, x, y) {
  await page.mouse.move(x, y);
  const state = await page.locator(".scene-sight").evaluate(sight => ({
    x: parseFloat(sight.style.getPropertyValue("--sight-x")),
    y: parseFloat(sight.style.getPropertyValue("--sight-y")),
    active: sight.dataset.active,
    opacity: getComputedStyle(sight).opacity,
    interactive: getComputedStyle(sight).pointerEvents,
    top: sight.matches(":popover-open"),
  }));
  // CDP hit targets use doubles; browser PointerEvent coordinates are float32.
  // A thousandth of a pixel permits that conversion without permitting visible lag.
  assert(Math.abs(state.x-x)<.001, "Physical x must not lag behind input");
  assert(Math.abs(state.y-y)<.001, "Physical y must not lag behind input");
  assert.equal(state.active, "true");
  assert.equal(state.opacity, "1");
  assert.equal(state.interactive, "none");
  assert.equal(state.top, true, "Cursor must paint above the maximum-z Contact portal");
}

async function hoverControl(page, control) {
  await control.hover();
  const rect = await control.boundingBox();
  await assertHotspot(page, rect.x + rect.width / 2, rect.y + rect.height / 2);
  assert.equal(await page.locator(".scene-sight").getAttribute("data-control"), "true");
  assert(await control.evaluate(node => {
    const rect = node.getBoundingClientRect();
    return node.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  }), "Cursor must not intercept a real click target");
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  trackErrors(page);
  await page.goto(baseURL);
  await page.locator(".intro").waitFor({ state: "hidden" });
  assert.match(await page.title(), /Adnan Naous/);
  assert(await page.locator("#hero-title").isVisible());
  assert.equal(await page.locator("nextjs-portal [data-nextjs-dialog]").count(), 0, "No framework error overlay");
  await assertHotspot(page, 115, 110);
  await assertHotspot(page, 1130, 730);
  const email = page.getByRole("link", { name: /write an email/i });
  await hoverControl(page, email);
  await email.click();
  const no = page.getByRole("button", { name: "No", exact: true });
  await hoverControl(page, no);
  assert.equal(await page.locator("main").evaluate(node => node.inert), true);
  await page.keyboard.press("Tab");
  assert(await page.getByRole("dialog").evaluate(node => node.contains(document.activeElement)));
  await page.screenshot({ path: path.join(output, "contact-confirm.png") });
  await no.click();
  const fix = page.getByRole("button", { name: /Fix the website/i });
  await fix.waitFor();
  await hoverControl(page, fix);
  await page.screenshot({ path: path.join(output, "contact-recovery.png") });
  await fix.click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.waitForFunction(() => scrollY === 0);
  assert.equal(await page.locator("main").evaluate(node => node.inert), false);
  assert(await page.locator("#hero-title").evaluate(node => document.activeElement === node));
  assert.equal(await page.locator(".scene-sight").getAttribute("data-active"), "true");
  await assertHotspot(page, 700, 340);
  await email.click();
  await page.getByRole("button", { name: "No", exact: true }).click();
  const hack = page.getByRole("button", { name: /Hack me/i });
  await hack.waitFor();
  await hoverControl(page, hack);
  await hack.click();
  const reboot = page.getByRole("button", { name: /Refresh to reboot/i });
  await reboot.waitFor();
  await hoverControl(page, reboot);
  await page.screenshot({ path: path.join(output, "hack-locked.png") });
  await page.keyboard.press("Escape");
  assert(await page.getByRole("dialog", { name: "404" }).isVisible());
  await reboot.click();
  await page.locator(".intro").waitFor({ state: "hidden" });
  assert.equal(await page.getByRole("dialog").count(), 0);
  await assertHotspot(page, 640, 380);

  // Exercise the real cursor module in isolation to cover dispose/remount and
  // unsupported Popover API behavior without exposing test hooks in the app.
  const source = await readFile(new URL("../src/motion/cursor.ts", import.meta.url), "utf8");
  const javascript = ts.transpileModule(source.replace("export function mountSceneCursor", "function mountSceneCursor"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  }).outputText;
  const css = await readFile(new URL("../src/app/scene-cursor.css", import.meta.url), "utf8");
  for (const fallback of [false, true]) {
    const isolated = await browser.newPage({ viewport: { width: 800, height: 600 } });
    trackErrors(isolated);
    await isolated.setContent('<button id="target">Click target</button><textarea aria-label="Editor"></textarea>');
    if (fallback) await isolated.evaluate(() => { HTMLElement.prototype.showPopover = undefined; });
    await isolated.addStyleTag({ content: css });
    await isolated.addScriptTag({ content: javascript + "\nwindow.disposeCursor = mountSceneCursor();" });
    await isolated.mouse.move(420, 240);
    const remounted = await isolated.evaluate(() => {
      const previous = document.querySelector(".scene-sight").style.cssText;
      window.disposeCursor(); window.disposeCursor = mountSceneCursor();
      return { previous, current: document.querySelector(".scene-sight").style.cssText,
        count: document.querySelectorAll(".scene-sight").length, active: document.querySelector(".scene-sight").dataset.active };
    });
    assert.equal(remounted.previous, remounted.current, "Reconstruction must preserve the last physical position");
    assert.equal(remounted.count, 1);
    assert.equal(remounted.active, "true");
    await isolated.evaluate(() => {
      const overlay = document.createElement("div");
      overlay.id = "overlay";
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:#050505";
      document.body.append(overlay);
    });
    if (fallback) assert.equal(await isolated.evaluate(() => document.body.lastElementChild.className), "scene-sight");
    else assert.equal(await isolated.locator(".scene-sight").evaluate(node => node.matches(":popover-open")), true);
    await isolated.locator("#overlay").evaluate(node => node.remove());
    await isolated.getByRole("textbox", { name: "Editor" }).hover();
    assert.equal(await isolated.getByRole("textbox", { name: "Editor" }).evaluate(node => getComputedStyle(node).cursor), "text");
    assert.equal(await isolated.locator(".scene-sight").getAttribute("data-editing"), "true");
    await isolated.getByRole("textbox", { name: "Editor" }).fill("keyboard editor stays usable");
    await isolated.evaluate(() => window.disposeCursor());
    assert.equal(await isolated.locator(".scene-sight").count(), 0);
    assert.equal(await isolated.evaluate(() => document.documentElement.dataset.scenePointer), undefined);
    await isolated.close();
  }

  const mobile = await browser.newPage({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  trackErrors(mobile);
  await mobile.goto(baseURL);
  await mobile.locator(".intro").waitFor({ state: "hidden" });
  await mobile.getByRole("link", { name: /write an email/i }).tap();
  await mobile.getByRole("button", { name: "No", exact: true }).tap();
  await mobile.getByRole("button", { name: /Fix the website/i }).waitFor();
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  assert.equal(await mobile.locator(".scene-sight").getAttribute("data-active"), "false", "Touch release must hide transient pointer");
  assert.equal(await mobile.evaluate(() => document.documentElement.dataset.scenePointer), undefined);
  await mobile.screenshot({ path: path.join(output, "mobile-recovery.png") });
  await mobile.getByRole("button", { name: /Fix the website/i }).tap();
  await mobile.getByRole("dialog").waitFor({ state: "detached" });
  await mobile.waitForFunction(() => scrollY === 0);
  assert.deepEqual(errors, []);
  console.log(`Pointer overlays, recovery, remount, fallback, editors and touch passed. Screenshots: ${output}`);
} finally {
  await browser.close();
}
