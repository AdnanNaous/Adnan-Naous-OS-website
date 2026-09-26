import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome" });
const failures = [];
try {
  for (const language of ["en", "ar"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    await page.waitForFunction(() => ["done", "skip"].includes(document.querySelector(".intro")?.getAttribute("data-state")), { timeout: 7000 });
    if (language === "ar") await page.getByRole("button", { name: "Switch to Arabic" }).click();
    for (const [width, height] of [[320, 700], [360, 780], [390, 844], [430, 932], [700, 900], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => scrollTo(0, 0));
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        nav: [...document.querySelectorAll(".site-nav nav a")].every(element => element.getBoundingClientRect().width > 15),
        cta: [...document.querySelectorAll(".glass-action")].every(element => element.getBoundingClientRect().width > 100),
        font: getComputedStyle(document.body).fontFamily,
      }));
      if (layout.overflow > 1 || !layout.nav || !layout.cta || !layout.font.includes("thmanyah")) failures.push({ language, width, height, layout });
    }
    if (errors.length) failures.push({ language, errors });
    await page.close();
  }
  assert.deepEqual(failures, []);
  console.log("PASS: 20 bilingual viewport states, no horizontal overflow, usable navigation and actions, Thmanyah font.");
} finally {
  await browser.close();
}
