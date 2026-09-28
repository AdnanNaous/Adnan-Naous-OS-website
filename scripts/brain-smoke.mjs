import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const [width, reduced] of [[1280, false], [390, false], [390, true]]) {
    const page = await browser.newPage({ viewport: { width, height: 760 }, reducedMotion: reduced ? "reduce" : "no-preference" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    await page.locator(".intro").waitFor({ state: "hidden" });
    const brain = page.locator("#brain");
    await brain.getByRole("button", { name: /Open Archive/i }).click();
    const archive = brain.getByRole("region", { name: "Brain Archive" });
    await archive.waitFor();
    assert.equal(await archive.locator(".brain-entry-row").count(), 3);
    const search = archive.getByRole("searchbox", { name: "SEARCH ARCHIVE" });
    await search.fill("successor");
    assert.equal(await archive.locator(".brain-entry-row").count(), 1);
    await archive.getByRole("button", { name: /What If AI Starts Developing Itself/i }).click();
    const aiThought = brain.getByRole("region", { name: "What If AI Starts Developing Itself?" });
    await aiThought.waitFor();
    assert(await archive.isVisible(), "Archive should remain open below a thought");
    await search.fill("");
    await archive.getByRole("button", { name: /What If AI Became Conscious/i }).click();
    const fiction = brain.getByRole("region", { name: "What If AI Became Conscious?" });
    await fiction.waitFor();
    assert((await fiction.textContent()).includes("closer to science fiction and philosophy"));
    const beforeZ = Number(await archive.evaluate(node => getComputedStyle(node).zIndex));
    await archive.locator(".brain-window-bar").click();
    assert(Number(await archive.evaluate(node => getComputedStyle(node).zIndex)) > beforeZ);
    const titles = await brain.locator(".brain-window").count();
    await page.evaluate(() => scrollBy(0, 75));
    await page.waitForTimeout(260);
    assert.equal(await brain.locator(".brain-window").count(), titles, "Scrolling must preserve opened windows");
    await fiction.getByRole("button", { name: /Close What If AI Became Conscious/i }).click();
    await fiction.waitFor({ state: "detached" });
    assert.equal(await brain.locator(".brain-window").count(), 2);
    assert(await archive.isVisible());
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log("Brain archive search, window stacking/closing, scroll persistence, and mobile/reduced motion passed");
} finally { await browser.close(); }
