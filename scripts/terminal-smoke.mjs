import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const base = process.env.BASE_URL || "http://127.0.0.1:3000";

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base);
  await page.locator(".intro").waitFor({ state: "hidden" });
  await page.keyboard.press("/");
  const terminal = page.getByRole("dialog", { name: "AN/OS terminal" });
  assert(await terminal.isVisible());
  assert(await terminal.getByRole("button", { name: /write code/i }).isVisible());

  await terminal.getByRole("button", { name: /write code/i }).click();
  const editor = terminal.getByLabel("Your code");
  const output = terminal.getByRole("status");
  await editor.fill('console.log("sandbox output", 2 + 2);');
  await terminal.getByRole("button", { name: "Run code" }).click();
  await output.getByText("sandbox output 4").waitFor();
  await editor.fill("while (true) {}");
  await terminal.getByRole("button", { name: "Run code" }).click();
  await output.getByText(/Stopped after 3 seconds/).waitFor({ timeout: 5000 });
  await editor.fill('fetch("https://example.com").catch(error => console.log(error.name));');
  await terminal.getByRole("button", { name: "Run code" }).click();
  await output.getByText("TypeError").waitFor({ timeout: 5000 });
  await terminal.getByRole("button", { name: "Close code editor" }).click();

  const input = terminal.getByRole("textbox", { name: "Terminal command" });
  const searchPopup = context.waitForEvent("page");
  await input.fill("search functional portfolio");
  await input.press("Enter");
  const search = await searchPopup;
  await search.waitForURL(/duckduckgo\.com/);
  assert(new URL(search.url()).searchParams.get("q") === "functional portfolio");
  await search.close();

  const aiPopup = context.waitForEvent("page");
  await terminal.getByRole("button", { name: /free ai/i }).click();
  const ai = await aiPopup;
  await ai.waitForURL(/chatgpt\.com/);
  await ai.close();
  await input.fill("help");
  await input.press("Enter");
  assert((await terminal.textContent()).includes("code             Open the JavaScript playground"));
  await page.keyboard.press("Escape");
  assert.equal(await terminal.count(), 0);
  assert.deepEqual(errors, []);
  await context.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 700 } });
  await mobile.goto(base);
  await mobile.locator(".intro").waitFor({ state: "hidden" });
  await mobile.locator(".terminal-secret").click();
  const mobileTerminal = mobile.getByRole("dialog", { name: "AN/OS terminal" });
  await mobileTerminal.getByRole("textbox", { name: "Terminal command" }).fill("whoami");
  await mobileTerminal.getByRole("button", { name: "Run command" }).click();
  assert((await mobileTerminal.textContent()).includes("CS + AI student"));
  await mobileTerminal.getByRole("button", { name: /write code/i }).click();
  assert(await mobileTerminal.getByLabel("Your code").evaluate(node => document.activeElement === node));
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await mobile.close();
  console.log("Terminal sandbox, search, AI shortcut, keyboard, and phone controls passed");
} finally {
  await browser.close();
}
