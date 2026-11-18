#!/usr/bin/env node
/**
 * TestiPal M2 browser smoke probe. Run with CHROME_PATH and puppeteer-core available:
 *   node scripts/probe-testicular-m2.mjs --url http://127.0.0.1:<port>/prototypes/v0.2/index.html
 */
import { createRequire } from 'node:module'

const args=process.argv.slice(2), arg=(k)=>{const i=args.indexOf(k);return i<0?null:args[i+1]}
const ROUTE_IDS=['dashboard','labs','followup','course','fertility','notes','visit','trials','records']
const url=arg('--url'), chrome=process.env.CHROME_PATH
if(!url){console.error('缺少 --url：必须显式打开本仓 prototypes/v0.2/index.html');process.exit(2)}
if(!chrome){console.error('设置 CHROME_PATH 指向本机 Chrome/Chromium');process.exit(2)}
let puppeteer
try{puppeteer=createRequire(import.meta.url)('puppeteer-core')}catch{console.error('找不到 puppeteer-core；请在开发环境提供该包');process.exit(2)}
const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']})
const errors=[],results={}
const check=(name,ok,detail='')=>{results[name]={ok,detail};console.log(`${ok?'PASS':'FAIL'} ${name}${detail?` — ${detail}`:''}`);if(!ok)process.exitCode=1}
try{
 const page=await browser.newPage({viewport:{width:1280,height:860}})
 page.on('pageerror',e=>errors.push(String(e.message)))
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
 await page.goto(url,{waitUntil:'networkidle0'})
 const routes=await page.evaluate(()=>[...document.querySelectorAll('#nav [data-nav]')].map(x=>x.dataset.nav))
 check('all nav routes present',ROUTE_IDS.every(x=>routes.includes(x)),`${routes.length} routes`)
 for(const id of ROUTE_IDS){await page.evaluate(id=>document.querySelector(`#nav [data-nav="${id}"]`).click(),id);const active=await page.$eval('#nav .active',x=>x.dataset.nav);if(!active||active.length===0)throw new Error(`route ${id} active state must be nonempty`);check(`route ${id}`,active===id,`active=${active}`)}
 await page.evaluate(()=>document.querySelector('#nav [data-nav="labs"]').click())
 const graph=await page.evaluate(()=>({points:document.querySelectorAll('.chart-svg [data-point]').length,heights:[...document.querySelectorAll('.chart-line')].map(x=>Math.round(x.getBBox().height)),labels:document.querySelectorAll('.last-value').length}))
 check('normalized chart and end labels',graph.points===6&&graph.heights.length===3&&graph.heights.every(x=>x===145)&&graph.labels===3,`points=${graph.points}; heights=${graph.heights.join('/')}; labels=${graph.labels}`)
 await page.evaluate(()=>{const p=document.querySelector('[data-point]');p.focus();p.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))})
 const pin=await page.$eval('#chart-point-detail',x=>x.textContent)
 check('keyboard point pin',pin.includes('来源：'),pin.slice(0,70))
 await page.evaluate(()=>document.querySelector('.metric-flip').scrollIntoView({block:'center'}))
 const rectBefore=await page.$eval('.metric-flip',x=>{const r=x.getBoundingClientRect();return [r.x,r.y,r.width,r.height,scrollY]})
 await page.evaluate(()=>document.querySelector('.metric-flip [data-action="flip"]').click())
 const rectAfter=await page.$eval('.metric-flip',x=>{const r=x.getBoundingClientRect();return [r.x,r.y,r.width,r.height,scrollY]})
 const flip=await page.evaluate(()=>({on:document.querySelectorAll('.metric-flip.is-flipped').length,off:document.querySelectorAll('.metric-flip:not(.is-flipped)').length,inert:document.querySelectorAll('.metric-face[inert]').length}))
 check('metric card flip state/layout',rectBefore.every((x,i)=>x===rectAfter[i])&&flip.on===1&&flip.off===2&&flip.inert>=1,`on=${flip.on} off=${flip.off} rectStable=${rectBefore.every((x,i)=>x===rectAfter[i])}`)
 await page.select('#profile-select','demo-b');await page.evaluate(()=>document.querySelector('#nav [data-nav="labs"]').click())
 const all=await page.$$eval('.chart-svg [data-point]',xs=>xs.length)
 await page.evaluate(()=>document.querySelector('[data-range="近12月"]').click())
 const recent=await page.$$eval('.chart-svg [data-point]',xs=>xs.length)
 check('two profiles + date range',all===10&&recent===3,`profile B points ${all}→${recent}`)
 await page.evaluate(()=>document.querySelector('[data-range="全部"]').click())
 const pathBefore=await page.$$eval('.chart-line',xs=>xs.map(x=>x.getAttribute('d')))
 await page.evaluate(()=>document.querySelector('[data-action="events"]').click())
 const pathAfter=await page.$$eval('.chart-line',xs=>xs.map(x=>x.getAttribute('d')))
 check('event lane independent',JSON.stringify(pathBefore)===JSON.stringify(pathAfter),'curve paths unchanged')
 await page.evaluate(()=>document.querySelector('[data-action="events"]').click())
 const linked=await page.evaluate(()=>{const id=document.querySelector('.event-chip')?.dataset.eventId;return Boolean(id)&&[...document.querySelectorAll('.chart-svg [data-event-id]')].some(x=>x.dataset.eventId===id)})
 check('event label/node identity',linked,'eventId shared by lane label and chart marker')
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
 const reduced=await page.$eval('.chart-line',x=>getComputedStyle(x).strokeDashoffset)
 check('reduced motion final state',reduced==='0px',`stroke-dashoffset=${reduced}`)
 await page.setViewport({width:390,height:844})
 const widths=[]
 for(const id of ROUTE_IDS){await page.evaluate(id=>document.querySelector(`#nav [data-nav="${id}"]`).click(),id);widths.push(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))}
 check('390px all routes',widths.every(Boolean),`${widths.filter(Boolean).length}/${widths.length} no page overflow`)
 const sparse=await browser.newPage({viewport:{width:1280,height:860}})
 await sparse.goto(url,{waitUntil:'networkidle0'})
 await sparse.evaluate(()=>{const p=window.TESTI_DEMO.profiles[0];p.labs=p.labs.filter(x=>x.key==='AFP').slice(0,1);p.labs[0].date='2019-01-01';document.querySelector('#nav [data-nav="labs"]').click()})
 await sparse.evaluate(()=>document.querySelector('[data-range="近3月"]').click())
 const empty=await sparse.$eval('.chart-empty',x=>!x.hidden)
 await sparse.evaluate(()=>document.querySelector('[data-range="全部"]').click())
 const one=await sparse.evaluate(()=>({points:document.querySelectorAll('[data-point]').length,lines:document.querySelectorAll('.chart-line').length}))
 check('single point and empty-window states',empty&&one.points===1&&one.lines===0,`empty=${empty}; points=${one.points}; lines=${one.lines}`)
 const dense=await browser.newPage({viewport:{width:1280,height:860}})
 await dense.goto(url,{waitUntil:'networkidle0'})
 await dense.evaluate(()=>{
   const p=window.TESTI_DEMO.profiles[0], keys=['AFP','β-hCG','LDH']
   p.labs=keys.flatMap((key)=>{
     const base=p.labs.find(x=>x.key===key)
     return [0,100].map((value,i)=>({...base,id:`dense-${key}-${i}`,date:i?'2026-11-16':'2026-10-16',value}))
   })
   document.querySelector('#nav [data-nav="labs"]').click()
 })
 const denseLabels=await dense.$$eval('.last-value',xs=>xs.map(x=>{const r=x.getBBox();return {x:r.x,y:r.y,width:r.width,height:r.height}}))
 const noLabelOverlap=denseLabels.length===3&&denseLabels.every((a,i)=>denseLabels.slice(i+1).every(b=>a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y))
 check('dense end labels remain distinct',noLabelOverlap,`${denseLabels.length} labels; y=${denseLabels.map(x=>Math.round(x.y)).join('/')}`)
 await dense.close()
 await sparse.close()
 check('no browser errors',errors.length===0,errors.join(' | '))
} finally {await browser.close()}
console.log(JSON.stringify({pass:process.exitCode!==1,results,errors},null,2))
