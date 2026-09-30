import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, webkit } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3000';
const output = '.codex/review/type-reference';
await mkdir(output, { recursive: true });
const engines = process.env.TEST_WEBKIT === '1' ? [chromium, webkit] : [chromium];

// Inspect rendered pixels: CSS declarations alone cannot detect missing filtered glyphs.
async function ink(page, screenshot) {
  return page.evaluate(async encoded => {
    const image = new Image(); image.src = `data:image/png;base64,${encoded}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height).data;
    let visible = 0, neutral = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = pixels.slice(i, i + 3);
      if (Math.min(r, g, b) > 110) {
        visible++;
        if (Math.max(r, g, b) - Math.min(r, g, b) < 5) neutral++;
      }
    }
    return { visible, neutral };
  }, screenshot.toString('base64'));
}

for (const engine of engines) {
  const browser = await engine.launch(engine === chromium ? { channel: 'chrome' } : {});
  try {
    for (const [width, height, reduced] of [[1440, 900, false], [393, 852, false], [320, 700, false], [393, 852, true]]) {
      const page = await browser.newPage({ viewport: { width, height }, hasTouch: width < 700, reducedMotion: reduced ? 'reduce' : 'no-preference' });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => sessionStorage.setItem('an-os-booted', '1'));
      await page.goto(base); await page.locator('.intro').waitFor({ state: 'hidden' });
      await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1250);
      const isolatedPaint = await page.addStyleTag({ content: '.live-world,.world-shade,.hero-imprint{visibility:hidden!important}' });
      const lines = page.locator('.hero-name-line[data-type-material]');
      assert.equal(await lines.count(), 2);
      assert.equal(await page.locator('h1').textContent(), 'AdnanNaous.');
      assert.deepEqual(await page.locator('main>section').evaluateAll(es => es.map(e => e.id)), ['home', 'brain', 'work', 'now', 'codex', 'about', 'contact']);
      const bounds = await lines.evaluateAll(es => es.map(e => { const r = e.getBoundingClientRect(); return [r.width, r.height, r.left, r.top]; }));
      const positions = [];
      for (const time of reduced ? [0] : [0, 1450, 2900, 7000]) {
        await lines.evaluateAll((es, time) => es.forEach(e => e.getAnimations().filter(a => a.animationName === 'type-material-light').forEach(a => { a.pause(); a.currentTime = time; })), time);
        await page.waitForTimeout(40);
        positions.push(await lines.first().evaluate(e => getComputedStyle(e).backgroundPosition));
        for (let index = 0; index < 2; index++) {
          const paint = await ink(page, await lines.nth(index).screenshot());
          const minimum = bounds[index][0] * bounds[index][1] * .065;
          assert(paint.visible > minimum, `${engine.name()} ${width} line ${index}: glyphs survive light phase ${time}`);
          assert(paint.neutral / paint.visible > .985, 'Light stays monochrome');
        }
      }
      if (!reduced) assert.notEqual(positions[0], positions[2], 'The light actually travels across glyphs');
      if (reduced) assert((await lines.evaluateAll(es => es.map(e => getComputedStyle(e).animationName))).every(name => name === 'none'));
      else {
        await page.evaluate(() => { document.documentElement.dataset.pulsePaused = 'true'; });
        assert((await lines.evaluateAll(es => es.map(e => getComputedStyle(e).animationPlayState))).every(s => s.split(',').every(part => part.trim() === 'paused')));
        await page.evaluate(() => { delete document.documentElement.dataset.pulsePaused; });
      }
      await isolatedPaint.evaluate(e => e.remove());
      await page.screenshot({ path: `${output}/${engine.name()}-${width}${reduced ? '-reduced' : ''}.png` });
      await page.addStyleTag({ content: '.live-world,.world-shade,.hero-imprint{visibility:hidden!important}' });
      const fallback = await page.addStyleTag({ content: '#home .hero-name-line[data-type-material]{filter:none!important;background:none!important;-webkit-text-fill-color:currentColor!important;color:#f4f4f4!important;animation:none!important}' });
      const plainBounds = await lines.evaluateAll(es => es.map(e => { const r = e.getBoundingClientRect(); return [r.width, r.height, r.left, r.top]; }));
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) assert(Math.abs(bounds[i][j] - plainBounds[i][j]) < 1, 'Material preserves original text geometry');
        assert((await ink(page, await lines.nth(i).screenshot())).visible > plainBounds[i][0] * plainBounds[i][1] * .065, 'Plain text fallback stays readable');
      }
      await fallback.evaluate(e => e.remove());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.deepEqual(errors, []); await page.close();
      console.log(`PASS ${engine.name()} material pixels, phases, geometry and fallback: ${width}x${height}${reduced ? ' reduced' : ''}`);
    }
    const staticPage = await browser.newPage({ viewport: { width: 393, height: 852 }, javaScriptEnabled: false });
    await staticPage.goto(base); await staticPage.evaluate(() => document.fonts.ready);
    assert.equal(await staticPage.locator('h1').textContent(), 'AdnanNaous.');
    await staticPage.evaluate(() => { const style = document.createElement('style'); style.textContent = '.live-world,.world-shade,.hero-imprint{visibility:hidden!important}'; document.head.appendChild(style); });
    const staticInk = await ink(staticPage, await staticPage.locator('h1').screenshot());
    await staticPage.evaluate(() => { const style = document.createElement('style'); style.textContent = '#home .hero-name-line[data-type-material]{filter:none!important}'; document.head.appendChild(style); });
    const unfilteredInk = await ink(staticPage, await staticPage.locator('h1').screenshot());
    assert(unfilteredInk.visible > 1000 && staticInk.visible > unfilteredInk.visible * .85, 'SSR material retains the browser\'s original glyph fill without JavaScript');
    await staticPage.close();
    console.log(`PASS ${engine.name()} no-JavaScript name rendering`);
  } finally { await browser.close(); }
}
