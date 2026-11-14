/**
 * 开库 / 迁移 / 关库。测试用 `:memory:`，生产用数据根下的 sqlite 文件。
 *
 * 三条硬约束（家族四条契约的数据面落地）：
 *   ① 迁移只增不改：schema/00*.sql 按编号全部执行；0001 冻结（sha256 见 schema/freeze-contract.md）
 *      后不得修改，只新增 0002+；
 *   ② 迁移账本：schema_migrations 记录已应用的迁移文件名与 sha256，重复执行幂等；
 *   ③ 裸 SELECT 必须 ORDER BY rowid（见 readmodels.js）。
 *
 * 为什么把 schema 读进包里执行而不是预编译：家族的列一致性检查要拿**同一批迁移**
 * 去比对一个新建的库与种子库，两处必须同源；且 files 白名单要随包发出 schema/，
 * 装机后 readdirSync 读得到（check-workbench-package 规则⑨盯的就是这个）。
 */
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SCHEMA_DIR = join(HERE, '..', 'schema');

export function migrationFiles(dir = SCHEMA_DIR) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort();
}

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

/**
 * 打开（或建）库并应用全部迁移。
 * @param {string} file  sqlite 文件路径，或 ':memory:'
 * @returns {DatabaseSync}
 */
export function openStore(file) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');
  migrate(db);
  return db;
}

/** 幂等：已应用过的迁移跳过；未应用的整体在一个事务里执行。 */
export function migrate(db, dir = SCHEMA_DIR) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    migration TEXT PRIMARY KEY, sha256 TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);
  const applied = new Set(db.prepare('SELECT migration FROM schema_migrations ORDER BY rowid').all().map((r) => r.migration));
  const files = migrationFiles(dir);
  let ran = 0;
  for (const f of files) {
    if (applied.has(f)) continue;
    const sql = readFileSync(join(dir, f), 'utf8');
    db.exec('BEGIN');
    try {
      db.exec(sql);
      db.prepare('INSERT INTO schema_migrations (migration, sha256) VALUES (?,?)').run(f, sha256(sql));
      db.exec('COMMIT');
      ran++;
    } catch (error) {
      db.exec('ROLLBACK');
      throw new Error(`迁移 ${f} 失败：${error.message}`);
    }
  }
  return { ran, total: files.length };
}

export function closeStore(db) {
  try { db.close(); } catch { /* 已关闭 */ }
}

/** 表清单（供检查器复用；排除 sqlite 内部表与账本表）。 */
export function tableNames(db) {
  return db.prepare(`SELECT name FROM sqlite_master WHERE type='table'
    AND name NOT LIKE 'sqlite_%' AND name <> 'schema_migrations'`).all().map((r) => r.name);
}
