#!/usr/bin/env node
/** Build public/ by copying the confirmed TestiPal prototype and injecting DSH runtime tokens. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=dirname(dirname(fileURLToPath(import.meta.url)));
const SRC=join(ROOT,'prototypes/v0.2'), OUT=join(ROOT,'public');
export const FILES=['index.html','app.js','style.css','demo-data.js','primer-data.js','primer.js','primer.css',...(existsSync(join(SRC,'trial-match.js'))?['trial-match.js']:[])];
const BOOT=`<script>window.TESTI_PRODUCTION=true;window.TESTI_API_BASE="__API_BASE__";</script>`;
const CLINICAL_PRODUCTION=`
  let clinicalState={loading:false,data:null,error:''};
  async function refreshClinical(){
    if(clinicalState.loading)return;
    clinicalState={...clinicalState,loading:true,error:''};render();
    try{
      const response=await fetch(\`\${apiBase}/api/clinical/ctg\`,{credentials:'same-origin',cache:'no-store'});
      const body=await response.json();
      if(!response.ok)throw new Error(body.detail||body.error||\`查询失败 (\${response.status})\`);
      clinicalState={loading:false,data:body,error:''};
    }catch(error){clinicalState={...clinicalState,loading:false,error:error.message}}
    render();
  }
  function liveTrials(){
    const s=clinicalState,d=s.data;
    return \`\${head('临床研究','查询 ClinicalTrials.gov 官方登记记录；结果未经逐条相关性审核，不判断个人能否入组。')}
      <div class="review-banner">旧的 2026-11-18 本机快照含无关宽词返回记录和历史 FAILED 通道，已停用作当前查询。此页按需请求官方来源，不发送患者档案。</div>
      <section class="card"><div class="card-head"><div><h2>官方登记源 · ClinicalTrials.gov</h2><p>固定检索词：testicular cancer · 按更新时间检查最多 100 条，展示其中标题或条件含睾丸相关英文词的最多 20 条；总数仍是宽词返回量。</p></div><button class="button" data-action="clinical-refresh" \${s.loading?'disabled':''}>\${s.loading?'查询中…':'刷新官方记录'}</button></div>
      \${s.error?\`<div class="review-banner" role="alert">本次查询失败：\${esc(s.error)}。已有记录若显示，仍是上次成功结果。<a href="https://clinicaltrials.gov/search?cond=testicular%20cancer" target="_blank" rel="noopener noreferrer">打开官方检索 ↗</a></div>\`:''}
      \${d?\`<p class="subtle">取得时间：\${esc(d.retrievedAt)} · 宽词返回总数：\${esc(d.totalCount)} · 本次检查：\${esc(d.examinedCount)} · 展示：\${esc(d.studies.length)}。\${esc(d.note)}</p><div class="list">\${d.studies.map(x=>\`<div class="list-item"><div><strong>\${esc(x.title)}</strong><p>\${esc(x.id)} · 登记状态：\${esc(x.status)} · 更新：\${esc(x.updated||'未提供')} · 条件：\${esc((x.conditions||[]).join('、')||'未提供')}</p></div><a class="button" href="\${esc(x.url)}" target="_blank" rel="noopener noreferrer">核对原始登记 ↗</a></div>\`).join('')}</div>\`:s.loading?'<p role="status">正在连接官方登记源…</p>':'<p>尚未取得本次查询结果。可刷新，或直接打开官方检索。</p>'}
      <p><a href="https://clinicaltrials.gov/search?cond=testicular%20cancer" target="_blank" rel="noopener noreferrer">在 ClinicalTrials.gov 查看完整结果 ↗</a></p></section>\`;
  }
`;
function replaceOnce(source, needle, replacement){if(!source.includes(needle))throw new Error('生产移植锚点缺失：'+needle.slice(0,70));return source.replace(needle,replacement)}
export function expected(name){let s=readFileSync(join(SRC,name),'utf8');if(name==='index.html')s=s.replaceAll('v0.2.0','__VERSION_DISPLAY__').replace('</head>',`${BOOT}\n<style>html,body,#shell,.shell,.frame{height:100%;min-height:0}body{overflow:hidden}.frame,.sidebar,#main{min-height:0}#main,.sidebar{overflow-y:auto;overscroll-behavior:contain}.dsh-embedded .topbar,.dsh-embedded .sidebar .profile-switch,.dsh-embedded .agent-pane,.dsh-embedded #agent-splitter,.dsh-embedded [data-action="agent"]{display:none!important}.dsh-embedded .frame{height:100vh}</style>\n</head>`);if(name==='app.js'){s=replaceOnce(s,'  function trials(){',CLINICAL_PRODUCTION+'\n  function trials(){if(productionMode)return liveTrials();');s=replaceOnce(s,'function actLocal(action,el){const p=profile();','function actLocal(action,el){if(action===\'clinical-refresh\'){void refreshClinical();return}const p=profile();');s=replaceOnce(s,'function go(page){state.page=page;','function go(page){state.page=page;if(page===\'trials\'&&productionMode&&!clinicalState.data)void refreshClinical();')}return s}
export { SRC, OUT };
const check=process.argv.includes('--check');
if(!existsSync(SRC))throw new Error('prototypes/v0.2 不存在');
if(check){const bad=FILES.filter(f=>{try{return readFileSync(join(OUT,f),'utf8')!==expected(f)}catch{return true}});if(bad.length){console.error('✗ public/ 与确认原型不一致：'+bad.join(', '));process.exit(1)}console.log(`✓ public/ ${FILES.length} 件与确认原型一致（index.html 仅注入生产运行配置）`)}
else{mkdirSync(OUT,{recursive:true});for(const f of FILES)writeFileSync(join(OUT,f),expected(f));console.log(`✓ public/ 已由原型构建（${FILES.length} 件）`)}
