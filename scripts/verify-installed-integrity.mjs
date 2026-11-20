#!/usr/bin/env node
/** Compare the Desktop installation with a pinned, trusted tgz. Never modifies either. */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = fileURLToPath(new URL('..', import.meta.url))
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex')

function files(root, sub = '') {
  const found = []
  for (const name of readdirSync(join(root, sub)).sort()) {
    const rel = join(sub, name)
    const stat = lstatSync(join(root, rel))
    if (stat.isDirectory()) found.push(...files(root, rel))
    else found.push({ rel, kind: stat.isFile() ? 'file' : 'other' })
  }
  return found
}

export function verifyInstalled({ archive, installed, expectedSha256 }) {
  if (!/^[0-9a-f]{64}$/i.test(expectedSha256 || '')) throw new Error('必须提供可信的 SHA-256')
  if (!existsSync(archive)) throw new Error(`找不到安装包：${archive}`)
  if (!existsSync(installed)) throw new Error(`找不到安装副本：${installed}`)
  const archiveSha256 = sha(archive)
  if (archiveSha256 !== expectedSha256.toLowerCase()) {
    return { ok: false, archiveSha256, expectedSha256, errors: ['安装包 SHA-256 与可信记录不一致；停止比较，不能用此包恢复'], missing: [], changed: [], extra: [] }
  }
  const temp = mkdtempSync(join(tmpdir(), 'testicular-integrity-'))
  try {
    const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n')
    if (entries.some((entry) => !entry.startsWith('package/') || entry.split('/').includes('..'))) throw new Error('安装包含非法路径')
    execFileSync('tar', ['-xzf', archive, '-C', temp])
    const unpacked = join(temp, 'package')
    const expected = new Map(files(unpacked).map((item) => [item.rel, item]))
    const actual = new Map(files(installed).map((item) => [item.rel, item]))
    const missing = [...expected.keys()].filter((name) => !actual.has(name))
    const extra = [...actual.keys()].filter((name) => !expected.has(name))
    const changed = [...expected.keys()].filter((name) => actual.has(name) && (
      expected.get(name).kind !== 'file' || actual.get(name).kind !== 'file' ||
      sha(join(unpacked, name)) !== sha(join(installed, name))
    ))
    return { ok: missing.length + changed.length + extra.length === 0, archiveSha256, expectedSha256, fileCount: expected.size, missing, changed, extra, errors: [] }
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
}

function option(name) { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1] }
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const pin = JSON.parse(readFileSync(join(repo, 'release/integrity.json'), 'utf8'))
    const archive = resolve(option('--archive') || join(repo, 'release', pin.archive))
    const expectedSha256 = option('--sha256') || pin.sha256
    let installed = option('--installed')
    if (!installed) {
      const check = JSON.parse(execFileSync(process.execPath, [join(repo, 'scripts/check-install.mjs'), '--json'], { encoding: 'utf8' }))
      if (!check.ok) throw new Error('DSH Desktop 实际 profile 尚未登记本包')
      installed = join(check.target.home, 'profiles', check.target.profile, 'node_modules', ...pin.package.split('/'))
    }
    const result = verifyInstalled({ archive, installed: resolve(installed), expectedSha256 })
    console.log(JSON.stringify({ package: pin.package, installed, ...result }, null, 2))
    process.exitCode = result.ok ? 0 : 1
  } catch (error) {
    console.error(`安装完整性校验失败：${error.message}`)
    process.exitCode = 1
  }
}
