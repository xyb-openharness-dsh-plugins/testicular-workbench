import Schema from '@deepseek-ai/schemastery'
import { readFileSync } from 'node:fs'

export const name = 'testicular-main'
export const inject = ['webServer', 'connection']
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

/**
 * config 是**第二个参数**，不是 `ctx.config`。
 *
 * 家族实测（2026-10-25，pericarditis 回流）：写成 `ctx.config?.root` 时宿主直接报
 *   `cannot get property "config" without inject`
 * —— Cordis 的服务访问守卫要求把 'config' 声明进 inject，而 config 本来就不走服务通道。
 */
export function apply(ctx, config = {}) {
  if (!ctx.webServer?.register) throw new Error('Desktop webServer.register is unavailable')
  const root = config?.root
  if (typeof root !== 'string' || root.trim() === '') {
    /* 不裸 throw 白屏：登记一个返回可读错误的健康接口，让前端能显示原因 */
    ctx.effect(() => ctx.webServer.register({
      kind: 'exact', path: '/api/testicular/health',
      handler(req, res) {
        res.writeHead(503, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify({ error: 'root 未配置', detail: 'cordis.patch.yml 需要 config.root: !!js dshHomePath(...)' }))
      },
    }), 'testicular health (unconfigured)')
    return
  }
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: '/api/testicular/health',
    handler(req, res) {
      const send = (status, body) => {
        res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify(body))
      }
      if (typeof ctx.connection?.requestRejection !== 'function') return send(503, { error: 'connection authentication capability unavailable' })
      const rejection = ctx.connection.requestRejection(req)
      if (rejection !== undefined) return send(rejection, { error: 'Authentication required' })
      if (req.method !== 'GET') return send(405, { error: 'Method not allowed' })
      send(200, { ok: true, version: manifest.version, apiVersion: 'v1', capabilities: ['health', 'data-root'], dataRoot: root })
    },
  }), 'testicular health')
}

/** UI 入口文件是否存在（装机自检用） */
export function uiReady() {
  try { return Boolean(readFileSync(new URL('../public/index.html', import.meta.url))) } catch { return false }
}

export const Config = Schema.object({
  root: Schema.string().required(),
})
