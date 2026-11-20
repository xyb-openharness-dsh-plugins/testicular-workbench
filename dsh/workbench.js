/**
 * 领域服务：把「数据根 → 开库 → 迁移 → 播种 → 读模型/写模型」收在一个可测对象里。
 *
 * 为什么单独一层：`dsh/index.js` 要 import Schemastery（宿主提供的 peer，本仓装不上），
 * 那一行会让整个入口不可单测。把可测逻辑放这里，入口只留 wiring。
 *
 * 写入纪律（schema/0001_initial.sql 四条契约）：
 *   - 新建档案 is_demo=0，与 demo 档案并存；
 *   - 记录只新增行（ver=1），不覆盖旧行；demo 档案不可删；
 *   - 切换资料目录：先开新库成功再替换，失败回滚（不丢当前可用的库）。
 */
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { openStore, closeStore, migrate } from './store.js';
import { seedDemoData, hasDemoData } from './demo.js';
import { readBootstrap, bootstrapForExit } from './readmodels.js';
import { DB_FILE, HOME_DIR } from '../lib/identity.js';
import { version, displayVersion, build as buildDate } from '../lib/version.js';

const INT_FIELDS = new Set(['plan_quote_id', 'done_flag', 'ord', 'answered_flag', 'value', 'is_private']);

/** 记录写入白名单：target_table → 可写字段（其余字段一律拒绝，ver 固定 1 新行）。 */
export const RECORD_TABLES = {
  lab_results: ['metric_key', 'measured_on', 'value', 'value_text', 'unit', 'method', 'org', 'report_id', 'note', 'is_private'],
  imaging_records: ['study_on', 'study_type', 'region', 'impression', 'org', 'report_id', 'note', 'is_private'],
  course_events: ['event_on', 'event_type', 'title', 'detail', 'org', 'note', 'is_private'],
  doctor_quotes: ['quote_on', 'category', 'quote_text', 'source', 'note', 'is_private'],
  monitoring_nodes: ['due_on', 'node_type', 'plan_quote_id', 'done_flag', 'done_on', 'linked_note', 'is_private'],
  fertility_records: ['record_on', 'step', 'institution', 'note', 'is_private'],
  visit_questions: ['question_text', 'ord', 'answered_flag', 'answered_note', 'created_on', 'is_private'],
  notes: ['note_on', 'text', 'is_private'],
};

export class Workbench {
  /**
   * @param {object} options
   * @param {string} options.root      用户资料目录（必须由用户明确指定；调用方负责校验）
   * @param {boolean} [options.seedDemo] 首次打开是否写入演示数据（默认 true，仅空库生效）
   */
  constructor({ root, seedDemo = true } = {}) {
    if (typeof root !== 'string' || root.trim() === '') throw new Error('Workbench 需要 root（用户资料目录）');
    this.root = root;
    this.initialRoot = root;
    this.dbFile = join(root, DB_FILE);
    this.db = null;
    this.seedDemo = seedDemo;
  }

  /** 打开（幂等）。迁移与播种都在这里完成。 */
  open() {
    if (this.db) return this;
    this.db = openStore(this.dbFile);
    this.migrations = migrate(this.db);
    /* 用户上次在面板里选过的资料目录优先于 cordis 默认值（目录还在才生效）。 */
    if (!this._rootApplied) {
      this._rootApplied = true;
      try {
        const row = this.db.prepare("SELECT value FROM app_setting WHERE key='data_root'").get();
        if (row?.value && row.value !== this.root && existsSync(row.value)) {
          closeStore(this.db);
          this.root = row.value;
          this.dbFile = join(this.root, DB_FILE);
          this.db = openStore(this.dbFile);
          this.migrations = migrate(this.db);
        }
      } catch { /* 旧库没有 app_setting 也不该拦住打开 */ }
    }
    this.seeded = this.seedDemo ? seedDemoData(this.db) : { skipped: true, profiles: 0 };
    return this;
  }

  get dataRoot() { return this.root }

  /** 切换资料目录：先开新库成功再替换，失败回滚到原库。 */
  switchRoot(nextRoot) {
    this.open();
    const dir = String(nextRoot || '').trim();
    if (!dir || dir === this.root) return this.root;
    const prevRoot = this.root;
    const prevFile = this.dbFile;
    const prevDb = this.db;
    let nextDb = null;
    let prevClosed = false;
    let pointerDb = null;
    let previousPointer;
    let pointerChanged = false;
    try {
      nextDb = openStore(join(dir, DB_FILE));
      migrate(nextDb);
      /* 新库完全就绪后才替换：openStore/migrate 抛错都走不到这里 */
      const nextSeeded = this.seedDemo ? seedDemoData(nextDb) : { skipped: true, profiles: 0 };
      const setRoot = (db, value) => db.prepare("INSERT INTO app_setting(key,value,updated_at) VALUES('data_root',?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at").run(value);
      setRoot(nextDb, dir);
      /* 启动总是先打开配置默认目录；连续换目录也必须更新这个固定锚点。 */
      pointerDb = prevRoot === this.initialRoot ? prevDb
        : dir === this.initialRoot ? nextDb : openStore(join(this.initialRoot, DB_FILE));
      if (pointerDb !== prevDb && pointerDb !== nextDb) migrate(pointerDb);
      previousPointer = pointerDb.prepare("SELECT value FROM app_setting WHERE key='data_root'").get()?.value;
      setRoot(pointerDb, dir);
      pointerChanged = true;
      if (pointerDb !== prevDb && pointerDb !== nextDb) { closeStore(pointerDb); pointerDb = null; }
      closeStore(prevDb);
      prevClosed = true;
      this.dbFile = join(dir, DB_FILE);
      this.db = nextDb;
      this.root = dir;
      this.seeded = nextSeeded;
      return this.root;
    } catch (error) {
      if (pointerDb && pointerDb !== prevDb && pointerDb !== nextDb) closeStore(pointerDb);
      if (nextDb) closeStore(nextDb);
      if (pointerChanged) {
        let restoreDb = null;
        try {
          restoreDb = !prevClosed && prevRoot === this.initialRoot ? prevDb : openStore(join(this.initialRoot, DB_FILE));
          if (previousPointer === undefined) restoreDb.prepare("DELETE FROM app_setting WHERE key='data_root'").run();
          else restoreDb.prepare("UPDATE app_setting SET value=?, updated_at=datetime('now') WHERE key='data_root'").run(previousPointer);
        } catch { /* 保留原始切换错误；打开旧库后仍可人工处理。 */ }
        finally { if (restoreDb && restoreDb !== prevDb) closeStore(restoreDb); }
      }
      this.root = prevRoot;
      this.dbFile = prevFile;
      if (!prevClosed) {
        this.db = prevDb;
      } else {
        this.db = null;
        try { this.db = openStore(this.dbFile); } catch { this.db = null; }
      }
      throw error;
    }
  }

  listSubjects() {
    this.open();
    return this.db.prepare('SELECT profile_key, name, meta, is_demo, created_on FROM subjects ORDER BY rowid DESC').all()
      .map((r) => ({ profileKey: r.profile_key, name: r.name, meta: r.meta, isDemo: !!r.is_demo, createdOn: r.created_on }));
  }

  /** 新建档案：is_demo=0；profile_key 用 local-<时间戳>，不与 demo 撞键。 */
  createSubject({ name, meta } = {}) {
    this.open();
    const clean = String(name || '').trim();
    if (!clean) throw new Error('请填写档案名（可以是昵称）');
    if (clean.length > 20) throw new Error('档案名太长（≤20 字）');
    const key = 'local-' + Date.now().toString(36);
    this.db.prepare('INSERT INTO subjects (profile_key, name, meta, is_demo) VALUES (?,?,?,0)').run(key, clean, String(meta || '').trim() || null);
    return { profileKey: key, name: clean, records: this.listSubjects() };
  }

  /** demo 档案（is_demo=1）不可删。 */
  deleteSubject(profileKey) {
    this.open();
    const key = String(profileKey || '');
    const info = this.db.prepare('DELETE FROM subjects WHERE profile_key = ? AND is_demo = 0').run(key);
    const changed = Number(info?.changes ?? 0);
    return { deleted: changed > 0 ? key : null, reason: changed > 0 ? undefined : '不存在或演示档案不可删除', records: this.listSubjects() };
  }

  /**
   * 追加一条记录：ver=1 新行，不覆盖旧行。
   * @param {object} input { profileKey, targetTable, ...字段 }
   */
  addRecord(input = {}) {
    this.open();
    const profileKey = String(input.profileKey || '').trim();
    if (!profileKey) throw new Error('缺少 profileKey');
    const targetTable = String(input.targetTable || '');
    const fields = RECORD_TABLES[targetTable];
    if (!fields) throw new Error(`不支持的 target_table：${targetTable || '（空）'}`);
    const exists = this.db.prepare('SELECT 1 FROM subjects WHERE profile_key = ?').get(profileKey);
    if (!exists) throw new Error(`档案不存在：${profileKey}`);
    const payload = input.record && typeof input.record === 'object' ? input.record : input;
    const cols = ['profile_key'];
    const vals = [profileKey];
    for (const f of fields) {
      if (!(f in payload)) continue;
      let v = payload[f];
      if (f === 'is_private') { v = v ? 1 : 0; }
      else if (INT_FIELDS.has(f)) {
        if (v === null || v === undefined || v === '') { v = null; }
        else { const n = Number(v); if (!Number.isFinite(n)) throw new Error(`字段 ${f} 不是数值：${JSON.stringify(v)}`); v = n; }
      } else if (v !== null && v !== undefined) {
        v = String(v);
        if (v === '') v = null;
      }
      cols.push(f);
      vals.push(v ?? null);
    }
    /* NOT NULL 硬校验（schema 层也会拦，这里给出可读错误） */
    const required = { lab_results: 'metric_key', doctor_quotes: 'quote_text', visit_questions: 'question_text', notes: 'text' };
    if (required[targetTable]) {
      const idx = cols.indexOf(required[targetTable]);
      if (idx < 0 || vals[idx] == null) throw new Error(`缺少必填字段：${required[targetTable]}`);
    }
    if (targetTable === 'lab_results') {
      const mk = vals[cols.indexOf('metric_key')];
      const known = this.db.prepare('SELECT 1 FROM metric_defs WHERE key = ?').get(String(mk));
      if (!known) throw new Error(`未知指标 key：${mk}（目录见 metric_defs）`);
    }
    let ver = 1;
    const oldId = input.supersedes == null ? null : Number(input.supersedes);
    let old = null;
    if (oldId !== null) {
      if (!Number.isInteger(oldId) || oldId < 1) throw new Error('无效的 supersedes');
      old = this.db.prepare(`SELECT id, profile_key, ver, superseded_by FROM ${targetTable} WHERE id = ?`).get(oldId);
      if (!old || old.profile_key !== profileKey || old.superseded_by != null) throw new Error('待更正记录不存在、档案不匹配或已被更正');
      ver = Number(old.ver || 1) + 1;
    }
    const placeholders = cols.map(() => '?').join(',');
    const insert = this.db.prepare(`INSERT INTO ${targetTable} (${cols.join(',')}, ver) VALUES (${placeholders}, ?)`);
    const link = oldId === null ? null : this.db.prepare(`UPDATE ${targetTable} SET superseded_by = ? WHERE id = ? AND superseded_by IS NULL`);
    let id;
    if (oldId !== null) this.db.exec('BEGIN IMMEDIATE');
    try {
      const row = insert.run(...vals, ver);
      id = Number(row.lastInsertRowid);
      if (oldId !== null && Number(link.run(id, oldId).changes) !== 1) throw new Error('更正冲突：旧记录已变化，请刷新后重试');
      if (oldId !== null) this.db.exec('COMMIT');
    } catch (error) {
      if (oldId !== null) this.db.exec('ROLLBACK');
      throw error;
    }
    return { ok: true, targetTable, id, profileKey, ver, supersedes: oldId };
  }

  close() {
    if (this.db) { closeStore(this.db); this.db = null; }
  }

  get stats() {
    if (!this.db) return null;
    const count = (t) => this.db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c;
    return {
      profiles: count('subjects'),
      metrics: count('metric_defs'),
      labs: count('lab_results'),
      imaging: count('imaging_records'),
      events: count('course_events'),
      quotes: count('doctor_quotes'),
      nodes: count('monitoring_nodes'),
      fertility: count('fertility_records'),
      questions: count('visit_questions'),
      notes: count('notes'),
      hasDemo: count('subjects') > 0,
    };
  }

  /** 读模型（默认全量带私密标记；私密过滤只发生在 export/ai 两个出口）。 */
  bootstrap() {
    this.open();
    return readBootstrap(this.db);
  }

  /** 导出：服务端强制过滤 is_private=1（三出口之一）。 */
  exportData() {
    this.open();
    return bootstrapForExit(this.db, 'export');
  }

  /** 供宿主 /health 用：只报事实，不报"是否已验证"。 */
  health() {
    return {
      ok: true,
      version,
      apiVersion: 'v1',
      capabilities: ['bootstrap', 'health', 'data-root', 'subjects', 'records', 'export'],
      dataRoot: this.root,
    };
  }

  status() {
    return {
      version, displayVersion, buildDate,
      homeDir: HOME_DIR,
      dbFile: DB_FILE,
      root: this.root,
      capabilities: ['bootstrap', 'health', 'data-root', 'subjects', 'records', 'export'],
      stats: this.stats,
      seeded: this.seeded ?? null,
      migrations: this.migrations ?? null,
    };
  }

  /** 演示数据重载（幂等；force 才清空重播，仅供开发用） */
  reloadDemo(force = false) {
    this.open();
    return seedDemoData(this.db, { force });
  }

  get hasData() {
    this.open();
    return hasDemoData(this.db);
  }
}

export { readBootstrap, bootstrapForExit, seedDemoData, hasDemoData, openStore, closeStore, migrate };
