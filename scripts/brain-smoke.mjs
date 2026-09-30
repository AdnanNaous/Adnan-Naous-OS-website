import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const [width, reduced] of [[1280, false], [390, false], [390, true]]) {
    const mobile = width < 700;
    const page = await browser.newPage({ viewport: { width, height: 760 }, reducedMotion: reduced ? "reduce" : "no-preference" });
    const errors = [];
    const apiRequests = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (request.url().includes("/api/brain")) apiRequests.push(request.url()); });
    await page.goto(base);
    await page.locator(".intro").waitFor({ state: "hidden" });
    const brain = page.locator("#brain");
    const opener = brain.getByRole("button", { name: /Open Archive/i });
    await opener.click();
    const archive = brain.getByRole("region", { name: "Brain Archive" });
    await archive.waitFor();
    assert.equal(await brain.locator(".brain-window").count(), 1);
    assert.equal(await archive.locator(".brain-entry-row").count(), 3);
    const prompts = archive.locator(".brain-ask-prompt");
    await page.waitForFunction(() => document.querySelectorAll(".brain-ask-prompt").length === 3);
    const firstGroup = await prompts.allTextContents();
    assert.equal(new Set(firstGroup).size, 3, "Three distinct suggested questions");
    await prompts.first().click();
    assert(await archive.locator(".brain-ask-response").isVisible(), "Local answer opens immediately");
    assert.equal(await archive.locator(".brain-ask-sources button").count(), 1, "Answer cites a published entry");
    await archive.getByRole("button", { name: "Show me another 3 ↗", exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll(".brain-ask-prompt").length === 3);
    const nextGroup = await prompts.allTextContents();
    assert.equal(new Set(nextGroup).size, 3);
    assert(nextGroup.every(question => !firstGroup.includes(question)), "Next group excludes the previous three");
    assert.deepEqual(apiRequests, [], "Brain Q&A makes no API requests");

    const search = archive.getByRole("searchbox", { name: "SEARCH ARCHIVE" });
    await search.fill("successor");
    assert.equal(await archive.locator(".brain-entry-row").count(), 1);
    await archive.getByRole("button", { name: /What If AI Starts Developing Itself/i }).click();
    const aiThought = brain.getByRole("region", { name: "What If AI Starts Developing Itself?" });
    await aiThought.waitFor();
    assert.equal(await archive.count(), 0, "Selecting an entry replaces the archive");
    assert.equal(await brain.locator(".brain-window").count(), 1);
    await aiThought.getByRole("button", { name: /Archive/i }).click();
    await archive.waitFor();
    assert.equal(await brain.locator(".brain-window").count(), 1, "Back returns to the archive");

    await archive.press("Escape");
    await archive.waitFor({ state: "detached" });
    await page.waitForFunction(() => document.activeElement?.classList.contains("brain-open"));
    assert(await opener.evaluate(node => document.activeElement === node), "Escape returns focus to the archive opener");
    await opener.click();
    await search.fill("");
    await archive.locator(".brain-entry-row").filter({ hasText: "What If AI Became Conscious?" }).click();
    const fiction = brain.getByRole("region", { name: "What If AI Became Conscious?" });
    await fiction.waitFor();
    assert((await fiction.textContent()).includes("closer to science fiction and philosophy"));
    await fiction.getByRole("button", { name: /Close What If AI Became Conscious/i }).click();
    assert.equal(await brain.locator(".brain-window").count(), 0, "X closes the active window");

    await opener.click();
    await archive.waitFor();
    if (mobile) {
      const layout = await archive.evaluate(node => ({
        bodyOverflow: getComputedStyle(node.querySelector(".brain-window-body")).overflowY,
        bodyScrollHeight: node.querySelector(".brain-window-body").scrollHeight,
        bodyClientHeight: node.querySelector(".brain-window-body").clientHeight,
      }));
      assert.equal(layout.bodyOverflow, "visible", "Phone archive uses the page scroll");
      assert.equal(layout.bodyScrollHeight, layout.bodyClientHeight, "Phone archive has no inner scroll area");
      await archive.locator(".brain-window-body").scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => scrollY);
      const bounds = await archive.locator(".brain-window-body").boundingBox();
      await page.mouse.move(bounds.x + bounds.width / 2, Math.min(bounds.y + 80, 700));
      await page.mouse.wheel(0, 350);
      await page.waitForFunction(before => scrollY > before + 50, before);
      assert.equal(await brain.locator(".brain-window").count(), 1);
    }

    const leave = () => page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    const returnToWindow = () => archive.scrollIntoViewIfNeeded();
    await leave();
    await brain.locator(".brain-window.is-leaving").waitFor({ state: "attached" });
    assert.equal(await brain.locator(".brain-window").count(), 1, "Window remains during the leave delay");
    await returnToWindow();
    await brain.locator(".brain-window.is-leaving").waitFor({ state: "detached" });
    await page.waitForTimeout(5200);
    assert.equal(await brain.locator(".brain-window").count(), 1, "Returning cancels automatic close");
    await leave();
    await brain.locator(".brain-window.is-leaving").waitFor({ state: "attached" });
    await archive.waitFor({ state: "detached", timeout: 6500 });
    assert.equal(await brain.locator(".brain-window").count(), 0, "Window closes after about five seconds away");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log("Brain single-window replacement, closing, page scroll, leave timer, and reduced motion passed");
} finally { await browser.close(); }
