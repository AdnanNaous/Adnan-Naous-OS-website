import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({channel:'chrome'});
const failures=[];
try {
 for(const language of ['en','ar']){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);
  await page.waitForFunction(()=>['done','skip'].includes(document.querySelector('.intro')?.getAttribute('data-visible')));
  if(language==='ar')await page.getByRole('button',{name:'Switch to Arabic'}).click();
  for(const [width,height] of [[320,700],[360,780],[390,844],[430,932],[700,900],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]){
   await page.setViewportSize({width,height});
   await page.evaluate(()=>scrollTo(0,0));
   await page.waitForTimeout(100);
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,button:[...document.querySelectorAll('.actions .button')].every(e=>e.getBoundingClientRect().width>50),heading:document.querySelector('h1')?.getBoundingClientRect().width||0,font:getComputedStyle(document.body).fontFamily}));
   if(layout.overflow>1||!layout.button||!layout.font.includes('thmanyah'))failures.push({language,width,height,layout});
   await page.locator('#contact').scrollIntoViewIfNeeded();
   await page.waitForTimeout(150);
   const contact=await page.locator('.contact-button').isVisible();
   if(!contact) failures.push({language,width,height,reason:'contact hidden'});
  }
  if(language==='en'){
   await page.setViewportSize({width:390,height:844});
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
   await page.evaluate(()=>scrollBy(0,500));await page.waitForTimeout(450);
   assert.equal(await page.locator('.dock').getAttribute('inert'),'');
   await page.evaluate(()=>scrollBy(0,-220));await page.waitForTimeout(450);
   assert.equal(await page.locator('.dock').getAttribute('inert'),null);
  }
  if(errors.length)failures.push({language,errors});
  await page.close();
 }
 assert.deepEqual(failures,[]);
 console.log('PASS: 20 desktop/mobile English and Arabic viewport states; no overflow; usable CTA/contact; Thmanyah loaded; dock scroll behavior.');
} finally{await browser.close();}
