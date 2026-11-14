/**
 * 演示数据种子（骨架版）：首次开库（空库）灌 A/B 两套合成档案；幂等：非空库跳过（force 可重灌）。
 *
 * 纪律（本阶段口径，M2 会全量重写）：
 *   - 两套档案都 is_demo=1，界面显示「合成示例」标记；用户新建的档案走 is_demo=0（workbench.createSubject）；
 *   - 所有日期都是 2026 年内固定日期（不写"今天"，读模型才稳定）；
 *   - 显式 null ≠ 0：未知的日期/数值/机构一律 NULL，不用空串冒充；
 *   - 医生原话一律「示例原话，仅演示」式内容，不生成诊疗结论；影像结论只写"示例原文"占位；
 *   - 指标目录（metric_defs 10 条）由 0001 迁移负责，本文件不插也不删；
 *   - A 档案记录少、多处未知/NULL；B 档案记录多（标志物 12+ 条、影像 3 次、BEP 化疗周期、
 *     监测节点 8 个含完成态、生育力保存记录、就诊问题、私密笔记 1 条）。
 */
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

/** 首次播种前清空（force 用）。只清种子写的表，不碰 metric_defs / import_jobs / candidates / attachments。 */
const SEED_TABLES = [
  'notes', 'visit_questions', 'fertility_records', 'monitoring_nodes',
  'doctor_quotes', 'course_events', 'imaging_records', 'lab_results',
  'metric_group_titles', 'section_titles', 'subjects',
];

/* ---------- A 档案：小陈 · 刚确诊（术后 2 周） ---------- */

const PROFILE_A = {
  key: 'demo-a',
  name: '小陈',
  meta: '刚确诊 · 术后 2 周（合成示例）',
  headline: '术后 2 周，等待首次复查安排（合成示例）',
  actionPlan: '示例原话，仅演示：术后 4 周复查 AFP、β-hCG、LDH，之后按医生安排做影像，具体时间以门诊为准。',
  dashKeys: null,
  createdOn: '2026-10-31',
  sections: [
    ['diagnosis_summary', '确诊经过与手术', 1],
    ['markers', '标志物复查', 2],
    ['follow_up', '随访与监测节点', 3],
  ],
  metricGroups: [
    ['markers', '血清标志物', 1],
    ['blood', '血象', 2],
  ],
  events: [
    ['2026-10-17', 'orchiectomy', '根治性睾丸切除术（示例）', '合成演示数据：术式细节未记录（未知→NULL）。', '示例医院（演示）'],
  ],
  labs: [
    { metric: 'afp', measuredOn: null, value: null, valueText: null, unit: 'ng/mL', method: null, org: '示例医院（演示）', note: '演示数据：报告日期与数值都未记录（未知→NULL）。' },
    { metric: 'hcg', measuredOn: '2026-10-20', value: null, valueText: null, unit: 'mIU/mL', method: '电化学发光法', org: '示例医院（演示）', note: '演示数据：数值未录入（未知→NULL）。' },
    { metric: 'ldh', measuredOn: '2026-10-20', value: 260, valueText: null, unit: 'U/L', method: '速率法', org: '示例医院（演示）', note: null },
  ],
  imaging: [],
  quotes: [
    ['2026-10-17', 'surveillance_plan', '示例原话，仅演示：术后按方案复查标志物，具体时间以主治医生安排为准。', '门诊（演示）'],
  ],
  nodes: [
    { dueOn: '2026-11-14', nodeType: 'markers', planQuote: 0, doneFlag: 0, doneOn: null, linkedNote: null },
    { dueOn: null, nodeType: 'ct', planQuote: 0, doneFlag: 0, doneOn: null, linkedNote: '演示数据：影像日期未定（未知→NULL）。' },
  ],
  fertility: [
    ['2026-10-25', 'consult', '示例生殖医学中心（演示）', '演示数据：仅登记事实，是否保存由本人决定。'],
  ],
  questions: [
    ['下次复查要带哪些报告？（演示问题）', 1, 0, null, '2026-10-31'],
    ['目前可以正常运动吗？（演示问题）', 2, 0, null, '2026-10-31'],
  ],
  notes: [
    ['2026-10-24', '术后伤口还有些紧绷，先记下来。（合成示例）', 0],
  ],
};

/* ---------- B 档案：小林 · 随访两年（第二年为演示口径） ---------- */

const PROFILE_B = {
  key: 'demo-b',
  name: '小林',
  meta: '随访两年（合成示例）',
  headline: '监测期第 2 年：按节点复查标志物与影像（合成示例）',
  actionPlan: '示例原话，仅演示：第 2 年每 4 个月复查标志物与影像，第 3 年起改每 6 个月，以主治医生最新安排为准。',
  dashKeys: '["markers","imaging","nodes","fertility"]',
  createdOn: '2026-01-10',
  sections: [
    ['diagnosis_summary', '确诊与治疗经过', 1],
    ['markers', '标志物趋势', 2],
    ['imaging', '影像复查', 3],
    ['follow_up', '监测节点', 4],
    ['fertility', '生育力保存', 5],
  ],
  metricGroups: [
    ['markers', '血清标志物', 1],
    ['blood', '血象与骨髓抑制监测', 2],
    ['renal', '肾功能', 3],
    ['metabolic', '电解质与代谢', 4],
  ],
  events: [
    ['2026-01-06', 'orchiectomy', '根治性睾丸切除术（示例）', '合成演示数据：术式细节以病历为准。', '示例医院（演示）'],
    ['2026-02-02', 'chemo_cycle', 'BEP 第 1 周期（示例）', '演示数据：方案与剂量以病历为准，不虚构天数打勾。', '示例医院（演示）'],
    ['2026-02-23', 'chemo_cycle', 'BEP 第 2 周期（示例）', null, '示例医院（演示）'],
    ['2026-03-16', 'chemo_cycle', 'BEP 第 3 周期（示例）', null, '示例医院（演示）'],
    ['2026-10-12', 'visit', '随访门诊（示例）', null, '示例医院（演示）'],
  ],
  labs: [
    /* 标志物 4 个时点 × 3 项 = 12 条（可比组 = method + org，不合并） */
    { metric: 'afp', measuredOn: '2026-01-05', value: 42.5, valueText: null, unit: 'ng/mL', method: '化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'hcg', measuredOn: '2026-01-05', value: 120, valueText: null, unit: 'mIU/mL', method: '电化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'ldh', measuredOn: '2026-01-05', value: 320, valueText: null, unit: 'U/L', method: '速率法', org: '示例医院（演示）', note: null },
    { metric: 'afp', measuredOn: '2026-02-01', value: 18.3, valueText: null, unit: 'ng/mL', method: '化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'hcg', measuredOn: '2026-02-01', value: 15.2, valueText: null, unit: 'mIU/mL', method: '电化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'ldh', measuredOn: '2026-02-01', value: 265, valueText: null, unit: 'U/L', method: '速率法', org: '示例医院（演示）', note: null },
    { metric: 'afp', measuredOn: '2026-04-06', value: 3.1, valueText: null, unit: 'ng/mL', method: '化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'hcg', measuredOn: '2026-04-06', value: 0.8, valueText: null, unit: 'mIU/mL', method: '电化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'ldh', measuredOn: '2026-04-06', value: 198, valueText: null, unit: 'U/L', method: '速率法', org: '示例医院（演示）', note: null },
    { metric: 'afp', measuredOn: '2026-07-06', value: 2.6, valueText: null, unit: 'ng/mL', method: '化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'hcg', measuredOn: '2026-07-06', value: 0.6, valueText: null, unit: 'mIU/mL', method: '电化学发光法', org: '示例医院（演示）', note: null },
    { metric: 'ldh', measuredOn: '2026-07-06', value: 187, valueText: null, unit: 'U/L', method: '速率法', org: '示例医院（演示）', note: null },
    /* 血象 / 肾功能 / 代谢：化疗期间各 2 个时点 */
    { metric: 'wbc', measuredOn: '2026-02-02', value: 3.2, valueText: null, unit: '×10⁹/L', method: null, org: '示例医院（演示）', note: '演示数据：化疗期间血象记录。' },
    { metric: 'anc', measuredOn: '2026-02-02', value: 1.4, valueText: null, unit: '×10⁹/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'hemoglobin', measuredOn: '2026-02-02', value: 118, valueText: null, unit: 'g/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'platelets', measuredOn: '2026-02-02', value: 160, valueText: null, unit: '×10⁹/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'wbc', measuredOn: '2026-03-16', value: 4.1, valueText: null, unit: '×10⁹/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'anc', measuredOn: '2026-03-16', value: 2.0, valueText: null, unit: '×10⁹/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'hemoglobin', measuredOn: '2026-03-16', value: 126, valueText: null, unit: 'g/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'platelets', measuredOn: '2026-03-16', value: 185, valueText: null, unit: '×10⁹/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'creatinine', measuredOn: '2026-02-02', value: 68, valueText: null, unit: 'μmol/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'creatinine', measuredOn: '2026-03-16', value: 71, valueText: null, unit: 'μmol/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'magnesium', measuredOn: '2026-02-02', value: 0.78, valueText: null, unit: 'mmol/L', method: null, org: '示例医院（演示）', note: '演示数据：BEP 方案常规查电解质（此处仅登记数值）。' },
    { metric: 'magnesium', measuredOn: '2026-03-16', value: 0.82, valueText: null, unit: 'mmol/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'potassium', measuredOn: '2026-02-02', value: 3.9, valueText: null, unit: 'mmol/L', method: null, org: '示例医院（演示）', note: null },
    { metric: 'potassium', measuredOn: '2026-03-16', value: 4.1, valueText: null, unit: 'mmol/L', method: null, org: '示例医院（演示）', note: null },
  ],
  imaging: [
    ['2026-01-08', 'CT 胸腹盆', '胸部 + 腹部 + 盆腔（示例）', '示例原文，仅演示：结论以纸质报告为准，本台不判读。', '示例医院（演示）'],
    ['2026-04-10', 'CT 腹盆', null, '示例原文，仅演示：结论以纸质报告为准。', '示例医院（演示）'],
    ['2026-07-08', '超声', '阴囊与腹膜后（示例）', '示例原文，仅演示：结论以报告为准。', '示例医院（演示）'],
  ],
  quotes: [
    ['2026-01-08', 'staging', '示例原话，仅演示：分期以病理报告为准，我不会替医生下结论，界面注明「解读归医生」。', '门诊（演示）'],
    ['2026-01-15', 'treatment_plan', '示例原话，仅演示：建议按方案完成化疗，具体周期数以主治医生安排为准。', '门诊（演示）'],
    ['2026-04-12', 'surveillance_plan', '示例原话，仅演示：第 2 年每 4 个月复查标志物与影像，第 3 年起改每 6 个月。', '门诊（演示）'],
  ],
  nodes: [
    { dueOn: '2026-02-01', nodeType: 'markers', planQuote: 2, doneFlag: 1, doneOn: '2026-02-01', linkedNote: '示例：标志物结果已登记。' },
    { dueOn: '2026-04-06', nodeType: 'markers', planQuote: 2, doneFlag: 1, doneOn: '2026-04-06', linkedNote: null },
    { dueOn: '2026-04-09', nodeType: 'ct', planQuote: 2, doneFlag: 1, doneOn: '2026-04-10', linkedNote: '示例：影像结果已登记。' },
    { dueOn: '2026-07-06', nodeType: 'markers', planQuote: 2, doneFlag: 1, doneOn: '2026-07-06', linkedNote: null },
    { dueOn: '2026-07-08', nodeType: 'ultrasound', planQuote: 2, doneFlag: 1, doneOn: '2026-07-08', linkedNote: null },
    { dueOn: '2026-10-12', nodeType: 'clinic', planQuote: 2, doneFlag: 1, doneOn: '2026-10-12', linkedNote: null },
    { dueOn: '2026-10-12', nodeType: 'markers', planQuote: 2, doneFlag: 1, doneOn: '2026-10-12', linkedNote: null },
    { dueOn: null, nodeType: 'ct', planQuote: 2, doneFlag: 0, doneOn: null, linkedNote: '演示数据：下次影像日期未定（未知→NULL）。' },
  ],
  fertility: [
    ['2026-01-12', 'consult', '示例生殖医学中心（演示）', '演示数据：生育力保存咨询登记。'],
    ['2026-01-20', 'freeze_done', '示例人类精子库（演示）', '演示数据：冻存完成登记，仅记录事实。'],
  ],
  questions: [
    ['下次影像是 CT 还是超声？（演示问题）', 1, 1, '已问过（演示）：医生答复见门诊记录。', '2026-09-30'],
    ['治疗结束多久后可以考虑生育计划？（演示问题）', 2, 0, null, '2026-10-01'],
    ['运动强度有没有需要注意的？（演示问题）', 3, 0, null, '2026-10-01'],
    ['复查报告可以自己在手机上看吗？（演示问题）', 4, 0, null, '2026-10-02'],
  ],
  notes: [
    ['2026-06-18', '今天翻看治疗记录，情绪有点波动，写下来。（合成示例）', 1],
  ],
};

const PROFILES = [PROFILE_A, PROFILE_B];

export function seedDemoData(db, { force = false } = {}) {
  const existing = db.prepare('SELECT COUNT(*) c FROM subjects').get().c;
  if (existing > 0 && !force) return { skipped: true, profiles: existing };
  db.exec('BEGIN');
  try {
    if (force) {
      for (const t of SEED_TABLES) db.prepare(`DELETE FROM ${t}`).run();
    }
    const subIns = db.prepare(`INSERT INTO subjects
      (profile_key, name, meta, headline, action_plan, dash_keys, created_on, is_demo)
      VALUES (?,?,?,?,?,?,?,?)`);
    const secIns = db.prepare('INSERT INTO section_titles (profile_key, key, title, ord) VALUES (?,?,?,?)');
    const grpIns = db.prepare('INSERT INTO metric_group_titles (profile_key, category, title, ord) VALUES (?,?,?,?)');
    const evtIns = db.prepare(`INSERT INTO course_events
      (profile_key, event_on, event_type, title, detail, org, is_private, ver)
      VALUES (?,?,?,?,?,?,0,1)`);
    const labIns = db.prepare(`INSERT INTO lab_results
      (profile_key, metric_key, measured_on, value, value_text, unit, method, org, is_private, note, ver)
      VALUES (?,?,?,?,?,?,?,?,0,?,1)`);
    const imgIns = db.prepare(`INSERT INTO imaging_records
      (profile_key, study_on, study_type, region, impression, org, is_private, ver)
      VALUES (?,?,?,?,?,?,0,1)`);
    const quoteIns = db.prepare(`INSERT INTO doctor_quotes
      (profile_key, quote_on, category, quote_text, source, is_private, ver)
      VALUES (?,?,?,?,?,0,1)`);
    const nodeIns = db.prepare(`INSERT INTO monitoring_nodes
      (profile_key, due_on, node_type, plan_quote_id, done_flag, done_on, linked_note, is_private, ver)
      VALUES (?,?,?,?,?,?,?,0,1)`);
    const fertIns = db.prepare(`INSERT INTO fertility_records
      (profile_key, record_on, step, institution, note, is_private, ver)
      VALUES (?,?,?,?,?,0,1)`);
    const qIns = db.prepare(`INSERT INTO visit_questions
      (profile_key, question_text, ord, answered_flag, answered_note, created_on, is_private, ver)
      VALUES (?,?,?,?,?,?,0,1)`);
    const noteIns = db.prepare(`INSERT INTO notes
      (profile_key, note_on, text, is_private, ver)
      VALUES (?,?,?,?,1)`);

    for (const p of PROFILES) {
      subIns.run(p.key, p.name, p.meta, p.headline, p.actionPlan, p.dashKeys, p.createdOn, 1);
      for (const [key, title, ord] of p.sections) secIns.run(p.key, key, title, ord);
      for (const [category, title, ord] of p.metricGroups) grpIns.run(p.key, category, title, ord);
      for (const [eventOn, eventType, title, detail, org] of p.events) {
        evtIns.run(p.key, eventOn, eventType, title, detail, org);
      }
      for (const l of p.labs) {
        labIns.run(p.key, l.metric, l.measuredOn, l.value, l.valueText, l.unit, l.method, l.org, l.note);
      }
      for (const [studyOn, studyType, region, impression, org] of p.imaging) {
        imgIns.run(p.key, studyOn, studyType, region, impression, org);
      }
      const quoteIds = [];
      for (const [quoteOn, category, quoteText, source] of p.quotes) {
        const info = quoteIns.run(p.key, quoteOn, category, quoteText, source);
        quoteIds.push(Number(info.lastInsertRowid));
      }
      for (const n of p.nodes) {
        const planQuoteId = typeof n.planQuote === 'number' ? (quoteIds[n.planQuote] ?? null) : null;
        nodeIns.run(p.key, n.dueOn, n.nodeType, planQuoteId, n.doneFlag, n.doneOn, n.linkedNote);
      }
      for (const [recordOn, step, institution, note] of p.fertility) {
        fertIns.run(p.key, recordOn, step, institution, note);
      }
      for (const [questionText, ord, answeredFlag, answeredNote, createdOn] of p.questions) {
        qIns.run(p.key, questionText, ord, answeredFlag, answeredNote, createdOn);
      }
      for (const [noteOn, text, isPrivate] of p.notes) {
        noteIns.run(p.key, noteOn, text, isPrivate);
      }
    }
    const n = db.prepare('SELECT COUNT(*) c FROM subjects').get().c;
    db.exec('COMMIT');
    return { skipped: false, profiles: n };
  } catch (error) {
    db.exec('ROLLBACK');
    throw new Error(`演示数据播种失败：${error.message}`);
  }
}

export function hasDemoData(db) {
  return db.prepare('SELECT COUNT(*) c FROM subjects').get().c > 0;
}

/* HERE 保留给 M2：全量重写种子时可能要读配套数据文件 */
export const DEMO_DIR = HERE;
