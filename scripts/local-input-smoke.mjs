import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium,webkit} from 'playwright';
const base=process.env.BASE_URL||'http://localhost:3108';
await mkdir('.codex/review/local-input',{recursive:true});
for(const engine of process.env.TEST_WEBKIT==='1'?[chromium,webkit]:[chromium]){
 const browser=await engine.launch(engine===chromium?{channel:'chrome'}:{});
 try{for(const [width,height] of [[1440,900],[1074,668],[393,852],[320,700]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<700});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>sessionStorage.setItem('an-os-booted','1'));
  await page.goto(base);await page.locator('.live-world[data-ready="true"]').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);
  const isolate=await page.addStyleTag({content:'.live-world,.world-shade,.hero-imprint,.scene-sight{visibility:hidden!important}#home{--object-x:0px!important;--object-y:0px!important}#home .hero-name-line{animation:none!important;background-position:100% 50%!important}'});
  const name=page.locator('.hero-name-line').first();const box=await name.boundingBox();await page.mouse.move(5,5);await page.waitForTimeout(300);const before=await name.screenshot();
  await page.mouse.move(box.x+25,box.y+box.height*.5);await page.waitForTimeout(80);await page.mouse.move(box.x+65,box.y+box.height*.5,{steps:3});await page.waitForTimeout(60);const after=await name.screenshot();
  const result=await page.evaluate(async([a,b])=>{
   const decode=async data=>{const i=new Image();i.src=`data:image/png;base64,${data}`;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);return {a:x.getImageData(0,0,c.width,c.height).data,w:c.width};};
   const first=await decode(a),second=await decode(b);let near=0,far=0,nearInk=0,farInk=0;
   for(let i=0;i<first.a.length;i+=4){const x=(i/4)%first.w;if(Math.max(first.a[i],second.a[i])<100)continue;const changed=Math.max(...[0,1,2].map(j=>Math.abs(first.a[i+j]-second.a[i+j])))>12;if(x<175){nearInk++;if(changed)near++;}if(x>265){farInk++;if(changed)far++;}}
   return {near:near/Math.max(1,nearInk),far:far/Math.max(1,farInk),farInk};
  },[before.toString('base64'),after.toString('base64')]);
  assert(result.near>.025,`${engine.name()} ${width} local glyph actually changes ${JSON.stringify(result)}`);
  if(result.farInk>300)assert(result.far<.025,`Distant glyphs stay stable ${JSON.stringify(result)}`);
  await isolate.evaluate(e=>e.remove());await page.mouse.move(width*.8,height*.45);await page.waitForTimeout(250);
  assert.equal(await page.locator('html').getAttribute('data-scene-pointer'),'mouse');
  assert.equal(await page.locator('.scene-sight').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  const axis=await page.locator('.sight-x').evaluate(e=>e.getBoundingClientRect().top);assert(Math.abs(axis-height*.45)<3,'X axis follows pointer');
  await page.screenshot({path:`.codex/review/local-input/${engine.name()}-home-${width}.png`});
  await page.locator('#brain').evaluate(e=>e.scrollIntoView({behavior:'instant'}));await page.waitForTimeout(1000);
  const memory=await page.locator('.brain-depth-word').evaluate(e=>{const r=e.getBoundingClientRect(),p=e.closest('.brain-entry').getBoundingClientRect();return r.left>=p.left-1&&r.right<=p.right+1;});assert(memory,'Full MEMORY stays inside its edges');
  await page.screenshot({path:`.codex/review/local-input/${engine.name()}-brain-${width}.png`});
  await page.locator('.work-compiler').scrollIntoViewIfNeeded();await page.waitForTimeout(350);
  assert.equal(await page.locator('.work-index-orbit-a').evaluate(e=>getComputedStyle(e).animationPlayState),'running');
  const orbit=await page.locator('.work-index-orbit-a').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(300);assert.notEqual(await page.locator('.work-index-orbit-a').evaluate(e=>getComputedStyle(e).transform),orbit);
  await page.locator('.now-v2-origin strong').scrollIntoViewIfNeeded();await page.waitForTimeout(550);await page.locator('.now-v2-origin strong').hover();await page.waitForTimeout(180);
  assert.equal(await page.locator('.now-v2-origin strong > .text-optical-copy').getAttribute('aria-hidden'),'true');
  assert.match(await page.locator('.now-v2-origin strong > .text-optical-copy').evaluate(e=>getComputedStyle(e).maskImage),/radial-gradient/);
  await page.locator('.now-v2-energy').scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const e=document.querySelector('.now-v2-energy-band span'),p=e.parentElement.getBoundingClientRect();return Math.abs(e.getBoundingClientRect().width/(p.width-2)-.7)<.005;});
  const energy=await page.locator('.now-v2-energy-band span').evaluate(e=>{const p=e.parentElement.getBoundingClientRect();return {ratio:e.getBoundingClientRect().width/(p.width-2),play:getComputedStyle(e,'::before').animationPlayState};});assert(Math.abs(energy.ratio-.7)<.005);assert.equal(energy.play,'running');
  await page.screenshot({path:`.codex/review/local-input/${engine.name()}-now-${width}.png`});
  await page.locator('.codex-console').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  for(let i=0;i<3;i++)assert(await page.locator('.codex-menu button').nth(i).evaluate(e=>{const b=e.getBoundingClientRect(),t=e.querySelector('strong').getBoundingClientRect();return t.left-b.left>=9&&b.right-t.right>=8;}),'Codex glyphs have breathing room');
  await page.screenshot({path:`.codex/review/local-input/${engine.name()}-codex-${width}.png`});
  await page.locator('.contact-email-button').scrollIntoViewIfNeeded();await page.waitForTimeout(250);
  const mail=await page.locator('.contact-email-button').evaluate(e=>{const s=getComputedStyle(e),rgb=s.backgroundColor.match(/[\d.]+/g).map(Number);return {image:s.backgroundImage,rgb};});assert.equal(mail.image,'none');assert.equal(mail.rgb[0],mail.rgb[1]);assert.equal(mail.rgb[1],mail.rgb[2]);
  await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.waitForTimeout(250);assert(await page.locator('.site-footer').evaluate(e=>Number(getComputedStyle(e).backgroundColor.match(/[\d.]+/g).at(-1))<.5));
  await page.screenshot({path:`.codex/review/local-input/${engine.name()}-contact-${width}.png`});
  await page.locator('.terminal-secret').click();await page.waitForTimeout(200);await page.locator('input').last().hover();assert.equal(await page.locator('.scene-sight').getAttribute('data-editing'),'true');await page.keyboard.press('Escape');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${engine.name()} localized glyph pixels/cursor/memory/instruments/spacing/mail/footer ${width}x${height}`);
 }}finally{await browser.close();}
}


