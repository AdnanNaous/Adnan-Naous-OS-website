import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({channel:'chrome'});
const dir = '.codex/review/repair';
await mkdir(dir,{recursive:true});
try {
  const sizes = [[1440,900],[1920,1080],[1024,768],[768,1024],[430,932],[393,960],[390,844],[360,780],[320,700],[844,390]];
  for (const [width,height] of sizes) {
    const page = await browser.newPage({viewport:{width,height},hasTouch:width<700,deviceScaleFactor:width<700?3:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>sessionStorage.setItem('an-os-booted','1'));
    await page.goto(base);await page.locator('.intro').waitFor({state:'hidden'});
    await page.locator('.live-world[data-ready="true"]').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    const jump=async id=>{
      await page.evaluate(id=>{const e=document.getElementById(id);scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*.16,behavior:'instant'});},id);
      await page.waitForFunction(id=>document.querySelector('.live-world')?.dataset.chapter===id,id);
    };
    for(const id of ['home','brain','work','now','codex','about','contact']){
      await jump(id);
      const health=await page.evaluate(id=>{
        const title=document.querySelector(`#${id} h1,#${id} h2`),r=title.getBoundingClientRect(),s=getComputedStyle(title);
        return {overflow:document.documentElement.scrollWidth-innerWidth,left:r.left,right:r.right,font:s.fontFamily,style:s.fontStyle,paint:s.color,opacity:s.opacity,mask:document.querySelectorAll('.scene-transition,.optical-titles,.story-mask').length};
      },id);
      assert(health.overflow<=1,`${id}: overflow ${width}`);
      assert(health.left>=-1&&health.right<=width+1,`${id}: title bounds ${width}`);
      assert.match(health.font,/Inter/);assert.equal(health.style,'normal');assert.equal(health.opacity,'1');assert.notEqual(health.paint,'rgba(0, 0, 0, 0)');assert.equal(health.mask,0);
    }
    for(const id of ['home','contact','work','brain','about','home']){
      await page.evaluate(id=>scrollTo({top:document.getElementById(id).offsetTop,behavior:'instant'}),id);
      await page.waitForTimeout(65);
    }
    if(width<700){await page.setViewportSize({width,height:height-120});await page.waitForTimeout(150);await page.setViewportSize({width,height});}
    await jump('about');
    assert.equal(await page.locator('.story-chapter:visible').count(),4);
    for(let i=1;i<=4;i++){
      await page.locator(`.story-chapter-nav a[href="#story-chapter-${i}"]`).click();
      await page.waitForFunction(i=>{const r=document.getElementById(`story-chapter-${i}`).getBoundingClientRect();return r.top>=0&&r.top<210;},i);
      const text=await page.locator(`#story-chapter-${i} p`).evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {left:r.left,right:r.right,opacity:s.opacity,font:s.fontFamily};});
      assert(text.left>=0&&text.right<=width+1);assert.equal(text.opacity,'1');assert.match(text.font,/Inter/);
    }
    await jump('contact');
    const alignment=await page.evaluate(()=>{
      const r=s=>document.querySelector(s).getBoundingClientRect();return {left:r('.contact-content').left,action:r('.contact-transmission').left,right:r('.contact-transmission').right};
    });
    assert(Math.abs(alignment.left-alignment.action)<2);assert(alignment.right<=width+1);
    if(width===1440||width===393){await page.waitForTimeout(650);await page.screenshot({path:`${dir}/contact-${width}.png`});await jump('about');await page.waitForTimeout(650);await page.screenshot({path:`${dir}/about-${width}.png`});await jump('home');await page.waitForTimeout(650);await page.screenshot({path:`${dir}/home-${width}.png`});}
    assert.deepEqual(errors,[]);await page.close();console.log(`PASS stable typography, navigation, resize: ${width}×${height}`);
  }
  const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.addInitScript(()=>sessionStorage.setItem('an-os-booted','1'));await reduced.goto(base);
  await reduced.locator('.live-world[data-ready="true"]').waitFor();assert.equal(await reduced.locator('.story-chapter:visible').count(),4);assert.equal(await reduced.locator('.scene-transition,.optical-titles').count(),0);await reduced.close();
  console.log('PASS reduced motion: stable native headings and complete story');
} finally {await browser.close();}
