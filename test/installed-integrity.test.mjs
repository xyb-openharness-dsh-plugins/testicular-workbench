import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { verifyInstalled } from '../scripts/verify-installed-integrity.mjs'

test('安装副本校验能发现改动、缺失、多余文件和不可信安装包', () => {
  const dir = mkdtempSync(join(tmpdir(), 'integrity-test-'))
  try {
    const source = join(dir, 'source')
    const packageDir = join(source, 'package')
    const installed = join(dir, 'installed')
    const archive = join(dir, 'package.tgz')
    mkdirSync(packageDir, { recursive: true })
    writeFileSync(join(packageDir, 'index.js'), 'export const safe = true\n')
    writeFileSync(join(packageDir, 'package.json'), '{"version":"1.0.0"}\n')
    execFileSync('tar', ['-czf', archive, '-C', source, 'package'])
    const expectedSha256 = createHash('sha256').update(readFileSync(archive)).digest('hex')
    cpSync(packageDir, installed, { recursive: true })
    const check = () => verifyInstalled({ archive, installed, expectedSha256 })
    assert.equal(check().ok, true)
    writeFileSync(join(installed, 'index.js'), 'export const safe = false\n')
    assert.deepEqual(check().changed, ['index.js'])
    unlinkSync(join(installed, 'package.json'))
    assert.deepEqual(check().missing, ['package.json'])
    writeFileSync(join(installed, 'extra.js'), 'unsafe\n')
    assert.deepEqual(check().extra, ['extra.js'])
    writeFileSync(archive, 'not the trusted archive')
    assert.match(check().errors[0], /SHA-256/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
