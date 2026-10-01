import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, webkit } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3108';
const dir = '.codex/review/terrain-story';
await mkdir(dir, { recursive: true });
async function changedInk(page, before, after) {
  return page.evaluate(async ([a, b]) => {
    const decode = async data => { const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode(); const c = document.createElement('canvas'); c.width=image.width; c.height=image.height; const ctx=c.getContext('2d'); ctx.drawImage(image,0,0); return ctx.getImageData(0,0,c.width,c.height).data; };
    const first=await decode(a), second=await decode(b); let ink=0,changed=0;
    for(let i=0;i<first.length;i+=4) if(Math.max(first[i],second[i])>110){ink++;if(Math.abs(first[i]-second[i])>15)changed++;}
    return changed/Math.max(1,ink);
  }, [before.toString('base64'), after.toString('base64')]);
}
for(const engine of process.env.TEST_WEBKIT==='1'?[chromium,webkit]:[chromium]) {
  const browser=await engine.launch(engine===chromium?{channel:'chrome'}:{});
  try {
    for(const [width,height] of [[1440,900],[1074,668],[393,852],[320,700],[844,390]]) {
      const page=await browser.newPage({viewport:{width,height},hasTouch:width<700});
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(()=>sessionStorage.setItem('an-os-booted','1'));
      await page.goto(base); await page.locator('.live-world[data-ready="true"]').waitFor(); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1300);
      const isolate=await page.addStyleTag({content:'.live-world,.world-shade,.hero-imprint{visibility:hidden!important}#home .hero-name-line{animation:none!important}#home{--object-x:0px!important;--object-y:0px!important}'});
      const touch=engine===chromium && width<700 ? await page.context().newCDPSession(page) : null;
      for(let i=0;i<2;i++) {
        await page.mouse.move(5,5); await page.waitForTimeout(80);
        const line=page.locator('.hero-name-line').nth(i), box=await line.boundingBox();
        const before=await line.screenshot();
        if(touch) {
          const x=box.x+box.width*.55,y=box.y+box.height*.5;
          await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
          await page.waitForTimeout(80);
          await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+4,y:y+2,id:1}]});
        } else {
          await page.mouse.move(box.x+box.width*.35,box.y+box.height*.5); await page.waitForTimeout(80);
          await page.mouse.move(box.x+box.width*.6,box.y+box.height*.45,{steps:3});
        }
        await page.waitForTimeout(60);
        const after=await line.screenshot();
        const changed=await changedInk(page,before,after);
        assert(changed>.06,`${engine.name()} ${width} name ${i}: ${changed} glyph pixels visibly respond`);
        await page.screenshot({path:`${dir}/${engine.name()}-name-${i}-${width}.png`});
        if(touch)await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      }
      await page.mouse.move(5,5); await isolate.evaluate(e=>e.remove());
      await page.screenshot({path:`${dir}/${engine.name()}-home-${width}.png`});
      const sceneHash=()=>page.locator('.live-world canvas').evaluate(c=>{const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let hash=0;for(let i=0;i<a.length;i+=64)hash=(Math.imul(hash,31)+a[i])>>>0;return hash;});
      const before=await sceneHash(); await page.waitForTimeout(600); assert.notEqual(await sceneHash(),before,'Terrain moves on the existing clock');
      await page.locator('#about').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));
      for(let i=1;i<=4;i++) {
        await page.locator(`.story-chapter-nav a[href="#story-chapter-${i}"]`).click();
        await page.waitForFunction(i=>document.getElementById('about').dataset.storyCurrent===String(i),i);
        await page.waitForTimeout(500);
        assert.equal(await page.locator('.story-chapter:visible').count(),1);
        const fit=await page.locator(`#story-chapter-${i} p`).evaluate(e=>{const p=e.getBoundingClientRect(),f=document.querySelector('.story-frame-foot').getBoundingClientRect();return {bottom:p.bottom,foot:f.top,top:p.top};});
        assert(fit.bottom<=fit.foot-3,`${width} chapter ${i} fits frame: ${JSON.stringify(fit)}`);
        assert(fit.top>=0 && fit.bottom<=height,`${width} visible story stays in viewport`);
        assert.equal(await page.locator('.story-chapter[aria-hidden="true"]').count(),3);
        if(i<=2)await page.screenshot({path:`${dir}/${engine.name()}-story-${i}-${width}.png`});
      }
      // Reverse native scroll replaces the current chapter without wheel interception.
      await page.evaluate(()=>scrollBy({top:-innerHeight*.95,behavior:'instant'}));
      await page.waitForFunction(()=>Number(document.getElementById('about').dataset.storyCurrent)<4);
      assert.notEqual(await page.locator('body').evaluate(e=>getComputedStyle(e).overflow),'hidden');
      for(let index=0;index<4;index++) {
        await page.evaluate(index=>{const r=document.querySelector('.story-track').getBoundingClientRect();scrollTo({top:r.top+scrollY-innerHeight*.14+(r.height-innerHeight*.86)*(index+.4)/4,behavior:'instant'});},index);
        await page.waitForFunction(index=>document.getElementById('about').dataset.storyCurrent===String(index+1),index);
        assert.equal(await page.locator('.story-chapter:visible').count(),1);
      }
      await page.locator('.cv-command').click();
      const cv=page.getByRole('article',{name:'Curriculum vitae'}); await cv.waitFor();
      assert.equal(await cv.getByRole('heading',{level:3}).count(),6);
      assert.equal(await page.getByRole('button',{name:/^● Dot motion$/}).count(),0);
      assert((await cv.innerText()).includes('3.43/4.00'));
      assert(await cv.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=15));
      await page.screenshot({path:`${dir}/${engine.name()}-cv-${width}.png`});
      await page.keyboard.press('Escape');
      await page.locator('#contact').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'})); await page.waitForTimeout(700);
      await page.screenshot({path:`${dir}/${engine.name()}-contact-${width}.png`});
      await page.locator('[data-contact-action="email"]').click();
      // Sample in the browser before triggering the short burst. Transport and
      // screenshot latency can otherwise miss an entire 120ms window on WebKit.
      await page.evaluate(()=>{
        window.__burstPainted=false;
        const until=performance.now()+3000;
        const sample=()=>{
          if([...document.querySelectorAll('[data-terminal-window]')].some(e=>parseFloat(getComputedStyle(e).opacity)>0))window.__burstPainted=true;
          if(performance.now()<until&&!window.__burstPainted)requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      await page.getByRole('button',{name:'No',exact:true}).click();
      const windows=page.locator('[data-terminal-window]');
      assert.equal(await windows.count(),18);
      assert.equal(await windows.first().evaluate(e=>getComputedStyle(e).animationDuration),'0.12s');
      await page.waitForFunction(()=>window.__burstPainted===true);
      await page.screenshot({path:`${dir}/${engine.name()}-burst-${width}.png`});
      await page.getByRole('button',{name:/Fix the website/}).click();
      await page.waitForFunction(()=>!document.querySelector('main').inert);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
      await page.close();console.log(`PASS ${engine.name()} visible name response, animated terrain, single-frame story, readable CV: ${width}x${height}`);
    }
  } finally {await browser.close();}
}
