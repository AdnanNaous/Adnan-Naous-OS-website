import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser=await chromium.launch({channel:'chrome'});
const base=process.env.BASE_URL||'http://localhost:3108';
const signatures=[];
try {
  for(const [width,height] of [[1440,900],[393,852],[320,700]]) {
    const phone=width<700;
    const page=await browser.newPage({viewport:{width,height},hasTouch:phone,deviceScaleFactor:2});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>sessionStorage.setItem('an-os-booted','1'));
    await page.goto(base);await page.locator('.intro').waitFor({state:'hidden'});
    await page.locator('.live-world[data-ready="true"]').waitFor();await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('data-pulse-reduced'),'false');
    const signature={};
    signature.name=await page.locator('.hero-name-line').first().evaluate(e=>{const s=getComputedStyle(e);return [s.animationName,s.animationDuration]});
    const box=await page.locator('.hero-name-line').first().boundingBox();
    const x=box.x+box.width*.7,y=box.y+box.height*.5;
    const client=await page.context().newCDPSession(page);
    if(phone)await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    else await page.mouse.move(x,y);
    await page.waitForTimeout(160);
    assert.equal(await page.locator('.hero-title').getAttribute('data-text-hover'),'true');
    assert.notEqual(await page.locator('.hero-name-line').first().evaluate(e=>getComputedStyle(e,'::before').textShadow),'none','Optical shadow lives on the local masked copy');
    assert.match(await page.locator('.hero-name-line').first().evaluate(e=>getComputedStyle(e,'::before').maskImage),/radial-gradient/);
    assert(Math.abs(await page.locator('#home').evaluate(e=>parseFloat(e.style.getPropertyValue('--object-x'))))>.01,'Pointer or touch moves the original title on both devices');
    if(phone)await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    else await page.mouse.move(width-2,height-2);
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.hero-title').getAttribute('data-text-hover'),null,'Contact effect releases rather than sticking on phone');
    if(phone) {
      const before=await page.evaluate(()=>scrollY);
      await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width*.75,y:height*.75,id:2}]});
      for(let step=1;step<=5;step++) {await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width*.75,y:height*.75-step*45,id:2}]});await page.waitForTimeout(45);}
      await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await page.waitForFunction(before=>scrollY>before+80,before);
    }
    for(const id of ['brain','work','now','codex','about','contact']) {
      await page.evaluate(id=>document.getElementById(id).scrollIntoView({behavior:'instant'}),id);await page.waitForTimeout(1100);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      const depth=await page.locator(`#${id}`).evaluate(e=>({p:parseFloat(e.style.getPropertyValue('--object-progress')),d:parseFloat(e.style.getPropertyValue('--object-depth'))}));
      assert(Math.abs(depth.d-(depth.p-.5)*18)<.025,'Scroll depth uses the same amplitude at each width');
    }
    await page.locator('.brain-open').click();
    signature.archive=await page.locator('.brain-window-archive').evaluate(e=>{const s=getComputedStyle(e);return [s.animationName,s.animationDuration]});
    await page.locator('.brain-entry-row').first().click();
    signature.thought=await page.locator('.brain-window-thought').evaluate(e=>{const s=getComputedStyle(e);return [s.animationName,s.animationDuration]});
    assert.equal(signature.thought[0],'brain-thought-arrive');
    await page.waitForTimeout(950);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    signatures.push(signature);assert.deepEqual(errors,[]);await page.close();
    console.log(`PASS same material, scroll depth, archive motion and pointer/touch response: ${width}×${height}`);
  }
  assert.deepEqual(signatures[1],signatures[0]);assert.deepEqual(signatures[2],signatures[0]);
} finally {await browser.close();}
