import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Workbench } from '../dsh/workbench.js'

test('选择资料目录后重开仍使用所选目录，失败切换不改已保存选择', () => {
  const base = mkdtempSync(join(tmpdir(), 'testipal-root-'))
  const defaultRoot = join(base, 'default')
  const selectedRoot = join(base, 'selected')
  const finalRoot = join(base, 'final')
  const blocked = join(base, 'not-a-directory')
  let workbench
  try {
    workbench = new Workbench({ root: defaultRoot }).open()
    assert.equal(workbench.switchRoot(selectedRoot), selectedRoot)
    writeFileSync(blocked, 'file')
    assert.throws(() => workbench.switchRoot(blocked))
    workbench.close()
    workbench = new Workbench({ root: defaultRoot }).open()
    assert.equal(workbench.dataRoot, selectedRoot)
    assert.equal(workbench.switchRoot(finalRoot), finalRoot)
    workbench.close()
    workbench = new Workbench({ root: defaultRoot }).open()
    assert.equal(workbench.dataRoot, finalRoot, '连续选择目录后仍应回到最后一次选择')
  } finally {
    workbench?.close()
    rmSync(base, { recursive: true, force: true })
  }
})
