import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base);
  await page.waitForFunction(() => ["done", "skip"].includes(document.querySelector(".intro")?.getAttribute("data-state")), { timeout: 7000 });
  await page.locator(".intro").waitFor({ state: "hidden" });
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator(".live-world canvas").count(), 1);
  assert.equal(await page.locator("a[href*='kanz-ai']").count(), 0);
  assert.equal(await page.locator(".site-nav").evaluate(element => getComputedStyle(element).backdropFilter), "none");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const phaseAtTop = await page.locator(".tech-script-b output").textContent();
  await page.locator("#now").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  assert.notEqual(await page.locator(".tech-script-b output").textContent(), phaseAtTop);
  await page.locator(".project-trigger").first().click();
  assert.equal(await page.locator(".project-trigger").first().getAttribute("aria-expanded"), "true");
  assert(await page.locator(".project-detail").first().isVisible());
  await page.locator(".project-trigger").first().click();
  assert.equal(await page.locator(".project-trigger").first().getAttribute("aria-expanded"), "false");
  assert.equal(await page.locator(".contact-section .contact-action").getAttribute("href"), "mailto:Adnan.Naous@outlook.com");
  assert.equal((await page.request.get(new URL("/documents/adnan-naous-cv.pdf", page.url()).href)).status(), 200);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(750);
  await page.getByRole("button", { name: "Switch to Arabic" }).click();
  assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("lang"), "ar");
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  assert.deepEqual(errors, []);
  console.log("PASS: intro, live scene, project details, contact/CV, Arabic persistence, mobile width, no page errors.");
} finally {
  await browser.close();
}
