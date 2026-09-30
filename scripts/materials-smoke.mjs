import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const base=process.env.BASE_URL || 'http://127.0.0.1:3000';
const browser=await chromium.launch({channel:'chrome'});
const dir='.codex/review/physics'; await mkdir(dir,{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.setDefaultTimeout(10000);
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{sessionStorage.setItem('an-os-booted','1');});
 await page.goto(base); await page.locator('.intro').waitFor({state:'hidden'});
 await page.waitForFunction(()=>document.querySelector('.optical-titles')?.dataset.captured==='7');
 const jump=async id=>{await page.evaluate(id=>{const e=document.getElementById(id); scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*.15,behavior:'instant'});},id); await page.waitForFunction(id=>document.querySelector('.live-world')?.dataset.chapter===id&&document.querySelector('.scene-transition')?.dataset.phase==='idle',id);};
 // Observe rendered frames, rather than asserting implementation internals.
 await page.evaluate(()=>{window.__sceneHistory=[];let active=true; const sample=()=>{if(!active)return; const mask=document.querySelector('.scene-transition'); window.__sceneHistory.push({world:document.querySelector('.live-world')?.dataset.chapter,covered:mask?.dataset.covered==='true',phase:mask?.dataset.phase});requestAnimationFrame(sample);}; sample(); window.__stopSceneSample=()=>{active=false;};});
 for(const id of ['contact','home','work','brain','now','about','codex','home'])await jump(id);
 await page.evaluate(()=>window.__stopSceneSample());
 const history=await page.evaluate(()=>window.__sceneHistory);
 let commits=0; for(let i=1;i<history.length;i++)if(history[i].world!==history[i-1].world){assert(history[i].covered&&history[i-1].covered,'Scene changed only after a fully covered rendered frame');commits++;}
 assert(commits>=7);
 // Reversal while the first shutter is still closing must converge without a stuck screen.
 for(const id of ['contact','home','brain','contact','now','home']){await page.evaluate(id=>scrollTo({top:document.getElementById(id).offsetTop,behavior:'instant'}),id);await page.waitForTimeout(55);}
 await jump('home');
 assert.equal(await page.locator('.scene-transition').getAttribute('data-covered'),'false');
 await page.screenshot({path:`${dir}/home-desktop.png`});
 await page.mouse.move(130,260);await page.mouse.move(590,340,{steps:4});await page.mouse.move(220,270,{steps:3});
 await page.waitForFunction(()=>Number(document.querySelector('.optical-titles')?.dataset.energy)>.02);
 await page.screenshot({path:`${dir}/home-active.png`});
 await page.mouse.move(1400,890);await page.waitForTimeout(4000);
 assert(Number(await page.locator('.optical-titles').getAttribute('data-energy'))<.03,'Pointer material relaxes to rest');
 const sizes=process.env.FOCUSED_LANDSCAPE?[[844,390]]:[[1920,1080],[1680,1050],[1440,900],[1366,768],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[360,780],[320,700],[844,390]];
 for(const [width,height] of sizes){
  await page.setViewportSize({width,height});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);
  await jump('contact');
  const contact=await page.evaluate(()=>{const r=s=>{const x=document.querySelector(s).getBoundingClientRect();return {left:x.left,right:x.right,width:x.width};};return {section:r('.contact-content'),title:r('#contact-title'),action:r('.contact-transmission'),social:r('.social-line'),overflow:document.documentElement.scrollWidth-innerWidth,w:innerWidth};});
  assert(contact.overflow<=1,`Overflow ${width}`);assert(contact.action.left>=0&&contact.action.right<=width+1,`Contact action bounds ${width}`);assert(Math.abs(contact.action.left-contact.section.left)<2,`Contact actual grid alignment ${width}`);assert(contact.social.right<=width+1);
  await jump('about');
  for(let i=0;i<4;i++){
   await page.getByRole('button',{name:new RegExp(`Read chapter ${i+1}:`)}).click();
   try{await page.waitForFunction(i=>document.querySelector('.story-stage')?.dataset.story===String(i)&&document.querySelector('.story-stage')?.dataset.historyPhase==='idle',i);}catch(error){console.log('STORY FAILURE',width,height,i,await page.evaluate(()=>({stage:document.querySelector('.story-stage').dataset,chapter:document.documentElement.dataset.chapter,style:document.querySelector('.story-stage').getAttribute('style'),scroll:scrollY})));throw error;}
   const regions=await page.evaluate(()=>{const r=s=>{const x=document.querySelector(s).getBoundingClientRect();return {top:x.top,bottom:x.bottom,left:x.left,right:x.right};};return {text:r('.story-panel.is-active'),environment:r('.story-memory'),code:r('.story-code-field'),navigation:r('.story-navigation'),stage:r('.story-stage')};});
   assert(regions.text.top>=regions.environment.bottom-1,`Story/environment collision ${width} chapter${i+1}`);
   assert(regions.text.top>=regions.code.bottom-1,`Story/code collision ${width} chapter${i+1}`);
   assert(regions.text.bottom<=regions.navigation.top+1,`Story/navigation collision ${width} chapter${i+1}`);
  }
  if(width===1440||width===390){await page.screenshot({path:`${dir}/about-${width}.png`});await jump('contact');await page.screenshot({path:`${dir}/contact-${width}.png`});await jump('brain');await page.screenshot({path:`${dir}/brain-${width}.png`});}
  console.log(`PASS Contact/About ${width}×${height}`);
 }
 await page.setViewportSize({width:1440,height:900}); await jump('home');
 // Context loss must restore HTML immediately, and restoration must rebuild real glyph textures.
 const extension=await page.evaluate(()=>{const e=document.querySelector('.optical-titles').getContext('webgl').getExtension('WEBGL_lose_context');window.__restoreOptics=()=>e.restoreContext();e.loseContext();return Boolean(e);});assert(extension);
 await page.waitForFunction(()=>document.querySelector('.optical-titles')?.dataset.state==='context-lost');
 assert.equal(await page.locator('[data-optical-ready="true"]').count(),0);
 await page.evaluate(()=>window.__restoreOptics());await page.waitForFunction(()=>document.querySelector('.optical-titles')?.dataset.state==='ready');
 await page.waitForFunction(()=>document.getElementById('hero-title')?.dataset.opticalReady==='true');
 assert.deepEqual(errors,[]);await page.close();
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto(base);await reduced.locator('.intro').waitFor({state:'hidden'});await reduced.waitForFunction(()=>document.querySelector('.optical-titles')?.dataset.state==='reduced');assert.equal(await reduced.locator('.optical-titles').getAttribute('data-energy'),'0.000');await reduced.close();
 const fallback=await browser.newPage({viewport:{width:390,height:844}});await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:original.call(this,type,...args);};});await fallback.goto(base);await fallback.locator('.intro').waitFor({state:'hidden'});await fallback.locator('.optical-titles[data-state="fallback"]').waitFor();assert.equal(await fallback.locator('[data-optical-ready="true"]').count(),0);assert.equal(await fallback.locator('.live-world').getAttribute('data-fallback'),null);await fallback.close();
 console.log(`PASS material motion/recovery; protected commits/reversals; ${sizes.length} Contact/About viewport matrices × 4 story chapters; context loss/restore; reduced and WebGL-only fallback.`);
}finally{await browser.close();}
