import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const sourcePath = new URL('../demo/testicular-demo.json', import.meta.url)
const generatedPath = new URL('../prototypes/v0.2/demo-data.js', import.meta.url)
const source = JSON.parse(readFileSync(sourcePath, 'utf8'))

test('演示数据由单一源生成，且只包含两套明确标注的合成档案', () => {
  const before = readFileSync(generatedPath, 'utf8')
  execFileSync(process.execPath, ['scripts/build-demo-data.mjs'], { cwd: new URL('..', import.meta.url) })
  assert.equal(readFileSync(generatedPath, 'utf8'), before)
  assert.equal(source.profiles.length, 2)
  assert.deepEqual(source.profiles.map(x => x.id), ['demo-a', 'demo-b'])
  assert.ok(source.profiles.every(x => x.name.includes('合成演示')))
})

test('两套档案拥有独立记录 ID，并覆盖不同记录密度', () => {
  const [a, b] = source.profiles
  const aIds = new Set(a.labs.map(x => x.id))
  assert.ok(a.labs.length < b.labs.length)
  assert.ok(b.labs.every(x => !aIds.has(x.id)))
  assert.ok(a.nodes.length && b.nodes.length)
  assert.ok(a.fertility && b.fertility)
})

test('来源快照将失败通道和未核实状态保留为数据', () => {
  assert.equal(source.sources.snapshotCount, 235)
  assert.equal(source.sources.snapshotDate, '2026-11-14')
  assert.equal(source.sources.channelStates.chictr_online, 'FAILED')
  assert.equal(source.sources.channelStates['ictrp 中文词条'], 'FAILED')
})
