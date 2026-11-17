# DEV-PLAN · testicular-workbench（小勇宝 TestiPal · 睾丸癌）

> 状态：M0（2026-11-14 夜班开工）。认领 issue：xyb-openharness-dsh-plugins/.github#80（/claim 已评论）。

## 一、认领理由（无人值守自动领取，晨审追认）

- BACKLOG 快照 2026-11-14 23:02：#37 睾丸癌 ⬜ 招募中；全 issue 检索「睾丸」0 命中，无冲突。
- 优先级判定：T2（W3 泌尿生殖族）。未认领池中 T0/T1 均已被领（issue 列表逐一核对）；在 T2 池中按「随访天然结构化 + 家族差异化」择优：
  - 随访天然结构化：血清标志物（AFP/hCG/LDH）按固定节奏复查、影像（CT 胸腹盆）按方案间隔、监测节点天然「节点-完成-结果」三层，适合做趋势图与节点清单。
  - 差异化：家族泌尿族三仓（前列腺/膀胱/肾）全是老年慢病程；本台是青年（15–45 岁）急病程、治愈导向、标志物驱动，人群与核心随访物完全不同；与 GTN 同属生殖细胞谱系但人群/部位/标志物组合不同；与血液肿瘤族零重叠。
  - 患者痛点集中：术后标志物半衰期焦虑、I 期「监测 vs 辅助化疗」决策、生育力保存窗口极短、长期随访中的复发担忧——全部可用「事实记录 + 医生原话 + 就诊准备」承载，不越界做判定。
- 患者视角红线自查：功能线全部按患者关心的信息维度组织（标志物趋势、节点完成、生育力保存、就诊问题清单）；无医生任务冒充患者需求；0 访谈如实标注（USER-RESEARCH）。

## 二、参考基准（M0 选定，全链沿用）

- 移植样板（客户端链路底本）：cervical-workbench（客户端链路底本，家族基线）；服务层结构以 pericarditis-workbench（最近过 V1 的同形仓）为模板逐件移植。
- 成熟对比基准：breast-cancer-workbench/prototypes/v0.4（抄首页 hero、五 Tab、分类眉题、卡片与最近报告表、折叠卡、截图墙）。
- 结构基准：aml-workbench/prototypes/v0.2/index.html 的 #mind/mind-burden（导航分组、生活影响线、事件泳道、空态）。
- 只抄结构与元素体系，不抄病种语义；治疗线用 32 号折叠卡（肿瘤病种允许方案+周期序号语义，不虚构天数打勾）；试验线按 35 号四段链路（睾丸癌为肿瘤，保留试验线不裁剪）。

## 三、里程碑计划（无人值守夜班 2026-11-14 23:00 → 11-15 08:00）

| 里程碑 | 计划 | 2026-11-17 续跑状态 |
| --- | --- | --- |
| M0 | 领取四步 + 文档九件 + 基线 check | 已完成（既有记录） |
| M1 | 调研 + DIFF-MATRIX + G1 | 已完成；G1 自动签认待晨审追认 |
| M2 | 两套合成档案 + prototypes/v0.2 + 清单/独立评审 + G2 | HTML及交互自测已交付；等用户确认和独立审查，G2未签 |
| M3 | schema 0001/0002 冻结 + freeze-contract | 已前置完成；2026-11-17 schema词汇/hash门禁通过 |
| M4 | clinical trial snapshot + research映射断言 | 未完成：SQLite缺失；JSONL宽检索题名有大量非直接疾病词，见 `docs/TRIAL-SNAPSHOT-REVIEW.md` |
| M5 | 七步移植/服务层/Agent契约 | 原有代码；2026-11-17 `newSession`+subscribe静态复扫及self-test通过；Desktop未验证 |
| M6 | pack + DSH Desktop profile安装验证 | 仅 0.1.1 pack dry-run；目标机未安装 DSH Desktop，安装未验证 |
| M7 | tag + release草稿 | 仅本仓 v0.2.0 草稿；按本任务不打tag、不发Release |
| M8 | BACKLOG状态行回填PR | 仅本仓草稿；按本任务不改组织 BACKLOG、不创建PR |
| M9 | 经验收敛与全量门禁 | 未完成：npm test 12/12、audit39/39、pack dry-run通过；路由 probe coverage 已修复并通过；npm run check 当前因 trial SQLite 缺失失败，独立 UI parity 因 production `public/` 未生成失败；Desktop 未验证 |


## 四、夜间默认值（无人值守，晨审追认）

见 docs/DEV-REQUIREMENTS.md §五。

## 五、时间盒纪律

- 07:30 后不开新里程碑；08:00 收尾写 MORNING-REVIEW.md。
- 同一处额度/鉴权/套餐错误最多重试 2 次；路径错（网络抖动、并发上限）换路径重试不计入。
- 子代理并发上限实测 2026-11-14 23:3x 一次（后台 Agent 启动失败），换「恢复运行」路径成功，属路径错不计入上限。
