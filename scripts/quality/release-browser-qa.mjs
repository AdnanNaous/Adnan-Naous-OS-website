import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const endpoint = process.env.CDP_ENDPOINT ?? "http://127.0.0.1:9225";
const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
const outputDirectory = resolve(process.env.QA_OUTPUT_DIR ?? "release-browser-qa");

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

class CdpSession {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
    this.socket = new WebSocket(webSocketUrl);
    this.ready = new Promise((resolveReady, rejectReady) => {
      this.socket.addEventListener("open", resolveReady, { once: true });
      this.socket.addEventListener("error", rejectReady, { once: true });
    });
    this.socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const listeners = this.events.get(message.method) ?? [];
      for (const listener of listeners) listener(message.params);
    });
  }

  async call(method, params = {}) {
    await this.ready;
    const id = this.nextId++;
    const result = new Promise((resolveResult, rejectResult) => {
      this.pending.set(id, { resolve: resolveResult, reject: rejectResult });
    });
    this.socket.send(JSON.stringify({ id, method, params }));
    return result;
  }

  on(method, listener) {
    const listeners = this.events.get(method) ?? [];
    listeners.push(listener);
    this.events.set(method, listeners);
  }

  once(method, timeout = 15_000) {
    return new Promise((resolveEvent, rejectEvent) => {
      const timer = setTimeout(() => rejectEvent(new Error(`Timed out waiting for ${method}`)), timeout);
      const listener = (params) => {
        clearTimeout(timer);
        const listeners = this.events.get(method) ?? [];
        this.events.set(method, listeners.filter((candidate) => candidate !== listener));
        resolveEvent(params);
      };
      this.on(method, listener);
    });
  }

  async evaluate(expression) {
    const result = await this.call("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    }
    return result.result.value;
  }

  async navigate(url) {
    const loaded = this.once("Page.loadEventFired");
    await this.call("Page.navigate", { url });
    await loaded;
    await delay(700);
  }

  async viewport(width, height, deviceScaleFactor = 1) {
    await this.call("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor,
      mobile: width < 600,
    });
  }

  async media(features = []) {
    await this.call("Emulation.setEmulatedMedia", { media: "screen", features });
  }

  async screenshot(name) {
    const result = await this.call("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
      fromSurface: true,
    });
    const path = resolve(outputDirectory, name);
    await writeFile(path, Buffer.from(result.data, "base64"));
    return path;
  }

  close() {
    this.socket.close();
  }
}

async function createSession(url = "about:blank") {
  const response = await fetch(`${endpoint}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create browser target: ${response.status}`);
  const target = await response.json();
  const session = new CdpSession(target.webSocketDebuggerUrl);
  await session.ready;
  await Promise.all([
    session.call("Page.enable"),
    session.call("Runtime.enable"),
    session.call("Log.enable"),
    session.call("Network.enable"),
  ]);
  return session;
}

const pageAuditExpression = `(() => {
  const images = [...document.images];
  const canonical = document.querySelector('link[rel="canonical"]')?.href ?? null;
  const description = document.querySelector('meta[name="description"]')?.content ?? null;
  return {
    path: location.pathname,
    title: document.title,
    canonical,
    description,
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    nav: document.querySelectorAll('nav').length,
    skipLink: Boolean(document.querySelector('a[href="#main-content"]')),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    htmlLang: document.documentElement.lang,
    htmlDir: document.documentElement.dir,
    brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
    missingAlt: images.filter((image) => !image.hasAttribute('alt')).length,
    unsafeBlankLinks: [...document.querySelectorAll('a[target="_blank"]')].filter((link) => {
      const rel = new Set((link.getAttribute('rel') ?? '').split(/\\s+/));
      return !rel.has('noopener') || !rel.has('noreferrer');
    }).length,
    emptyLinks: [...document.querySelectorAll('a[href]')].filter((link) => {
      const href = link.getAttribute('href');
      return !href || href === '#';
    }).length,
    robots: document.querySelector('meta[name="robots"]')?.content ?? null,
    localLinks: [...document.querySelectorAll('a[href]')].map((link) => link.href).filter((href) => /^file:|localhost|127\\.0\\.0\\.1/.test(href) && !href.startsWith(location.origin)),
  };
})()`;

async function clickBySelector(session, selector) {
  return session.evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    element.click();
    return true;
  })()`);
}

async function clickButtonByText(session, text) {
  return session.evaluate(`(() => {
    const element = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim() === ${JSON.stringify(text)});
    if (!element) return false;
    element.click();
    return true;
  })()`);
}

async function run() {
  await mkdir(outputDirectory, { recursive: true });
  const session = await createSession();
  const browserErrors = [];
  const thirdPartyRequests = new Set();
  session.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    browserErrors.push(exceptionDetails.exception?.description ?? exceptionDetails.text);
  });
  session.on("Log.entryAdded", ({ entry }) => {
    if (entry.level === "error") browserErrors.push(entry.text);
  });
  session.on("Runtime.consoleAPICalled", ({ type, args }) => {
    if (type === "error") browserErrors.push(args.map((item) => item.value ?? item.description).join(" "));
  });
  session.on("Network.requestWillBeSent", ({ request }) => {
    const url = new URL(request.url);
    if (url.origin !== new URL(baseUrl).origin && ["http:", "https:"].includes(url.protocol)) {
      thirdPartyRequests.add(`${url.origin}${url.pathname}`);
    }
  });

  const routes = ["/", "/about", "/portfolio", "/services", "/blog", "/testimonials", "/contact", "/tools", "/internal/design-system"];
  const routeResults = [];
  const arabicRouteResults = [];
  await session.viewport(1440, 900);
  for (const route of routes) {
    await session.navigate(`${baseUrl}${route}`);
    routeResults.push(await session.evaluate(pageAuditExpression));
    if (["/about", "/portfolio", "/tools"].includes(route)) {
      await session.screenshot(`${route.slice(1)}-1440x900.png`);
    }
    if (route !== "/internal/design-system") {
      await clickBySelector(session, 'button[aria-label="Switch to Arabic"]');
      await delay(250);
      arabicRouteResults.push({
        ...(await session.evaluate(pageAuditExpression)),
        h1Text: await session.evaluate("document.querySelector('h1')?.textContent?.trim() ?? null"),
      });
    }
  }

  const responsiveResults = [];
  for (const [width, height] of [
    [390, 844],
    [430, 932],
    [768, 1024],
    [1024, 768],
    [1280, 800],
    [1440, 900],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await session.viewport(width, height);
    await session.navigate(baseUrl);
    responsiveResults.push({
      width,
      height,
      ...(await session.evaluate(pageAuditExpression)),
      core: await session.evaluate(`(() => {
        const stage = document.querySelector('[data-homepage-scene] [class*="stage"]');
        const canvasState = document.querySelector('[data-ai-core-motion]');
        const rect = stage?.getBoundingClientRect();
        return {
          width: rect ? Math.round(rect.width) : null,
          height: rect ? Math.round(rect.height) : null,
          motion: canvasState?.getAttribute('data-ai-core-motion') ?? null,
          active: canvasState?.getAttribute('data-ai-core-active') ?? null,
        };
      })()`),
    });
  }

  await session.viewport(1440, 900);
  await session.navigate(baseUrl);
  const desktopDark = await session.screenshot("1440x900-dark.png");
  const moreOpened = await clickButtonByText(session, "More");
  await delay(250);
  const moreState = await session.evaluate(`({
    expanded: document.querySelector('button[aria-controls="production-more-navigation"]')?.getAttribute('aria-expanded'),
    menu: Boolean(document.querySelector('#production-more-navigation')),
  })`);
  await session.call("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await delay(150);

  const themeClicked = await clickBySelector(session, 'button[aria-label="Switch to light theme"]');
  await delay(350);
  const lightState = await session.evaluate(`({
    className: document.documentElement.className,
    label: document.querySelector('button[aria-label*="theme"]')?.getAttribute('aria-label') ?? null,
  })`);
  const desktopLight = await session.screenshot("1440x900-light.png");

  await session.viewport(390, 844);
  await session.navigate(baseUrl);
  if (!(await session.evaluate(`document.documentElement.classList.contains("dark")`))) {
    await clickBySelector(session, 'button[aria-label="Switch to dark theme"]');
    await delay(250);
  }
  const mobileDark = await session.screenshot("390x844-dark.png");
  const menuOpened = await clickBySelector(session, 'button[aria-controls="production-mobile-navigation"]');
  await delay(350);
  const menuState = await session.evaluate(`({
    expanded: document.querySelector('button[aria-controls="production-mobile-navigation"]')?.getAttribute('aria-expanded'),
    panel: Boolean(document.querySelector('#production-mobile-navigation')),
    focusedTag: document.activeElement?.tagName,
    focusedHref: document.activeElement?.getAttribute('href'),
    bodyOverflow: document.body.style.overflow,
  })`);
  const mobileMenu = await session.screenshot("390x844-mobile-menu.png");
  await session.call("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await delay(500);
  const menuEscapeState = await session.evaluate(`({
    panel: Boolean(document.querySelector('#production-mobile-navigation')),
    focusRestored: document.activeElement === document.querySelector('button[aria-controls="production-mobile-navigation"]'),
    bodyOverflow: document.body.style.overflow,
  })`);
  const languageClicked = await clickBySelector(session, 'button[aria-label="Switch to Arabic"]');
  await delay(350);
  const arabicState = await session.evaluate(`({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    h1: document.querySelector('h1')?.textContent?.trim(),
    h1Count: document.querySelectorAll('h1').length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  })`);
  const mobileArabic = await session.screenshot("390x844-ar-rtl.png");

  await session.viewport(1440, 900);
  await session.media([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await session.navigate(baseUrl);
  const reducedMotionState = await session.evaluate(`({
    preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
    motion: document.querySelector('[data-ai-core-motion]')?.getAttribute('data-ai-core-motion') ?? null,
    active: document.querySelector('[data-ai-core-active]')?.getAttribute('data-ai-core-active') ?? null,
  })`);
  const reducedMotion = await session.screenshot("1440x900-reduced-motion.png");

  await session.media([{ name: "prefers-reduced-transparency", value: "reduce" }]);
  await session.navigate(baseUrl);
  const reducedTransparencyState = await session.evaluate(`({
    preference: matchMedia('(prefers-reduced-transparency: reduce)').matches,
    background: getComputedStyle(document.querySelector('[data-homepage-scene] [class*="stage"]')).backgroundColor,
  })`);
  const reducedTransparency = await session.screenshot("1440x900-reduced-transparency.png");

  await session.media([]);
  await session.navigate(baseUrl);
  const pointerBefore = await session.evaluate(`document.querySelector('[data-ai-core-active]')?.getAttribute('data-ai-core-active') ?? null`);
  await session.call("Input.dispatchMouseEvent", { type: "mouseMoved", x: 880, y: 390 });
  await delay(250);
  const pointerAfter = await session.evaluate(`document.querySelector('[data-ai-core-active]')?.getAttribute('data-ai-core-active') ?? null`);
  await session.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)");
  await delay(600);
  const scrolledCoreState = await session.evaluate(`({
    active: document.querySelector('[data-ai-core-active]')?.getAttribute('data-ai-core-active') ?? null,
    visibility: document.querySelector('[data-ai-core-visibility]')?.getAttribute('data-ai-core-visibility') ?? null,
  })`);
  await session.evaluate("window.scrollTo(0, 0)");
  await delay(600);
  const restoredCoreState = await session.evaluate(`({
    active: document.querySelector('[data-ai-core-active]')?.getAttribute('data-ai-core-active') ?? null,
    visibility: document.querySelector('[data-ai-core-visibility]')?.getAttribute('data-ai-core-visibility') ?? null,
  })`);
  const contextLossState = await session.evaluate(`(() => {
    const canvas = document.querySelector('[data-ai-core-motion] canvas');
    if (!canvas) return { attempted: false, extension: false };
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const extension = gl?.getExtension('WEBGL_lose_context');
    if (!extension) return { attempted: true, extension: false };
    extension.loseContext();
    return { attempted: true, extension: true };
  })()`);
  await delay(700);
  contextLossState.fallbackVisible = await session.evaluate(`Boolean(document.querySelector('[data-homepage-scene] [class*="fallback"] svg'))`);

  await session.viewport(1440, 900);
  await session.navigate(`${baseUrl}/tools`);
  const timerStart = await clickBySelector(session, 'button[aria-label="Start timer"]');
  await delay(250);
  const timerPauseAvailable = await session.evaluate(`Boolean(document.querySelector('button[aria-label="Pause timer"]'))`);
  const timerPause = await clickBySelector(session, 'button[aria-label="Pause timer"]');
  const timerReset = await clickBySelector(session, 'button[aria-label="Reset timer"]');
  await session.evaluate("document.body.focus()");
  await session.call("Input.dispatchKeyEvent", { type: "keyDown", key: "/", code: "Slash" });
  await session.call("Input.dispatchKeyEvent", { type: "keyUp", key: "/", code: "Slash" });
  await delay(150);
  const shortcutFocused = await session.evaluate(`document.activeElement?.id === 'command-center-search'`);
  const commandInput = await session.evaluate(`(() => {
    const input = document.querySelector('#command-center-search');
    if (!input) return { exists: false };
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'about');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return { exists: true, focused: document.activeElement === input };
  })()`);
  await delay(150);
  await session.call("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await session.call("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await delay(150);
  const commandEscape = await session.evaluate(`(() => {
    const input = document.querySelector('#command-center-search');
    return {
      value: input?.value ?? null,
      focused: document.activeElement === input,
      status: document.querySelector('[role="status"]')?.textContent?.trim() ?? null,
    };
  })()`);

  const webglFallbackSession = await createSession();
  await webglFallbackSession.call("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return original.call(this, type, ...args);
      };
    })();`,
  });
  await webglFallbackSession.viewport(1440, 900);
  await webglFallbackSession.navigate(baseUrl);
  const webglFallbackState = await webglFallbackSession.evaluate(`({
    canvas: Boolean(document.querySelector('[data-ai-core-motion] canvas')),
    fallback: Boolean(document.querySelector('[data-homepage-scene] [class*="fallback"] svg')),
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  })`);
  const webglFallback = await webglFallbackSession.screenshot("1440x900-webgl-disabled.png");
  webglFallbackSession.close();

  const result = {
    baseUrl,
    outputDirectory,
    routeResults,
    arabicRouteResults,
    responsiveResults,
    interactionResults: {
      moreOpened,
      moreState,
      themeClicked,
      lightState,
      menuOpened,
      menuState,
      menuEscapeState,
      languageClicked,
      arabicState,
      reducedMotionState,
      reducedTransparencyState,
      pointer: { before: pointerBefore, after: pointerAfter },
      visibility: { scrolled: scrolledCoreState, restored: restoredCoreState },
      contextLossState,
      timer: { timerStart, timerPauseAvailable, timerPause, timerReset },
      shortcutFocused,
      commandInput,
      commandEscape,
      webglFallbackState,
    },
    browserErrors: [...new Set(browserErrors)],
    thirdPartyRequests: [...thirdPartyRequests].sort(),
    screenshots: [
      desktopDark,
      desktopLight,
      mobileDark,
      mobileMenu,
      mobileArabic,
      reducedMotion,
      reducedTransparency,
      webglFallback,
    ],
  };

  await writeFile(resolve(outputDirectory, "release-browser-qa.json"), `${JSON.stringify(result, null, 2)}\n`);
  session.close();
  console.log(JSON.stringify(result, null, 2));
}

await run();
