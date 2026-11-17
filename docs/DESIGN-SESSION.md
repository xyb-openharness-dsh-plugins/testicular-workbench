# 互动设计记录

状态：M2 原型候审；已继承 M0/M1 与 G1 自动签认，G1 待晨审追认不等于患者验证。
当前阶段/范围：M2 standalone HTML 已制作并在本机 Chromium 预览；等用户确认模块和交互，再进入独立审查/G2及对应生产实施。
设计提示词：`docs/DESIGN-PROMPT.md`；实际路径 `/data/home/dev/testicular-workbench/docs/DESIGN-PROMPT.md`。设计者章程：`docs/DESIGNER-BRIEF.md`。原生 Agent 设计合同：`prompts/DSH-AGENT-PANE-INTEGRATION.md`。
权威内容：`docs/BRIEF.md`、`docs/SPEC.md`、`docs/SCENARIOS.md`、`docs/PATIENT-FLOW.md`。

| 决策 ID | 待解决的问题 | 用户已确认内容/来源 | Agent 建议及原因 | 待确认项 | 确认人/日期 | 影响功能 ID |
| --- | --- | --- | --- | --- | --- | --- |
| DESIGN-01 | 是否确认 HTML v0.2.0 及范围 | 用户目标、品牌、两档合成资料与完成路线；未收到原型确认 | 分模块确认，避免把首页认可扩大为整站许可 | 核对原型 hash、确认模块/反馈 | 待用户 | P0–P9、P1疾病概要、P2一图秀 |

本轮已写入：`prototypes/v0.2/`；`docs/PROTOTYPE-REVIEW.md`；`docs/ONE-CHART-SPEC.md`。
下一轮关键问题：确认哪些原型模块/行为可进入业务实现，或指出具体修改点。
确认时展示的原型版本/hash、实际预览：v0.2.0；HTML SHA-256 `c729e35cb29eb1da975c69da97f45d301bb5a0f618dce6ffaabfddae8a598580`；Chromium `file://`，约 913×656。操作路线：先切换左上 A/B 档案，再逐项打开左侧页面；标志物页向下看事件泳道/指标卡；顶栏 `? 疾病概要` 可独立返回或关闭。

HTML原型关口：已实际预览；用户确认未取得，生产业务开发待开始。数据演进关口：schema 0001/0002 与 freeze 已存在，原型确认后仍按变化场景复核生产模型。
