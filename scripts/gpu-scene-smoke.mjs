import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdir} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://localhost:3108';
await mkdir('.codex/review/noir',{recursive:true});
for(const engine of process.env.TEST_WEBKIT==='1'?[chromium,webkit]:[chromium]){
 const browser=await engine.launch(engine===chromium?{channel:'chrome'}:{});
 try{
  for(const [width,height] of [[1440,900],[1074,668],[393,852],[320,700],[844,390]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<700});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>sessionStorage.setItem('an-os-booted','1'));
   await page.goto(base);await page.locator('.live-world[data-ready=true]').waitFor();
   assert.equal(await page.locator('.live-world').getAttribute('data-renderer'),'webgl');
   assert.equal(await page.locator('.live-world canvas').count(),1);
   await page.waitForTimeout(700);
   const first=await page.locator('.live-world canvas').screenshot();await page.waitForTimeout(500);
   assert.notDeepEqual(await page.locator('.live-world canvas').screenshot(),first,'Relief and seal move on the shared clock');
   await page.screenshot({path:`.codex/review/noir/${engine.name()}-home-${width}.png`});
   await page.locator('#about').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
   for(let i=1;i<=4;i++){
    await page.locator(`.story-chapter-nav a[href="#story-chapter-${i}"]`).click();
    await page.waitForFunction(i=>document.querySelector('.live-world').dataset.shot===`story-${i}`,i);
    await page.waitForTimeout(450);assert.equal(await page.locator('.story-chapter:visible').count(),1);
   }
   await page.screenshot({path:`.codex/review/noir/${engine.name()}-story-${width}.png`});
   await page.evaluate(()=>{const c=document.querySelector('.live-world canvas'),g=c.getContext('webgl');window.__lost=g.getExtension('WEBGL_lose_context');window.__lost.loseContext();});
   await page.waitForFunction(()=>document.querySelector('.live-world').dataset.renderer==='canvas2d');
   await page.setViewportSize({width:width+17,height:height+29});await page.waitForTimeout(150);
   await page.evaluate(()=>window.__lost.restoreContext());
   await page.waitForFunction(()=>document.querySelector('.live-world').dataset.renderer==='webgl');
   await page.waitForTimeout(150);
   assert.equal(await page.locator('.live-world canvas').evaluate(c=>c.getContext('webgl').getError()),0,'Restored context uses fresh objects');
   assert.equal(await page.locator('.live-world canvas').count(),1,'No duplicate surfaces after recovery');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
   await page.close();console.log(`PASS ${engine.name()} GPU movement/story/context restore ${width}x${height}`);
  }
  for(const mode of ['no-webgl','no-graphics','reduced']){
   const page=await browser.newPage({viewport:{width:393,height:852},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
   await page.addInitScript(mode=>{sessionStorage.setItem('an-os-booted','1');if(mode!=='reduced'){const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(mode==='no-graphics'||type==='webgl')return null;return get.call(this,type,...args);};}},mode);
   await page.goto(base);await page.locator(mode==='no-graphics'?'.live-world[data-fallback=true]':'.live-world[data-ready=true]').waitFor();
   assert(await page.locator('#hero-title').isVisible());
   if(mode==='no-webgl')assert.equal(await page.locator('.live-world').getAttribute('data-renderer'),'canvas2d');
   if(mode==='reduced'){
    await page.waitForTimeout(100);const before=await page.locator('.live-world canvas').screenshot();await page.waitForTimeout(500);
    assert.deepEqual(await page.locator('.live-world canvas').screenshot(),before,'OS reduced motion stays still');
   }
   await page.locator('.brain-open').click();assert(await page.getByRole('region',{name:'Brain Archive',exact:true}).isVisible());
   await page.close();console.log(`PASS ${engine.name()} ${mode} readable content/archive`);
  }
 }finally{await browser.close();}
}
