import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3108';
const browser = await chromium.launch({ channel: 'chrome' });
const dir = '.codex/review/annotations';
await mkdir(dir, { recursive: true });
try {
  for (const [width, height, reduced] of [[1440,900,false],[1074,668,false],[393,852,false],[320,700,false],[844,390,false],[393,852,true]]) {
    const page = await browser.newPage({ viewport: { width,height }, hasTouch: width < 700, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => sessionStorage.setItem('an-os-booted','1'));
    await page.goto(base); await page.locator('.intro').waitFor({ state:'hidden' });
    await page.locator('.live-world[data-ready="true"]').waitFor(); await page.evaluate(() => document.fonts.ready);
    const jump = async id => { await page.evaluate(id => document.getElementById(id).scrollIntoView({behavior:'instant',block:'start'}), id); await page.waitForTimeout(1100); };
    assert.equal(await page.locator('.now-v2-origin-mark').count(),0);
    assert.equal(await page.locator('.now-v2-node').count(),6);
    assert.equal(await page.locator('.project-entry').count(),3);
    assert.equal(await page.locator('.story-chapter').count(),4);
    assert.equal(await page.locator('.scene-transition,.story-mask').count(),0);
    assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).userSelect),'none');
    const terminalColor = await page.locator('.terminal-secret').evaluate(e => getComputedStyle(e).backgroundColor);
    assert.equal(terminalColor,'rgb(188, 189, 187)');
    if (width >= 700 && !reduced) {
      await page.locator('.hero-title').hover();
      await page.waitForTimeout(90);
      assert.equal(await page.locator('.hero-title').getAttribute('data-text-hover'),'true');
      assert.notEqual(await page.locator('.hero-name-line').first().evaluate(e => getComputedStyle(e).textShadow),'none');
      await page.mouse.move(width-5,5);
      assert.equal(await page.locator('.hero-title').getAttribute('data-text-hover'),null);
      await page.locator('.hero-intro').hover();
      assert.equal(await page.locator('.hero-intro').getAttribute('data-text-hover'),'true');
    }
    await jump('brain');
    const brainSize = await page.locator('#brain h2').evaluate(e => parseFloat(getComputedStyle(e).fontSize));
    assert(brainSize >= (width<700?76:92));
    if (width<700) assert(brainSize<=110);
    await page.screenshot({path:`${dir}/brain-${width}-${reduced}.png`});
    await jump('work');
    if (width<700) {
      const motif = await page.locator('.project-trigger .work-motif-diagnostic').boundingBox();
      assert(motif.width<=91 && motif.height<=69,JSON.stringify(motif));
    }
    await jump('about');
    for (let i=1;i<=4;i++) {
      await page.locator(`.story-chapter-nav a[href="#story-chapter-${i}"]`).click();
      await page.waitForFunction(i => document.querySelector(`#story-chapter-${i}`)?.dataset.arriving==='true',i);
      await page.waitForTimeout(1150);
      await page.waitForFunction(i=>getComputedStyle(document.querySelector(`#story-chapter-${i} p`)).opacity==='1',i);
      assert.equal(await page.locator(`#story-chapter-${i} p`).evaluate(e=>getComputedStyle(e).opacity),'1');
      assert.notEqual(await page.locator('body').evaluate(e=>getComputedStyle(e).overflow),'hidden');
    }
    const sceneHash = () => page.locator('.live-world canvas').evaluate(c => {
      const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
      let hash=0; for(let i=0;i<d.length;i+=64) hash=(Math.imul(hash,31)+d[i]+d[i+1])>>>0; return hash;
    });
    const before=await sceneHash(); await page.waitForTimeout(1400); const after=await sceneHash();
    if (!reduced) assert.notEqual(before,after,'existing environment should move at rest');
    else assert.equal(before,after,'reduced environment should remain still');
    await page.screenshot({path:`${dir}/story-${width}-${reduced}.png`});
    await jump('contact');
    const first=page.locator('.social-line a').first();
    assert.match(await first.innerText(),/01\s+All channels/); assert.match(await first.getAttribute('href'),/linktr.ee\/VC351/);
    assert(await page.locator('.contact-action-cue').isVisible());
    assert(await page.locator('.contact-action-cue').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)<=9));
    assert.equal(await page.locator('.contact-action-arrow').evaluate(e=>getComputedStyle(e).borderStyle),'solid');
    assert(await page.locator('.site-footer').evaluate(e=>e.getBoundingClientRect().height<=100));
    await page.screenshot({path:`${dir}/contact-${width}-${reduced}.png`});
    await page.locator('[data-contact-action="email"]').click();
    await page.getByRole('dialog').waitFor();
    await page.screenshot({path:`${dir}/confirm-${width}-${reduced}.png`});
    await page.getByRole('button',{name:'No',exact:true}).click();
    assert.equal(await page.locator('[data-terminal-window]').count(),3);
    assert.equal(await page.locator('[data-terminal-window]').first().locator('..').getAttribute('aria-hidden'),'true');
    assert.equal(await page.locator('[data-terminal-window]').first().locator('..').evaluate(e=>getComputedStyle(e).zIndex),'3');
    await page.getByRole('button',{name:/Hack me/}).click();
    await page.getByRole('heading',{name:'404',exact:true}).waitFor();
    await page.waitForTimeout(2300);
    await page.screenshot({path:`${dir}/404-${width}-${reduced}.png`});
    assert.equal(await page.locator('[data-terminal-window]').first().evaluate(e=>getComputedStyle(e).opacity),'0');
    await page.getByRole('button',{name:/Refresh to reboot/}).click();
    await page.locator('.intro').waitFor({state:'hidden'});
    assert.equal(await page.locator('main').evaluate(e=>e.inert),false);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.deepEqual(errors,[]);
    await page.close(); console.log(`PASS annotation interactions, atmosphere, story, contact: ${width}×${height}${reduced?' reduced':''}`);
  }
} finally {await browser.close();}
