/**
 * 读模型：把 SQLite 的行聚合成档案级读模型（bootstrap）。
 *
 * 规则（家族契约）：
 *   - 裸 SELECT 一律 ORDER BY rowid（稳定读序；插入顺序即展示顺序）；
 *   - 显式 null：任何缺失字段用 ?? null 补齐，不用空串/0 冒充；
 *   - 私密默认不过滤：bootstrap 返回全量、私密标记随行返回（页面按「私密」徽标展示，
 *     聚合口径由界面自己控制）；导出与 AI 上下文两个出口走 bootstrapForExit，
 *     在读模型层剥掉 is_private=1 的行（三出口过滤在服务层强制生效两个）；
 *   - 行 id 用 rowid（事实表只增不改：ver=1 新行，不覆盖旧行，rowid 天然稳定）；
 *   - 最近值（latest）：同一 metric_key 取 rowid 最大的一行；method/org 随行返回，
 *     可比组 = method + org，不做跨组合并（趋势合并是 M2 的界面课题，不在读模型层做）。
 */

export function readMetricDefs(db) {
  return db.prepare('SELECT * FROM metric_defs ORDER BY ord, rowid').all();
}

export function readSectionTitles(db, profileKey) {
  return db.prepare('SELECT * FROM section_titles WHERE profile_key = ? ORDER BY ord, rowid').all(profileKey);
}

export function readMetricGroupTitles(db, profileKey) {
  return db.prepare('SELECT * FROM metric_group_titles WHERE profile_key = ? ORDER BY ord, rowid').all(profileKey);
}

export function readBootstrap(db) {
  const rows = db.prepare('SELECT * FROM subjects ORDER BY rowid').all();
  const today = new Date();
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return {
    TODAY: todayText,
    profiles: rows.map((pr) => readSubject(db, pr)),
  };
}

/** 最近值：同一 metric_key 取 rowid 最大一行（labs 按 rowid 升序，后写覆盖；显式 null 原样保留）。 */
export function readLatestByMetric(labs) {
  const latest = {};
  for (const l of labs) {
    latest[l.metric] = {
      value: l.value, valueText: l.valueText, date: l.date,
      unit: l.unit, method: l.method, org: l.org, ver: l.ver,
    };
  }
  return latest;
}

export function readSubject(db, pr) {
  const key = pr.profile_key;

  const metricDefs = readMetricDefs(db);
  const metricTitle = {};
  for (const md of metricDefs) metricTitle[md.key] = md.title;

  const labs = db.prepare('SELECT * FROM lab_results WHERE profile_key = ? ORDER BY rowid').all(key).map((l) => ({
    id: l.id, metric: l.metric_key, metricTitle: metricTitle[l.metric_key] ?? null,
    date: l.measured_on ?? null, value: l.value ?? null, valueText: l.value_text ?? null,
    unit: l.unit ?? null, method: l.method ?? null, org: l.org ?? null,
    reportId: l.report_id ?? null, private: !!l.is_private, note: l.note ?? null, ver: l.ver ?? 1,
  }));

  const imaging = db.prepare('SELECT * FROM imaging_records WHERE profile_key = ? ORDER BY rowid').all(key).map((r) => ({
    id: r.id, date: r.study_on ?? null, type: r.study_type ?? null, region: r.region ?? null,
    impression: r.impression ?? null, org: r.org ?? null, reportId: r.report_id ?? null,
    private: !!r.is_private, note: r.note ?? null, ver: r.ver ?? 1,
  }));

  const events = db.prepare('SELECT * FROM course_events WHERE profile_key = ? ORDER BY rowid').all(key).map((e) => ({
    id: e.id, date: e.event_on ?? null, type: e.event_type ?? null, title: e.title ?? null,
    detail: e.detail ?? null, org: e.org ?? null, private: !!e.is_private, note: e.note ?? null, ver: e.ver ?? 1,
  }));

  const quotes = db.prepare('SELECT * FROM doctor_quotes WHERE profile_key = ? ORDER BY rowid').all(key).map((q) => ({
    id: q.id, date: q.quote_on ?? null, category: q.category ?? null, text: q.quote_text ?? null,
    source: q.source ?? null, private: !!q.is_private, note: q.note ?? null, ver: q.ver ?? 1,
  }));

  const nodes = db.prepare('SELECT * FROM monitoring_nodes WHERE profile_key = ? ORDER BY rowid').all(key).map((n) => ({
    id: n.id, dueOn: n.due_on ?? null, nodeType: n.node_type ?? null, planQuoteId: n.plan_quote_id ?? null,
    done: !!n.done_flag, doneOn: n.done_on ?? null, linkedNote: n.linked_note ?? null,
    private: !!n.is_private, ver: n.ver ?? 1,
  }));

  const fertility = db.prepare('SELECT * FROM fertility_records WHERE profile_key = ? ORDER BY rowid').all(key).map((f) => ({
    id: f.id, date: f.record_on ?? null, step: f.step ?? null, institution: f.institution ?? null,
    private: !!f.is_private, note: f.note ?? null, ver: f.ver ?? 1,
  }));

  const questions = db.prepare('SELECT * FROM visit_questions WHERE profile_key = ? ORDER BY rowid').all(key).map((q) => ({
    id: q.id, text: q.question_text ?? null, ord: q.ord ?? null, answered: !!q.answered_flag,
    answeredNote: q.answered_note ?? null, createdOn: q.created_on ?? null,
    private: !!q.is_private, ver: q.ver ?? 1,
  }));

  const notes = db.prepare('SELECT * FROM notes WHERE profile_key = ? ORDER BY rowid').all(key).map((n) => ({
    id: n.id, date: n.note_on ?? null, text: n.text ?? null,
    private: !!n.is_private, ver: n.ver ?? 1,
  }));

  return {
    id: key,
    name: pr.name ?? null,
    tag: pr.meta ?? null,
    headline: pr.headline ?? null,
    actionPlan: pr.action_plan ?? null,
    dashKeys: pr.dash_keys ? JSON.parse(pr.dash_keys) : null,
    isDemo: !!pr.is_demo,
    createdOn: pr.created_on ?? null,
    sections: readSectionTitles(db, key).map((s) => ({ key: s.key, title: s.title, ord: s.ord })),
    metricGroups: readMetricGroupTitles(db, key).map((g) => ({ category: g.category, title: g.title, ord: g.ord })),
    metrics: metricDefs.map((m) => ({ key: m.key, title: m.title, category: m.category, unit: m.unit, color: m.color, ord: m.ord })),
    latest: readLatestByMetric(labs),
    labs, imaging, events, quotes, nodes, fertility, questions, notes,
  };
}

/** 私密行剥离（深拷贝）：导出与 AI 上下文出口在读模型层强制过滤 is_private=1。 */
function stripPrivate(data) {
  const clone = JSON.parse(JSON.stringify(data));
  for (const p of clone.profiles || []) {
    p.labs = (p.labs || []).filter((x) => !x.private);
    p.imaging = (p.imaging || []).filter((x) => !x.private);
    p.events = (p.events || []).filter((x) => !x.private);
    p.quotes = (p.quotes || []).filter((x) => !x.private);
    p.nodes = (p.nodes || []).filter((x) => !x.private);
    p.fertility = (p.fertility || []).filter((x) => !x.private);
    p.questions = (p.questions || []).filter((x) => !x.private);
    p.notes = (p.notes || []).filter((x) => !x.private);
    /* 最近值从过滤后的 labs 重算：私密行的数值不许从 latest 侧漏 */
    p.latest = readLatestByMetric(p.labs);
  }
  return clone;
}

/**
 * 三出口读法：
 *   - 'dashboard'（默认）：页面渲染需要私密标记，返回全量；
 *   - 'export' / 'ai'：读模型层剥掉私密行，调用方拿到的数据里不存在 is_private=1 的内容。
 */
export function bootstrapForExit(db, exit = 'dashboard') {
  const full = readBootstrap(db);
  if (exit === 'export' || exit === 'ai') return stripPrivate(full);
  return full;
}
