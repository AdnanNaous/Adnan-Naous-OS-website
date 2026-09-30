import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
const captures = ".codex/review/evolution";
await mkdir(captures, { recursive: true });
try {
  for (const [width, height, reduced] of [[1440,900,false],[390,844,false],[768,1024,false],[390,844,true]]) {
    const page = await browser.newPage({ viewport:{width,height}, reducedMotion:reduced ? "reduce" : "no-preference" });
    const errors=[];
    page.on("pageerror", error=>errors.push(error.message));
    page.on("console", message=>{ if(message.type()==="error" && /hydration|hydrating|server rendered|ResizeObserver loop/i.test(message.text()))errors.push(message.text()); });
    await page.addInitScript(()=>{
      window.__anosFrames=0;
      const original=requestAnimationFrame;
      window.requestAnimationFrame=callback=>original(time=>{window.__anosFrames++;callback(time);});
    });
    await page.goto(base);
    if(!reduced && await page.locator(".intro").getAttribute("data-state")==="loading") {
      assert(await page.locator("main").evaluate(node=>node.inert),"Boot blocks background focus");
      await page.keyboard.press("/");
      assert.equal(await page.getByRole("dialog",{name:"AN/OS terminal"}).count(),0,"Boot defers workspace shortcuts");
      await page.locator(".intro-retro-start").click();
    }
    await page.locator(".intro").waitFor({state:"hidden"});
    assert.equal(await page.locator("main").evaluate(node=>node.inert),false);
    assert.equal(await page.locator("h1").textContent(),"AdnanNaous.");
    assert.deepEqual(await page.locator("main > section").evaluateAll(nodes=>nodes.map(n=>n.id)),["home","brain","work","now","codex","about","contact"]);
    const chapter=async id=>{
      await page.evaluate(id=>{const node=document.getElementById(id);scrollTo({top:node.getBoundingClientRect().top+scrollY-innerHeight*.16,behavior:"instant"});},id);
      await page.waitForFunction(id=>document.querySelector(".live-world")?.dataset.chapter===id,id);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id}: no overflow at ${width}`);
    };
    await page.locator(".live-world[data-ready='true']").waitFor();
    if(width<700) {
      await page.locator(".nav-toggle").click();
      assert(await page.getByRole("navigation",{name:"Main navigation"}).isVisible());
      await page.getByRole("navigation").getByRole("link",{name:"Work",exact:true}).click();
      assert.equal(await page.locator(".nav-toggle").getAttribute("aria-expanded"),"false");
    }
    await chapter("work");
    for(let index=0;index<3;index++){
      const trigger=page.locator(".project-trigger").nth(index);
      await trigger.click();
      assert.equal(await trigger.getAttribute("aria-expanded"),"true");
      const detail=page.locator(".project-detail").nth(index);
      assert(await detail.isVisible());
      assert((await detail.getByRole("link",{name:/View code/}).getAttribute("href")).startsWith("https://github.com/AdnanNaous/"));
      await trigger.click();
      assert.equal(await trigger.getAttribute("aria-expanded"),"false");
    }
    await chapter("now");
    for(let index=0;index<6;index++){
      const node=page.locator(".now-v2-node").nth(index);
      await node.click();
      assert.equal(await node.getAttribute("aria-pressed"),"true");
      assert.equal(await page.locator(".now-v2-node[aria-pressed='true']").count(),1);
      assert((await page.locator(".now-v2-feature h3").textContent()).length>2);
    }
    await chapter("codex");
    await page.locator(".codex-menu button").nth(1).click();
    assert((await page.locator(".codex-detail-copy").textContent()).includes("useful software"));
    assert.equal(await page.locator(".codex-play").getAttribute("aria-pressed"),"false","Manual chapter pauses autoplay");
    await page.waitForTimeout(6500);
    assert.equal(await page.locator(".codex-menu button").nth(1).getAttribute("aria-pressed"),"true");
    await chapter("about");
    assert.equal(await page.locator(".story-chapter:visible").count(),4,"All factual chapters remain readable in every motion mode");
    await page.locator('.story-chapter-nav a[href="#story-chapter-3"]').click();
    await page.waitForFunction(()=>Math.abs(document.getElementById("story-chapter-3").getBoundingClientRect().top)<200);
    assert((await page.locator("#story-chapter-3").textContent()).includes("Adnan OS"));
    assert((await page.locator("#story-chapter-4").textContent()).includes("portfolio"));
    await page.locator(".cv-command").click();
    const terminal=page.getByRole("dialog",{name:"AN/OS terminal"});
    assert((await terminal.textContent()).includes("cat cv.txt"));
    await page.keyboard.press("Escape");
    await chapter("contact");
    assert.equal(await page.locator(".contact-action").getAttribute("href"),"mailto:Adnan.Naous@outlook.com");
    assert.equal(await page.locator(".social-line a").count(),4);
    await page.getByRole("link",{name:/Write an email/}).click();
    await page.getByRole("dialog",{name:"Open your email app?"}).waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(),0);
    await chapter("home");
    await page.locator(".terminal-secret").click();
    const command=page.locator("#terminal-input");
    await command.click();
    await page.waitForTimeout(1600);
    assert.equal(await page.evaluate(()=>document.activeElement?.id),"terminal-input","Clock renders cannot reset terminal focus");
    if(width<700){await page.setViewportSize({width,height:490});assert(await command.evaluate(node=>node.getBoundingClientRect().bottom<=innerHeight));await page.setViewportSize({width,height});}
    await page.keyboard.press("Escape");
    await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
    await page.screenshot({path:`${captures}/home-${width}${reduced?"-reduced":""}.png`});
    const before=await page.evaluate(()=>window.__anosFrames);
    await page.waitForTimeout(1100);
    const frames=await page.evaluate(()=>window.__anosFrames);
    assert(frames-before<(reduced?8:48),"Motion cadence stays bounded; no observer loop");
    await page.reload();
    assert.equal(await page.locator(".intro").evaluate(node=>getComputedStyle(node).visibility),"hidden","Session return skips the boot without a visible flash");
    assert.deepEqual(errors,[]);
    await page.close();
    console.log(`PASS all chapters: ${width}x${height}${reduced?" reduced motion":""}`);
  }
  const fallback=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  await fallback.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null;});
  await fallback.goto(base);
  await fallback.locator(".live-world[data-fallback='true']").waitFor();
  assert(await fallback.locator("#hero-title").isVisible());
  await fallback.locator(".brain-open").click();
  assert(await fallback.getByRole("region",{name:"Brain Archive",exact:true}).isVisible());
  await fallback.close();
  console.log("PASS graphics unavailable: content and Brain remain usable");
}finally{await browser.close();}
