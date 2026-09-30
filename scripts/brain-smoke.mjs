import assert from "node:assert/strict";
import { chromium } from "playwright";
const base=process.env.BASE_URL||"http://localhost:3000";
const browser=await chromium.launch({channel:"chrome"});
try{
  for(const [width,reduced] of [[1280,false],[390,false],[390,true]]){
    const page=await browser.newPage({viewport:{width,height:844},reducedMotion:reduced?"reduce":"no-preference"});
    const errors=[],apiRequests=[];
    page.on("pageerror",e=>errors.push(e.message));
    page.on("request",r=>{if(r.url().includes("/api/brain"))apiRequests.push(r.url());});
    await page.goto(base);await page.locator(".intro").waitFor({state:"hidden"});
    const brain=page.locator("#brain"),opener=brain.locator(".brain-open");
    await opener.click();
    const archive=brain.locator(".brain-window-archive");
    await archive.waitFor();assert.equal(await brain.locator(".brain-window").count(),1);
    const prompts=archive.locator(".brain-ask-prompt");
    await page.waitForFunction(()=>document.querySelectorAll(".brain-ask-prompt").length===3);
    const first=await prompts.allTextContents();assert.equal(new Set(first).size,3);
    await prompts.first().click();assert(await archive.locator(".brain-ask-response").isVisible());
    assert.equal(await archive.locator(".brain-ask-sources button").count(),1);
    await archive.getByRole("button",{name:"Show me another 3 ↗",exact:true}).click();
    await page.waitForFunction(()=>document.querySelectorAll(".brain-ask-prompt").length===3);
    const second=await prompts.allTextContents();assert.equal(new Set(second).size,3);
    assert(second.every(q=>!first.includes(q)));assert.deepEqual(apiRequests,[]);
    await archive.getByLabel("ASK THE ARCHIVE").fill("successor");
    assert((await archive.locator(".brain-ask-retrieval").textContent()).includes("What If AI Starts Developing Itself?"));
    await archive.getByLabel("ASK THE ARCHIVE").fill("qwertyunknownnoentry");
    assert((await archive.locator(".brain-ask-retrieval").textContent()).includes("no matching published thought"));
    const search=archive.getByRole("searchbox",{name:"SEARCH ARCHIVE"});
    await search.fill("successor");assert.equal(await archive.locator(".brain-entry-row").count(),1);
    await archive.locator(".brain-entry-row").click();
    const thought=brain.locator(".brain-window-thought");
    await thought.waitFor();assert.equal(await brain.locator(".brain-window").count(),2);
    assert(await archive.evaluate(n=>n.inert),"Background archive is inert during reading");
    if(width<700)assert.equal(await archive.evaluate(n=>getComputedStyle(n).display),"none","Phone presents one panel");
    else assert(await archive.isVisible(),"Desktop keeps the archive behind the thought");
    await thought.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector(".live-world")?.dataset.state==="reading");
    await page.evaluate(()=>{const work=document.getElementById("work");scrollTo({top:work.getBoundingClientRect().top+scrollY-innerHeight*.1,behavior:"instant"});});
    await page.waitForFunction(()=>document.querySelector(".live-world")?.dataset.chapter==="work");
    assert.equal(await thought.count(),1,"Leaving the chapter retains the reading window, without forcing its scene");
    await thought.scrollIntoViewIfNeeded();await thought.getByRole("button",{name:/Archive/}).click();
    assert.equal(await thought.count(),0);assert.equal(await archive.evaluate(n=>n.inert),false);
    await archive.press("Escape");await archive.waitFor({state:"detached"});
    await page.waitForFunction(()=>document.activeElement?.classList.contains("brain-open"));
    await opener.click();await search.fill("");
    await archive.locator(".brain-entry-row").filter({hasText:"What If AI Became Conscious?"}).click();
    assert((await thought.textContent()).includes("closer to science fiction and philosophy"));
    await thought.getByRole("button",{name:/Close What If AI Became Conscious/}).click();
    assert.equal(await brain.locator(".brain-window").count(),0);
    await opener.click();
    if(width<700){
      assert.equal(await archive.locator(".brain-window-body").evaluate(n=>getComputedStyle(n).overflowY),"visible");
      await archive.scrollIntoViewIfNeeded();
      const before=await page.evaluate(()=>scrollY),bounds=await archive.boundingBox();
      await page.mouse.move(bounds.x+Math.min(80,bounds.width/2),Math.min(bounds.y+120,700));await page.mouse.wheel(0,350);
      await page.waitForFunction(before=>scrollY>before+50,before);
    }
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.deepEqual(errors,[]);await page.close();console.log(`PASS Brain: ${width}px${reduced?" reduced":""}`);
  }
}finally{await browser.close();}
