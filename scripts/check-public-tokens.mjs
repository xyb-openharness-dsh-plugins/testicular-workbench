#!/usr/bin/env node
/** Verify production runtime token injection stays syntactically valid after DSH mount-prefix substitution. */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=dirname(dirname(fileURLToPath(import.meta.url))),fails=[];
const app=join(ROOT,'public/app.js'),index=join(ROOT,'public/index.html');
if(!existsSync(app)){console.log('SKIP public/app.js 不存在：生产令牌闸门暂不启用');process.exit(0)}
const appSrc=readFileSync(app,'utf8');
if(!/const\s+apiBase\s*=\s*window\.TESTI_API_BASE\s*\|\|\s*''/.test(appSrc))fails.push('public/app.js 未读取 window.TESTI_API_BASE');
if(/window\.__API_BASE__|window\.__VERSION/.test(appSrc))fails.push('public/app.js 使用了替换后会变成非法 JS 的 window.* 令牌');
if(!existsSync(index))fails.push('public/index.html 不存在');
else{const idx=readFileSync(index,'utf8');if(!idx.includes('__VERSION_DISPLAY__'))fails.push('缺 __VERSION_DISPLAY__ 占位');if(!/window\.TESTI_API_BASE="__API_BASE__"/.test(idx))fails.push('缺合法的 API_BASE 字符串字面量注入点');if(/window\.__API_BASE__|window\.__VERSION/.test(idx))fails.push('index 中出现非法 window.* 令牌')}
if(fails.length){console.error('✗ public 令牌形态：\n  '+fails.join('\n  '));process.exit(1)}
console.log('✓ public 令牌形态：API_BASE 字符串字面量、版本占位与宿主注入点正确')
