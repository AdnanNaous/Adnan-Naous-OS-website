import assert from "node:assert/strict";
import { chromium } from "playwright";
import { join } from "node:path";
import { tmpdir } from "node:os";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const width of [1480, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 740 : 800 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    await page.locator(".intro").waitFor({ state: "hidden" });
    await page.screenshot({ path: join(tmpdir(), `an-feedback-${width}-home.png`) });
    for (const section of ["work", "now", "contact"]) {
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(550);
      await page.screenshot({ path: join(tmpdir(), `an-feedback-${width}-${section}.png`) });
    }
    await page.getByRole("link", { name: /write an email/i }).click();
    await page.getByRole("button", { name: "No" }).click();
    await page.getByRole("dialog", { name: "You are inside the system." }).waitFor();
    await page.screenshot({ path: join(tmpdir(), `an-feedback-${width}-incident.png`) });
    await page.getByRole("button", { name: /Hack me/i }).click();
    await page.getByRole("dialog", { name: "404" }).waitFor();
    await page.screenshot({ path: join(tmpdir(), `an-feedback-${width}-404.png`) });
    assert(await page.getByRole("button", { name: /Refresh to reboot/i }).isVisible());
    await page.getByRole("button", { name: /Refresh to reboot/i }).click();
    await page.locator(".intro").waitFor({ state: "hidden" });
    await page.locator("#brain").getByRole("button", { name: /Open Archive/i }).click();
    await page.locator("#brain").getByRole("button", { name: /Why I Created Brain/i }).click();
    await page.locator("#brain").getByRole("button", { name: /What If AI Starts Developing Itself/i }).click();
    await page.screenshot({ path: join(tmpdir(), `an-feedback-${width}-brain.png`) });
    await page.locator(".terminal-secret").click();
    await page.getByRole("button", { name: /⌘ Java/i }).click();
    const frame = page.frameLocator('iframe[title="java code runner"]');
    await frame.locator("body").waitFor({ timeout: 20000 });
    await page.screenshot({ path: join(tmpdir(), `an-feedback-${width}-java.png`) });
    console.log(width, "java body text:", (await frame.locator("body").innerText()).slice(0, 130));
    await page.getByRole("button", { name: "▶ Run" }).click();
    await frame.getByText("Hello, World!", { exact: true }).waitFor({ timeout: 20000 });
    console.log(width, "java run result:", (await frame.locator("body").innerText()).slice(-120));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally { await browser.close(); }
