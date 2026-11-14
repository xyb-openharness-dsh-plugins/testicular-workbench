# SPEC · 小勇宝 TestiPal（睾丸癌患者工作台）v0.1

> 版本 0.1（2026-11-14 夜班，无人值守自动签认，待晨审追认）。上位文档：docs/01-WORKFLOW.md、23/26/28/32/35 号家族编号文档。
> 只做信息整理与就诊准备；不做诊断、不做治疗建议、不做复发判定；解读归医生。

## 问题、用户与最小闭环

- **问题**：睾丸癌随访以血清标志物（AFP/hCG/LDH）+ 影像按固定节奏进行，报告散落在手机相册/纸质单/患者门户；I 期患者还要在「主动监测 vs 辅助化疗」间做知情选择；生育力保存窗口在手术前极短。患者就诊前缺一份「事实齐、问题清」的整理。
- **用户**：15–45 岁确诊或随访中的睾丸癌（生殖细胞肿瘤为主）患者本人；次主体为授权代记家属。0 访谈（如实标注，见 USER-RESEARCH）。
- **最小闭环**：录入/导入一条化验 → 标志物趋势可见 → 生成/勾选就诊问题 → 导出就诊包（摘要+问题+最近指标，过滤私密）。失败恢复：录入失败保留草稿；导出失败重试不改数据；导入失败进 import_jobs failed 终态如实展示。
- **成功标准**：患者能不翻聊天记录回答「上次 AFP/hCG/LDH 是多少、下次复查是什么时候、我要问医生什么」三问。

## 方案与 ADR

- ADR-1 布局：业务主区 + 右侧原生 AI 面板（customFrame），沿用家族 40 号 A 家族面板（business-first 0.65）。替代方案（浮层对话/左栏对话）否决理由：遮业务主区、违背 40 号 DOM 顺序契约。
- ADR-2 分期记录方式：医生原话照录（doctor_quotes.category=staging），不落结构化 stage 列。替代方案（结构化 TNM/S 字段）否决理由：患者自填分期极易出错且构成判读列，违背家族「无判读列」红线。
- ADR-3 化疗记录粒度：「方案+周期序号」（BEP 第 2 周期），不按天打勾。理由：32 号折叠卡口径，患者真实粒度是周期级。
- ADR-4 生育力保存独立功能线：不并入心理/泛用笔记。理由：决策窗口在手术前、条目可结构化（咨询/登记/冻存/决定不保存）、家族内无同类线。
- 宿主能力表：webServer.register / connection.requestRejection / desktopWorkbenches.register / sessions / uiWorkspace.pickDirectory 均按 docs/02-DSH-CONTRACT.md 接线，已核验项见 check 链（check-host-contract ✓）。

## 功能范围

一级页 9 个 + 顶栏工具（资料目录/设置三 tab 弹层/大字/AI 对话/? 疾病概要/版本），全量清单与稳定功能 ID 见 FEATURE-INVENTORY.csv（M2 随原型产出并双向映射）；隐藏内容：指标页更多分组、影像结论全文浮层。每个 (view,sub) 至少一条交互路径覆盖（孤儿页=0，IP2）。

## 数据与 API

- schema/0001_initial.sql（15 表，冻结 sha256 见 freeze-contract.md）+ 0002_app_setting.sql。实体：档案 subjects；事实 lab_results/imaging_records/course_events/doctor_quotes/monitoring_nodes/fertility_records/visit_questions/notes；导入 import_jobs/candidates（in_use 纪律）/attachments；设置 app_setting。
- API：/api/testicular/api/{bootstrap,health,root,subjects,records,export}；契约见 API-CONTRACT.md 与 dsh/server.js。校验：subjects 名 ≤20 字；records 白名单 8 表 ver=1 新行；root POST 服务端 checkDataDir 二次校验（主目录/桌面/下载根/tmp 拒绝）。
- 时区与单位：日期一律本地 YYYY-MM-DD 字符串，未知 NULL；指标单位随 metric_defs（AFP ng/mL、β-hCG mIU/mL、LDH U/L）。
- 外部信息合同：临床试验快照（unified-trial-mcp 四通道，2026-11-14 实测 235 条，manifest 带 freshness；登记状态一律「未核实」+ 快照会过期提示）；医学阈值一律【待核】不入库（M3 红线）；获取成功≠已核实。

## 设置与配置页面

见 SETTINGS-DESIGN.md 三 tab（工作区/文档解析 MinerU/临床数据库）：工作区 tab 含资料目录真选择器与拒绝清单口径；MinerU tab 未勾选不上传、本仓未接入如实标注「勾选与保存不联网」；临床数据库 tab 与临床试验页同口径（快照条数/日期/通道终态，FAILED 写 FAILED）。

## UI 与原型一致性

原型 prototypes/v0.2（M2 产出）为唯一视觉基准；语义 token 走 assets/tokens.css；三档断点 1180/900/600；大字只放大字号；键盘与 prefers-reduced-motion 按 19/30 号。PARITY.csv 记录偏离逐条依据。

## 资源与 Agent

- DSH 原生 AI 对话入口：顶栏「AI 对话」；无会话时 service.newSession(defaultWorkspace?.()?.workspaceId) 创建（不调 ensureSession({})）；已有会话只开/收；取消目录选择不留空会话并提示重试；失败显示原因；订阅会话变化重渲染；原生面板常挂载、可拖 25–45%、隐藏不清草稿；草稿只填入不自动发送（xxx:agent-draft）。模型约定：仅可接免费 glm-3.5-flash，演示态不调用任何模型，未接入即不发送。
- 角色提示词版本随 lib/version.js 同源；会话 owner=本工作台（ownsSession 判定）。

## 明确不做

不做自动分期/S 分期计算；不做「是否降至半衰期预期」判定；不做复发预警；不做治疗推荐；不做生育力医学咨询内容；不做多患者共享。
