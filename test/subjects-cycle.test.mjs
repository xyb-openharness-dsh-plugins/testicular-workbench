import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Workbench } from '../dsh/workbench.js';

test('subjects 闭环：创建(is_demo=0) → 列表 → 切库回滚 → 删除（demo 不可删）', () => {
  const root = mkdtempSync(join(tmpdir(), 'twb-subjects-'));
  const wb = new Workbench({ root });
  try {
    wb.open();
    /* 创建：is_demo=0，profile_key 以 local- 开头，不与 demo 撞键 */
    const created = wb.createSubject({ name: '测试甲' });
    assert.match(created.profileKey, /^local-/, '新建档案 key 应以 local- 开头');
    let list = wb.listSubjects();
    const mine = list.find((s) => s.profileKey === created.profileKey);
    assert.ok(mine, '新建档案未出现在列表');
    assert.equal(mine.isDemo, false, '新建档案必须是 is_demo=0');
    assert.equal(mine.name, '测试甲');
    /* 名字上限 20 字与空名拒绝 */
    assert.throws(() => wb.createSubject({ name: '' }), /档案名/);
    assert.throws(() => wb.createSubject({ name: '一'.repeat(21) }), /≤20 字/);
    /* demo 档案不可删，真实档案可删 */
    const demoKey = list.find((s) => s.isDemo)?.profileKey;
    assert.ok(demoKey, '列表里应有 demo 档案');
    const denied = wb.deleteSubject(demoKey);
    assert.equal(denied.deleted, null, 'demo 档案被误删');
    assert.ok(denied.reason, '拒绝删除时应给原因');
    /* 记录追加：ver=1 新行；私密笔记进 bootstrap 但导出必须过滤 */
    const rec = wb.addRecord({ profileKey: created.profileKey, targetTable: 'notes', record: { note_on: '2026-11-01', text: '私有备注', is_private: 1 } });
    assert.ok(rec.ok && rec.id > 0, 'addRecord 未返回新行 id');
    const lab = wb.addRecord({ profileKey: created.profileKey, targetTable: 'lab_results', record: { metric_key: 'afp', measured_on: '2026-11-01', value: 2.2, unit: 'ng/mL', org: '自录' } });
    assert.ok(lab.ok, 'lab_results 写入失败');
    assert.throws(() => wb.addRecord({ profileKey: created.profileKey, targetTable: 'subjects', record: {} }), /target_table/);
    assert.throws(() => wb.addRecord({ profileKey: 'local-nothing', targetTable: 'notes', record: { text: 'x' } }), /档案不存在/);
    const boot = wb.bootstrap();
    const mineModel = boot.profiles.find((p) => p.id === created.profileKey);
    assert.equal(mineModel.notes.filter((n) => n.private).length, 1, 'bootstrap（看板出口）应保留私密行与标记');
    assert.equal(mineModel.latest.afp.value, 2.2, '最近值未聚合');
    const exported = wb.exportData();
    const exportedMine = exported.profiles.find((p) => p.id === created.profileKey);
    assert.equal(exportedMine.notes.length, 0, '导出出口不得包含 is_private=1 的行');
    assert.equal(exportedMine.labs.length, 1, '导出应保留非私密行');
    /* switchRoot：先开新库成功再替换；失败回滚 */
    const nextRoot = mkdtempSync(join(tmpdir(), 'twb-next-'));
    const before = wb.dataRoot;
    wb.switchRoot(nextRoot);
    assert.equal(wb.dataRoot, nextRoot, 'switchRoot 未切换');
    assert.equal(wb.stats.profiles, 2, '新库未按约定播种 demo（新库也应有 A/B）');
    const badRoot = join(tmpdir(), `twb-bad-${Date.now().toString(36)}`);
    writeFileSync(badRoot, 'not a directory');
    assert.throws(() => wb.switchRoot(badRoot), '指向文件的路径应当失败');
    assert.equal(wb.dataRoot, nextRoot, '切换失败后未回滚到原目录');
    assert.ok(existsSync(join(nextRoot, 'testicular-workbench.sqlite')), '切换后的库文件应存在');
    wb.switchRoot(root);
    assert.equal(wb.dataRoot, root, 'switchRoot 回切失败');
    /* 删除真实档案 */
    const done = wb.deleteSubject(created.profileKey);
    assert.equal(done.deleted, created.profileKey, '真实档案删除失败');
    list = wb.listSubjects();
    assert.ok(!list.some((s) => s.profileKey === created.profileKey), '删除后仍在列表');
  } finally { wb.close(); }
});
