#!/usr/bin/env node
/** Build public/ by copying the confirmed TestiPal prototype and injecting DSH runtime tokens. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=dirname(dirname(fileURLToPath(import.meta.url)));
const SRC=join(ROOT,'prototypes/v0.2'), OUT=join(ROOT,'public');
export const FILES=['index.html','app.js','style.css','demo-data.js','primer-data.js','primer.js','primer.css',...(existsSync(join(SRC,'trial-match.js'))?['trial-match.js']:[])];
const BOOT=`<script>window.__TESTI_PRODUCTION__=true;window.__TESTI_API_BASE__="__API_BASE__";</script>`;
export function expected(name){let s=readFileSync(join(SRC,name),'utf8');if(name==='index.html')s=s.replaceAll('v0.2.0','__VERSION_DISPLAY__').replace('</head>',`${BOOT}\n<style>html,body,#shell,.shell,.frame{height:100%;min-height:0}body{overflow:hidden}.dsh-embedded .topbar,.dsh-embedded .sidebar .profile-switch,.dsh-embedded .agent-pane,.dsh-embedded #agent-splitter,.dsh-embedded [data-action="agent"]{display:none!important}.dsh-embedded .frame{height:100vh}.dsh-embedded #main{min-height:0}</style>\n</head>`);return s}
export { SRC, OUT };
const check=process.argv.includes('--check');
if(!existsSync(SRC))throw new Error('prototypes/v0.2 不存在');
if(check){const bad=FILES.filter(f=>{try{return readFileSync(join(OUT,f),'utf8')!==expected(f)}catch{return true}});if(bad.length){console.error('✗ public/ 与确认原型不一致：'+bad.join(', '));process.exit(1)}console.log(`✓ public/ ${FILES.length} 件与确认原型一致（index.html 仅注入生产运行配置）`)}
else{mkdirSync(OUT,{recursive:true});for(const f of FILES)writeFileSync(join(OUT,f),expected(f));console.log(`✓ public/ 已由原型构建（${FILES.length} 件）`)}
