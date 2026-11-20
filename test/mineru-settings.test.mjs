import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, statSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { clearMineruToken, mineruSettingsStatus, readMineruToken, saveMineruToken } from '../dsh/settings.js'

test('MinerU Token 保存、掩码、清除共用同一文件且不泄露原文', () => {
  const dir = mkdtempSync(join(tmpdir(), 'testipal-mineru-'))
  const file = join(dir, 'secrets', 'mineru.json')
  try {
    assert.throws(() => saveMineruToken('bad', { file }), /太短/)
    writeFileSync(join(dir, 'marker'), 'preserve')
    const saved = saveMineruToken('sk-testipal-abcdef1234', { file, env: {} })
    assert.equal(readMineruToken({ file }), 'sk-testipal-abcdef1234')
    assert.equal(saved.configured, true)
    assert.equal(saved.source, 'file')
    assert.ok(saved.masked.endsWith('34'))
    assert.equal(JSON.stringify(saved).includes('abcdef1234'), false)
    assert.equal(statSync(file).mode & 0o777, 0o600)
    assert.equal(statSync(join(dir, 'secrets')).mode & 0o777, 0o700)
    writeFileSync(file, JSON.stringify({ token: 'sk-testipal-abcdef1234', other: 'keep' }))
    const cleared = clearMineruToken({ file, env: {} })
    assert.equal(cleared.configured, false)
    assert.deepEqual(JSON.parse(readFileSync(file, 'utf8')), { other: 'keep' })
    writeFileSync(file, '{bad')
    assert.throws(() => saveMineruToken('sk-testipal-new12345', { file }), /合法 JSON/)
    assert.equal(readFileSync(file, 'utf8'), '{bad')
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('MinerU 状态可区分环境变量兜底，且不返回原文', () => {
  const file = join(tmpdir(), `testipal-absent-${process.pid}.json`)
  const status = mineruSettingsStatus({ file, env: { MINERU_TOKEN: 'sk-env-secret1234' } })
  assert.equal(status.source, 'env')
  assert.equal(status.configured, true)
  assert.equal(JSON.stringify(status).includes('secret1234'), false)
})
