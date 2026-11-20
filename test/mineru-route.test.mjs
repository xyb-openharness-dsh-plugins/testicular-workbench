import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHandler } from '../dsh/server.js'

test('MinerU 设置 HTTP 往返可保存和清除，响应始终不含 Token 原文', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'testipal-route-'))
  const previous = process.env.TESTIPAL_MINERU_SECRET
  const previousFallback = process.env.MINERU_TOKEN
  const file = join(dir, 'secrets', 'mineru.json')
  process.env.TESTIPAL_MINERU_SECRET = file
  delete process.env.MINERU_TOKEN
  const handler = createHandler({ publicDir: null, services: {} })
  const request = async (method, body) => {
    const req = new EventEmitter()
    req.url = '/api/settings/mineru'
    req.method = method
    let status = 0
    const response = new Promise((resolve) => {
      const res = {
        writeHead: (code) => { status = code },
        end: (text) => resolve({ status, text, body: JSON.parse(text) }),
      }
      void handler(req, res)
    })
    queueMicrotask(() => { if (body) req.emit('data', body); req.emit('end') })
    return response
  }
  try {
    const before = await request('GET')
    assert.equal(before.body.configured, false)
    const invalid = await request('POST', JSON.stringify({ token: 'bad' }))
    assert.equal(invalid.status, 400)
    const token = 'sk-route-test-123456789'
    const savedResponse = await request('POST', JSON.stringify({ token }))
    assert.equal(savedResponse.status, 200)
    assert.equal(savedResponse.text.includes(token), false)
    assert.equal(savedResponse.body.source, 'file')
    assert.equal(statSync(file).mode & 0o777, 0o600)
    const after = await request('GET')
    assert.equal(after.body.configured, true)
    const cleared = await request('POST', '{"action":"clear"}')
    assert.equal(cleared.body.configured, false)
  } finally {
    if (previous === undefined) delete process.env.TESTIPAL_MINERU_SECRET
    else process.env.TESTIPAL_MINERU_SECRET = previous
    if (previousFallback === undefined) delete process.env.MINERU_TOKEN
    else process.env.MINERU_TOKEN = previousFallback
    rmSync(dir, { recursive: true, force: true })
  }
})
