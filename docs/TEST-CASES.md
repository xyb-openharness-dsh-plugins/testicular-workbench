# 测试用例（TEST-CASES，≤2 个）

> 规则（AGENTS.md「证据要求与测试用例」，2026-11-18 定版）：M9 收口前必备，**不超过 2 个**，
> 只选最高价值的真实场景（优先核心流程端到端）。逐例实测填写，DAY-REPORT 引用本表结论。
> 任一例判定「偏差」必须给出返工决定：当轮返工并复测至一致，或写明阻塞与影响、标「待用户决定」——不许带偏差宣称完成。

## 用例 1：记录标志物与私密感受并导出当前档案

- **场景与前置**：在临时 DSH 风格 profile 中，以合成档案 A 打开生产 iframe；SQLite 已播种两套合成档案。
- **操作步骤**：1. 打开「标志物与化验」，录入 AFP 3.3 ng/mL；2. 打开「感受笔记」，用默认私密状态保存一条记录；3. 打开「就诊准备」并下载 JSON。
- **应该（预期）**：化验写入当前档案并可回读；笔记标记为私密；下载文件是真实 JSON，且不包含私密笔记。
- **现实（实测）**：Chromium 生产页显示「本机数据库 · 2 个档案」；SQLite 回读 `lastLab=3.3`、`lastNotePrivate=true`；点击「导出就诊包」得到 `/tmp/testi-export-pdECnr/testipal-records.json`，解析后 `privateIncluded=false`；浏览器错误 0。核验输出：`{"file":"/tmp/testi-export-pdECnr/testipal-records.json","privateIncluded":false,"notes":1,"errors":[]}`。
- **判定**：一致。
- **返工决定**：不需要。

## 用例 2：由宿主切换到长期随访档案并检查整页联动

- **场景与前置**：生产 iframe 嵌入同源测试宿主页；A/B 两套合成档案都在 bootstrap 中。
- **操作步骤**：1. 宿主通过 `testicular:profile-change` 发送 `demo-b`；2. 检查业务页选择值与看板内容。
- **应该（预期）**：业务页当前档案切为 B，档案名、记录数量、待问问题和下一个节点一起换，不混用 A 的内容。
- **现实（实测）**：Chromium 输出 `host profile sync demo-b`；B 看板文本为「档案：随访两年（合成示例）」「26 条标志物记录」「3 个待问问题」「下一条记录：CT 影像」。页面错误 0。独立原型探针也覆盖 9/9 路由、profile B 记录切换与 390px 窄屏。
- **判定**：一致。
- **返工决定**：不需要。