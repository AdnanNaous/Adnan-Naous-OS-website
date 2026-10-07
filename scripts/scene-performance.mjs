import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const results=[];
try {
 for(const [width,height] of [[1440,900],[393,852]]) {
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<700});
  await page.addInitScript(()=>{
   sessionStorage.setItem('an-os-booted','1');
   window.__frameCosts=[];window.__longTasks=[];
   const raf=window.requestAnimationFrame.bind(window);
   window.requestAnimationFrame=fn=>raf(t=>{const a=performance.now();fn(t);const cost=performance.now()-a;if(window.__measure)window.__frameCosts.push(cost);});
   new PerformanceObserver(list=>{if(window.__measure)window.__longTasks.push(...list.getEntries().map(e=>e.duration));}).observe({type:'longtask',buffered:true});
  });
  if(process.env.PERF_RENDERER==='canvas2d')await page.addInitScript(()=>{
   const get=HTMLCanvasElement.prototype.getContext;
   HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:get.call(this,type,...args);};
  });
  const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
  await page.goto(process.env.BASE_URL||'http://localhost:3108');
  await page.locator('.live-world[data-ready="true"]').waitFor();await page.waitForTimeout(1500);
  const before=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
  const started=Date.now();await page.evaluate(()=>window.__measure=true);
  for(let i=0;i<80;i++) {
   await page.mouse.move(width*(.15+.7*(.5+.5*Math.sin(i*.22))),height*(.3+.35*(.5+.5*Math.cos(i*.17))));
   if(i===30)await page.locator('#brain').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
   if(i===55)await page.locator('#contact').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
   await page.waitForTimeout(65);
  }
  const elapsed=(Date.now()-started)/1000;
  const after=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
  const local=await page.evaluate(()=>{window.__measure=false;const c=window.__frameCosts.filter(n=>n>.2).sort((a,b)=>a-b);return {callbacks:c.length,p50Ms:c[Math.floor(c.length*.5)]||0,p95Ms:c[Math.floor(c.length*.95)]||0,longTasks:window.__longTasks.length,renderer:document.querySelector('.live-world').dataset.renderer};});
  results.push({width,height,...local,elapsedSeconds:elapsed,mainThreadMsPerSecond:1000*(after.TaskDuration-before.TaskDuration)/elapsed,scriptMsPerSecond:1000*(after.ScriptDuration-before.ScriptDuration)/elapsed,layoutMsPerSecond:1000*(after.LayoutDuration-before.LayoutDuration)/elapsed,styleMsPerSecond:1000*(after.RecalcStyleDuration-before.RecalcStyleDuration)/elapsed});
  await page.close();
 }
}finally{await browser.close();}
await mkdir('.codex/review/performance',{recursive:true});
await writeFile(`.codex/review/performance/${process.env.PERF_LABEL||'current'}.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
