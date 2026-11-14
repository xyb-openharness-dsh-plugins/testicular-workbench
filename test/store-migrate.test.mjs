import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openStore, closeStore, migrate, tableNames, migrationFiles } from '../dsh/store.js';
import { Workbench } from '../dsh/workbench.js';

test('迁移：内存全建表 + 账本记 sha256，幂等重跑不再执行', () => {
  const db = openStore(':memory:');
  try {
    const tables = tableNames(db);
    /* 0001 建 15 表 + 0002 建 app_setting（subjects/section_titles/metric_defs/metric_group_titles/
       lab_results/imaging_records/course_events/doctor_quotes/monitoring_nodes/fertility_records/
       visit_questions/notes/import_jobs/candidates/attachments + app_setting） */
    assert.equal(tables.length, 16, `表数 ${tables.length} ≠ 16：${tables.join(',')}`);
    const again = migrate(db);
    assert.equal(again.ran, 0, '迁移不幂等：重跑又执行了');
    const ledger = db.prepare('SELECT migration, sha256 FROM schema_migrations ORDER BY rowid').all();
    assert.equal(ledger.length, migrationFiles().length, 'ledger 行数与迁移文件数不符');
    for (const row of ledger) assert.match(row.sha256, /^[0-9a-f]{64}$/, `ledger ${row.migration} 的 sha256 缺失`);
  } finally { closeStore(db); }
});

test('播种幂等：空库灌两套 demo 档案；重开/重播不翻倍', async () => {
  const root = mkdtempSync(join(tmpdir(), 'twb-store-'));
  const wb = new Workbench({ root });
  try {
    wb.open();
    const first = wb.stats;
    assert.equal(first.profiles, 2, `首播档案数 ${first.profiles} ≠ 2（A/B 两套合成档案）`);
    assert.ok(first.hasDemo, 'stats 未报 hasDemo');
    /* B 档案记录量下限：标志物 ≥12 条、影像 3 次、监测节点 8 个含完成态 */
    const boot = wb.bootstrap();
    const b = boot.profiles.find((p) => p.id === 'demo-b');
    const a = boot.profiles.find((p) => p.id === 'demo-a');
    assert.ok(a && b, 'bootstrap 缺 demo-a/demo-b');
    assert.ok(a.isDemo && b.isDemo, 'demo 档案未标 isDemo');
    const markerLabs = b.labs.filter((l) => ['afp', 'hcg', 'ldh'].includes(l.metric));
    assert.ok(markerLabs.length >= 12, `B 标志物条数 ${markerLabs.length} < 12`);
    assert.equal(b.imaging.length, 3, `B 影像条数 ${b.imaging.length} ≠ 3`);
    assert.equal(b.nodes.length, 8, `B 监测节点数 ${b.nodes.length} ≠ 8`);
    assert.ok(b.nodes.some((n) => n.done) && b.nodes.some((n) => !n.done), 'B 节点缺完成态/未完成态');
    assert.equal(b.notes.filter((n) => n.private).length, 1, 'B 私密笔记应为 1 条');
    assert.ok(b.labs.some((l) => l.date == null) || a.labs.some((l) => l.date == null), 'demo 数据缺「未知→NULL」示例');
    /* 重开（幂等）与重播（非 force 跳过）都不翻倍 */
    wb.close();
    wb.open();
    assert.equal(wb.stats.profiles, 2, '重开后档案数变了（播种不幂等）');
    const again = wb.reloadDemo(false);
    assert.equal(again.skipped, true, '非空库重播未跳过');
    assert.equal(wb.stats.profiles, 2, '重播后档案数变了');
    /* 日期纪律：demo 行不允许出现 2026 以外年份 */
    for (const p of boot.profiles) {
      for (const l of p.labs) if (l.date) assert.match(l.date, /^2026-/, `lab 日期越界：${l.date}`);
      for (const e of p.events) if (e.date) assert.match(e.date, /^2026-/, `event 日期越界：${e.date}`);
      for (const n of p.nodes) if (n.dueOn) assert.match(n.dueOn, /^2026-/, `node 日期越界：${n.dueOn}`);
    }
  } finally { wb.close(); }
});
