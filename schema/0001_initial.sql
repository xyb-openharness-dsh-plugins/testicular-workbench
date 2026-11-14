/* 睾丸癌工作台 · 初始数据模型（0001）
 *
 * 家族四条契约（与心包炎/宫颈癌/食管癌等同源）：
 *   1. 看法恒不为结论（医生原话只照录，无 is_conclusion 列，读模型保证恒为"记录"不是"判定"）；
 *   2. 显式 null ≠ 0：未知日期、缺失值一律 NULL，不用空串冒充；
 *   3. 更正只新增版本，不覆盖（事实表带 ver 与 superseded_by，历史行保留）；
 *   4. 事实四层不合并（原件 / 候选 / 记录 / 指标分表存放）。
 *
 * 肿瘤病种数据层红线（本台口径）：
 *   A. 无判读列：全库不设 diagnosis / risk_level / stage_column / prognosis / response 类列。
 *      临床分期与 S 分期（血清标志物分期）是医生结论，只进 doctor_quotes 原文照录，
 *      不落结构化判定列、不自动推导；界面展示时注明「解读归医生」。
 *   B. 标志物可比组 = method + org：lab_results 不做跨组合并，分类不进趋势
 *      （category 只作分组展示键）；AFP / hCG / LDH 半衰期属医学常识【待核】，
 *      只作展示参考标注，不做「是否降至预期」自动判定。
 *   C. 治疗线用 32 号折叠卡（一次手术 / 一轮化疗方案为一个折叠单元），
 *      化疗按「方案 + 周期序号」记录（如 BEP ×3 的第 2 周期），不虚构天数打勾。
 *   D. 监测节点是第一实体：monitoring_nodes 一行 = 一个随访节点（医生方案的照录引用），
 *      完成与否是记录（done_flag），不是「依从性评分」。
 *
 * 迁移只增不改：本文件冻结后（sha256 见 freeze-contract.md），
 * 要加结构只能新增 0002_*.sql，改这里会被 check 拦下。
 *
 * 约定：
 *   - ORDER BY rowid 为稳定读序（家族契约）；
 *   - in_use 标记候选/记录是否被采用；
 *   - 分节标题进 section_titles 表（不用 subjects 上一排 *_title 列，家族教训）；
 *   - is_private 缺省 0；读模型默认不过滤，三出口（看板摘要/导出/AI 上下文）必须显式过滤 is_private=1。
 */

/* ---------- 档案级（2） ---------- */

CREATE TABLE subjects (
  profile_key   TEXT PRIMARY KEY,
  name          TEXT,
  meta          TEXT,            -- 侧栏第二行（标签 · 当前阶段描述，患者自填）
  headline      TEXT,            -- 看板顶部一句事实摘要（患者自填或照录医生）
  action_plan   TEXT,            -- 医生随访方案【原话照录】，界面不生成；无则 NULL
  dash_keys     TEXT,            -- JSON 数组：看板快捷卡顺序
  created_on    TEXT,
  is_demo       INTEGER DEFAULT 0
);

/* 分节标题：key 与读模型 section 键一一对应；某档案没有这一节就不写行 */
CREATE TABLE section_titles (
  profile_key TEXT,
  key         TEXT,
  title       TEXT,
  ord         INTEGER,
  PRIMARY KEY (profile_key, key)
);

/* ---------- 指标（3） ---------- */

/* 指标目录：分类只作分组展示键，不进趋势。
 * 分类（本台）：markers=血清标志物 / blood=血象与骨髓抑制监测 / renal=肾功能 /
 *             metabolic=电解质与代谢 / other=其他 */
CREATE TABLE metric_defs (
  key         TEXT PRIMARY KEY,
  title       TEXT,
  category    TEXT,              -- markers / blood / renal / metabolic / other（展示分组键）
  unit        TEXT,
  color       TEXT,
  ord         INTEGER
);

/* 化验结果：可比组 = method + org；不做跨组合并 */
CREATE TABLE lab_results (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  metric_key    TEXT NOT NULL REFERENCES metric_defs(key),
  measured_on   TEXT,            -- 未知则 NULL
  value         REAL,
  value_text    TEXT,            -- 文本型结果（如「阴性」），与 value 二选一
  unit          TEXT,
  method        TEXT,            -- 化学发光免疫分析 / EIA / Roche / 雅培 …（可比组键）
  org           TEXT,            -- 机构或「自录」
  report_id     TEXT,            -- 同一报告的多次修订同 ID（最近报告表口径）
  is_private    INTEGER DEFAULT 0,
  note          TEXT,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 指标分组标题（指标页与一图秀共用同一目录，组名/顺序/项数一致） */
CREATE TABLE metric_group_titles (
  profile_key TEXT,
  category    TEXT,
  title       TEXT,
  ord         INTEGER,
  PRIMARY KEY (profile_key, category)
);

/* ---------- 通用（7） ---------- */

/* 影像检查：结论只照录原文，不判读 */
CREATE TABLE imaging_records (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  study_on      TEXT,            -- 检查日期，未知 NULL
  study_type    TEXT,            -- CT 胸腹盆 / CT 腹盆 / 胸片 / 超声 / MRI …
  region        TEXT,            -- 部位补充说明
  impression    TEXT,            -- 影像结论【原文照录】
  org           TEXT,
  report_id     TEXT,
  is_private    INTEGER DEFAULT 0,
  note          TEXT,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 病程事件：一次手术 / 一轮化疗方案 / 一次放疗 / 一次就诊为一个单元。
 * 肿瘤允许线序语义（与家族非肿瘤仓不同），但只记录事实（方案名 + 周期序号），不记疗效判定。 */
CREATE TABLE course_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  event_on      TEXT,            -- 事件日期（周期可写起始日），未知 NULL
  event_type    TEXT,            -- orchiectomy / chemo_cycle / radiotherapy / stemcell / visit / hospital / other
  title         TEXT,            -- 如「腹膜后淋巴结清扫」「BEP 第 2 周期」
  detail        TEXT,            -- 补充（剂量、机构等患者可填字段）
  org           TEXT,
  is_private    INTEGER DEFAULT 0,
  note          TEXT,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 医生原话：分期 / 治疗方案 / 随访计划 / 其他，全部照录，不生成不改写 */
CREATE TABLE doctor_quotes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  quote_on      TEXT,            -- 原话日期，未知 NULL
  category      TEXT,            -- staging / treatment_plan / surveillance_plan / other（分组键，非判定）
  quote_text    TEXT NOT NULL,   -- 【原话照录】
  source        TEXT,            -- 门诊 / 电话 / 报告 / 病程记录 …
  is_private    INTEGER DEFAULT 0,
  note          TEXT,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 监测节点：随访方案的一个节点（标志物复查 / CT / 胸片 / 超声 / 门诊） */
CREATE TABLE monitoring_nodes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  due_on        TEXT,            -- 应完成日期（按医生方案），未知 NULL
  node_type     TEXT,            -- markers / ct / chest_xray / ultrasound / clinic / other
  plan_quote_id INTEGER REFERENCES doctor_quotes(id),  -- 方案原话引用（节点出处）
  done_flag     INTEGER DEFAULT 0,   -- 完成与否是记录，不是依从性评分
  done_on       TEXT,
  linked_note   TEXT,            -- 完成记录的补充说明（结果本体进 lab_results / imaging_records）
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 生育力保存：独立功能线（本台差异点，不混入泛用心理线） */
CREATE TABLE fertility_records (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  record_on     TEXT,            -- 未知 NULL
  step          TEXT,            -- consult(咨询) / bank_visit(精子库登记) / freeze_done(冻存完成) / declined(决定不保存)
  institution   TEXT,
  note          TEXT,
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 就诊问题清单：就诊前想问医生的问题 */
CREATE TABLE visit_questions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  question_text TEXT NOT NULL,
  ord           INTEGER,
  answered_flag INTEGER DEFAULT 0,   -- 已问过是记录，不改写问题原文
  answered_note TEXT,
  created_on    TEXT,
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 感受笔记 / 症状记录（私密项高发区，三出口必须过滤） */
CREATE TABLE notes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  note_on       TEXT,
  text          TEXT NOT NULL,
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* ---------- 导入（3） ---------- */

/* 导入任务 */
CREATE TABLE import_jobs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  source_kind   TEXT,            -- report_pdf / photo / manual_paste / mineru
  file_name     TEXT,
  status        TEXT,            -- pending / parsing / done / failed（终态如实，不冒充成功）
  detail        TEXT,
  created_on    TEXT,
  finished_on   TEXT
);

/* 解析候选（in_use 纪律：未核对不参与任何呈现与匹配） */
CREATE TABLE candidates (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  job_id        INTEGER REFERENCES import_jobs(id),
  target_table  TEXT,            -- lab_results / imaging_records / course_events / doctor_quotes …
  payload       TEXT,            -- JSON：候选字段
  in_use        INTEGER DEFAULT 0,   -- 0=未核对不参与；1=已核对采用
  reviewed_on   TEXT,
  is_private    INTEGER DEFAULT 0
);

/* 原件登记：只登记文件名与出处，不解析不入库内容 */
CREATE TABLE attachments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  kind          TEXT,            -- report / prescription / imaging / other
  imported_on   TEXT,
  note          TEXT,
  is_private    INTEGER DEFAULT 0
);

/* ---------- 指标目录种子（睾丸癌随访常见组；参考范围不入库，阈值一律【待核】） ---------- */

INSERT INTO metric_defs (key, title, category, unit, color, ord) VALUES
  ('afp',        '甲胎蛋白 AFP',        'markers',   'ng/mL',  '#b95023', 1),
  ('hcg',        'β-人绒毛膜促性腺激素 β-hCG', 'markers', 'mIU/mL', '#8a4fa8', 2),
  ('ldh',        '乳酸脱氢酶 LDH',      'markers',   'U/L',    '#2b6e8f', 3),
  ('wbc',        '白细胞 WBC',          'blood',     '×10⁹/L', '#3c7a52', 10),
  ('anc',        '中性粒细胞绝对值 ANC', 'blood',     '×10⁹/L', '#3c7a52', 11),
  ('hemoglobin', '血红蛋白 Hb',         'blood',     'g/L',    '#3c7a52', 12),
  ('platelets',  '血小板 PLT',          'blood',     '×10⁹/L', '#3c7a52', 13),
  ('creatinine', '肌酐 Cr',             'renal',     'μmol/L', '#2b6e8f', 20),
  ('magnesium',  '镁 Mg',               'metabolic', 'mmol/L', '#8a6d1f', 30),
  ('potassium',  '钾 K',                'metabolic', 'mmol/L', '#8a6d1f', 31);
