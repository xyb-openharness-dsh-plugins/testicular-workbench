/**
 * HTTP 层：API 路由 + 静态资源 + 路径穿越拦截。
 *
 * 边界（家族口径）：
 *   - API 前缀由调用方给（宿主里 `/api/testicular`，独立启动空串 → 路由挂在 `/api` 下）；
 *   - 静态资源只从 `public/` 出，**任何**路径穿越（`..`、绝对路径、符号链接逃逸）都拒绝；
 *   - 错误一律走 JSON（API）或纯文本（静态），**不留裸 throw 白屏**；
 *   - 本文件不碰 AI、不存会话：会话由宿主管理。
 *
 * API 一览（hosted 形态，apiBase='/api/testicular'）：
 *   GET  /api/testicular/api/health      健康与能力
 *   GET  /api/testicular/api/bootstrap   读模型（默认含私密标记）
 *   GET  /api/testicular/api/root        当前资料目录
 *   POST /api/testicular/api/root        切换资料目录（checkDataDir 口径拦截）
 *   GET  /api/testicular/api/subjects    档案列表
 *   POST /api/testicular/api/subjects    新建档案（is_demo=0）
 *   DELETE /api/testicular/api/subjects  删除档案（demo 不可删）
 *   POST /api/testicular/api/records     追加记录（target_table 白名单，ver=1 新行）
 *   GET  /api/testicular/api/export      导出 JSON（服务端强制过滤 is_private=1）
 */
import { readFileSync, existsSync, realpathSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

/** 静态根必须落在包内：解析后仍以 root 为前缀，否则拒绝。 */
export function resolveStatic(root, urlPath) {
  const clean = decodeURIComponent(String(urlPath).split('?')[0].split('#')[0]);
  if (clean.includes('\0')) return null;
  const rel = normalize(clean).replace(/^([/\\])+/, '');
  if (rel.split(/[/\\]/).includes('..')) return null;
  const abs = resolve(root, rel === '' ? 'index.html' : rel);
  const rootReal = realpathSync(root);
  let absReal;
  try { absReal = realpathSync(abs); } catch { return null; }
  const r = relative(rootReal, absReal);
  if (r === '' || r.startsWith('..' + sep) || r === '..' || r.startsWith(sep)) return null;
  try { if (!statSync(absReal).isFile()) return null; } catch { return null; }
  return absReal;
}

export function contentType(file) {
  return MIME[extname(file).toLowerCase()] || 'application/octet-stream';
}

/**
 * 服务时注入（而不是构建时写死）：**同一份 public/ 要在两种形态下都正确**。
 *   - `__API_BASE__`：独立启动 ''，宿主 '/api/testicular'；
 *   - `__VERSION__` / `__VERSION_DISPLAY__`：来自 lib/version.js 唯一源。
 */
export function injectTokens(text, { apiBase = '', version = '', displayVersion = '', buildDate = '' } = {}) {
  return text
    .replace(/__API_BASE__/g, apiBase)
    .replace(/__VERSION_DISPLAY__/g, displayVersion)
    .replace(/__VERSION__/g, version)
    .replace(/__BUILD_DATE__/g, buildDate);
}

/**
 * 挂在宿主前缀下的静态资源必须**先剥前缀再解析**（家族实测教训）：
 *   宿主把插件挂在 `/testicular` 与 `/api/testicular`，浏览器请求 `/testicular/app.js`。
 *   不剥前缀 → 去 `public/testicular/app.js` 找 → 找不到 → SPA 兜底递回 index.html
 *   → HTML 被当 JS 解析 → `SyntaxError: Unexpected token '<'`。
 */
export function stripMount(pathname, mounts) {
  for (const m of mounts) {
    if (pathname === m) return '/';
    if (pathname.startsWith(m + '/')) return pathname.slice(m.length);
  }
  return pathname;
}

/**
 * 资料目录口径（与 lib/client.js 的 HOME_EXACT/FORBIDDEN_DIR 同一条规则，服务端再判一遍）：
 * 主目录本身/桌面/下载根/tmp 一律拒绝，子目录通过。
 */
export function checkDataDir(raw) {
  const dir = String(raw || '').trim();
  if (!dir) return { ok: false, reason: '目录为空' };
  if (!isAbsolute(dir)) return { ok: false, reason: '请选择绝对路径' };
  if (/^(\/Users\/[^/]+|\/home\/[^/]+|\/root|[A-Za-z]:\\Users\\[^\\]+)$/i.test(dir)) return { ok: false, reason: '主目录本身不作为资料目录，请在下面建一个专用文件夹' };
  if (/(Desktop|桌面)$/i.test(dir)) return { ok: false, reason: '桌面不作为资料目录' };
  if (/(Downloads?|下载(夹)?)$/i.test(dir)) return { ok: false, reason: '下载根目录不作为资料目录' };
  if (/^(\/tmp|\/private\/tmp|\/var\/folders\/|\/private\/var\/folders\/)/i.test(dir)) return { ok: false, reason: 'tmp 不作为资料目录（会被系统清理）' };
  return { ok: true, dir };
}

function isAbsolute(p) {
  return p.startsWith('/') || /^[A-Za-z]:[\\/]/.test(p);
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => { if (raw.length < 64 * 1024) raw += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

export function createHandler({ apiBase = '', publicDir, services }) {
  const sendJson = (res, status, body) => {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify(body));
  };
  /* 宿主形态（apiBase='/api/testicular'）：UI 挂在 '/testicular'，API 挂在 '/api/testicular'。
     独立启动（apiBase=''）：都挂在根上，路径原样。 */
  const uiMount = apiBase === '' ? '' : ('/' + apiBase.replace(/^\/api\//, ''));
  const UI_MOUNTS = uiMount ? [uiMount, apiBase] : [];
  const apiPrefix = apiBase === '' ? '/api' : apiBase + '/api';

  return async function handle(req, res) {
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; } catch { return sendJson(res, 400, { error: 'Bad request' }); }

    /* ---------- API ---------- */
    if (pathname === apiPrefix + '/health' || pathname === apiPrefix + '/bootstrap') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      try {
        if (pathname.endsWith('/health')) return sendJson(res, 200, services.health());
        return sendJson(res, 200, services.bootstrap());
      } catch (error) {
        /* 不裸 throw：把原因交给前端渲染错误横幅（禁白屏） */
        return sendJson(res, 500, { error: 'read failed', detail: String(error.message || error) });
      }
    }

    /* ---------- 资料目录：读取 / 切换（真入口，不是说明弹窗） ---------- */
    if (pathname === apiPrefix + '/root' && services.dataRoot) {
      try {
        if (req.method === 'GET') return sendJson(res, 200, { dir: services.dataRoot() });
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        const body = await readJsonBody(req);
        const verdict = checkDataDir(body && body.dir);
        if (!verdict.ok) return sendJson(res, 400, { error: verdict.reason, dir: services.dataRoot() });
        return sendJson(res, 200, { dir: services.switchRoot(body.dir) });
      } catch (error) {
        return sendJson(res, 400, { error: 'root 切换失败', detail: String(error.message || error), dir: services.dataRoot && services.dataRoot() });
      }
    }

    /* ---------- 患者档案：列表 / 新建 / 删除（真实用户数据，与 demo 并存） ---------- */
    if (pathname === apiPrefix + '/subjects') {
      try {
        if (req.method === 'GET') return sendJson(res, 200, { records: services.listSubjects() });
        if (req.method === 'POST') return sendJson(res, 200, services.createSubject(await readJsonBody(req)));
        if (req.method === 'DELETE') {
          const key = new URL(req.url, 'http://localhost').searchParams.get('profileKey') || '';
          return sendJson(res, 200, services.deleteSubject(key));
        }
        return sendJson(res, 405, { error: 'Method not allowed' });
      } catch (error) {
        return sendJson(res, 400, { error: '档案操作失败', detail: String(error.message || error) });
      }
    }

    /* ---------- 追加记录：ver=1 新行，不覆盖旧行 ---------- */
    if (pathname === apiPrefix + '/records') {
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
      try {
        return sendJson(res, 200, services.addRecord(await readJsonBody(req)));
      } catch (error) {
        return sendJson(res, 400, { error: '记录写入失败', detail: String(error.message || error) });
      }
    }

    /* ---------- 导出：服务端强制过滤 is_private=1 ---------- */
    if (pathname === apiPrefix + '/export') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      try {
        const data = services.exportData();
        const payload = JSON.stringify(data, null, 2);
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
          'content-disposition': 'attachment; filename="testicular-export.json"',
        });
        return res.end(payload);
      } catch (error) {
        return sendJson(res, 500, { error: 'export failed', detail: String(error.message || error) });
      }
    }

    if (pathname.startsWith(apiPrefix + '/')) return sendJson(res, 404, { error: 'Unknown API route' });

    /* ---------- 静态 ---------- */
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { error: 'Method not allowed' });
    if (!publicDir || !existsSync(publicDir)) { res.writeHead(500); return res.end('public dir missing'); }
    /* 宿主形态（apiBase 非空）才需要剥前缀；独立启动挂在根上，路径原样 */
    const staticPath = apiBase === '' ? pathname : stripMount(pathname, UI_MOUNTS);
    const file = resolveStatic(publicDir, staticPath === '/' ? '/index.html' : staticPath);
    if (!file) {
      /* SPA 兜底：未知路径回 index.html（但 API 已在上方拦掉） */
      const index = resolveStatic(publicDir, '/index.html');
      if (!index) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'content-type': MIME['.html'], 'cache-control': 'no-store' });
      return res.end(injectTokens(readFileSync(index, 'utf8'), { apiBase, version: services.version, displayVersion: services.displayVersion, buildDate: services.buildDate }));
    }
    res.writeHead(200, { 'content-type': contentType(file), 'cache-control': 'no-store' });
    if (req.method === 'HEAD') return res.end();
    const raw = readFileSync(file, 'utf8');
    const injected = /\.(?:html|css|js|mjs)$/.test(file)
      ? injectTokens(raw, { apiBase, version: services.version, displayVersion: services.displayVersion, buildDate: services.buildDate })
      : raw;
    res.end(injected);
  };
}
