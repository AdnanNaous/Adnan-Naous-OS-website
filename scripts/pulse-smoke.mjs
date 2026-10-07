import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({channel:'chrome'});
const dir = '.codex/review/pulse';
await mkdir(dir,{recursive:true});
try {
  for(const [width,height,reduced] of [[1440,900,false],[393,852,false],[393,852,true]]) {
    const page = await browser.newPage({viewport:{width,height},hasTouch:width<700,reducedMotion:reduced?'reduce':'no-preference'});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>sessionStorage.setItem('an-os-booted','1'));
    await page.goto(base);
    await page.locator('.intro').waitFor({state:'hidden'});
    await page.locator('.live-world[data-ready="true"]').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    assert(await page.evaluate(()=>document.fonts.check('600 40px "IBM Plex Mono"')));
    assert.equal(await page.locator('.project-entry').count(),3);
    assert.equal(await page.locator('.now-v2-node').count(),6);
    assert.equal(await page.locator('.story-chapter').count(),4);
    const jump=async (id,offset=0)=>{
      await page.evaluate(({id,offset})=>{const e=document.getElementById(id);scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*.16+offset,behavior:'instant'});},{id,offset});
      await page.waitForTimeout(180);
    };
    const variable=(selector,name)=>page.locator(selector).evaluate((e,name)=>getComputedStyle(e).getPropertyValue(name),name);
    await jump('brain',-height*.25);
    const early=Number(await variable('#brain','--memory-draw'));
    await jump('brain',height*.22);
    const late=Number(await variable('#brain','--memory-draw'));
    if(!reduced) assert(late>early,'Memory trace draws as the archive threshold is crossed');
    else assert.equal(late,1);
    assert.equal(await page.locator('main').evaluate(e=>e.inert),false,'A returning visitor can interact after startup, including in Strict Mode');
    await page.locator('.brain-open').click();
    const archive=page.locator('.brain-window-archive'); await archive.waitFor();
    assert.equal(await archive.evaluate(e=>getComputedStyle(e).animationName),reduced?'none':'object-archive-arrive');
    await page.locator('.brain-window-close').click();
    await jump('work');
    await page.locator('.project-trigger').first().click();
    assert.equal(await page.locator('.project-trigger').first().getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator('.project-dossier-heading').first().evaluate(e=>getComputedStyle(e).animationName),reduced?'none':'dossier-read');
    await page.locator('.project-trigger').first().click();
    await jump('now');
    await page.locator('.now-v2-node').nth(4).click();
    assert.equal(await page.locator('.now-v2-node[aria-pressed="true"]').count(),1);
    assert.match(await page.locator('.now-v2-energy').textContent(),/70%/);
    await jump('about');
    const initial=await variable('#about','--story-progress');
    await jump('story-chapter-3');
    assert.notEqual(await variable('#about','--story-progress'),initial);
    assert.equal(await page.locator('.story-chapter-nav a[aria-current="step"]').count(),1);
    assert.equal(await page.locator('.story-chapter:visible').count(),reduced?4:1);
    await page.screenshot({path:`${dir}/story-${width}${reduced?'-reduced':''}.png`});
    await jump('codex');
    await page.waitForFunction(()=>document.documentElement.dataset.chapter==='codex');
    await page.mouse.move(10,10);
    if(!reduced){
      await page.waitForTimeout(600);
      const first=Number(await variable('#codex','--codex-cycle'));
      await page.waitForTimeout(600);
      assert(Number(await variable('#codex','--codex-cycle'))>first,'Codex advances on the shared clock');
      await page.locator('.codex-play').focus();
      const paused=Number(await variable('#codex','--codex-cycle'));
      await page.waitForTimeout(750);
      assert.equal(Number(await variable('#codex','--codex-cycle')),paused,'Keyboard focus preserves the reading phase');
      await page.locator('.codex-play').click();
      assert.equal(await page.locator('.codex-play').getAttribute('aria-pressed'),'false');
    }
    await jump('home'); await page.waitForTimeout(1200);
    if(width>700&&!reduced){
      await page.mouse.move(width-40,120); await page.waitForTimeout(220);
      const x=parseFloat(await variable('.hero-title','--object-x'));
      assert(x>0&&x<=2.2,'Pointer presence stays within two pixels');
      await page.waitForTimeout(2100);
      assert(Math.abs(parseFloat(await variable('.hero-title','--object-x')))<Math.abs(x),'Pointer presence settles during reading');
    }
    assert.deepEqual(errors,[]); await page.close();
    console.log(`PASS object progression, reading pause, preservation: ${width}×${height}${reduced?' reduced':''}`);
  }
} finally {await browser.close();}
