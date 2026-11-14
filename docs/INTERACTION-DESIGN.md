# INTERACTION-DESIGN · testicular-workbench

> 28 号 IP1 的本台落地（M0 建立路径表；M2 逐条实测并回填实测值）。入口名 = 界面渲染文案 = 导航 key 逐字一致（IP3）。

## 一级导航（9）

dashboard（看板）/ labs（标志物与化验）/ followup（监测节点）/ course（治疗经过）/ fertility（生育力保存）/ notes（感受笔记）/ visit（就诊准备）/ trials（临床研究）/ records（资料库）

## 交互路径表（IP-N；每条带入口→步骤→产物→回首页）

| IP | 入口（逐字） | 步骤 | 可观察产物 | 回首页 |
| --- | --- | --- | --- | --- |
| IP1 | 看板 → 「标志物与化验」 | 侧栏点击 labs | 页面渲染 + URL #page=labs | 侧栏「看板」 |
| IP2 | labs → 「＋ 录入化验」 | 表单 ≤6 字段 → 三态保存 | lab_results 新行 + 最近报告表 +1 | 顶栏返回 |
| IP3 | followup → 节点「标记完成」 | 确认弹层 | done_flag=1 + 完成日期 | 侧栏「看板」 |
| IP4 | followup → 「＋ 登记影像」 | 表单 → 保存并关闭 | imaging_records 新行 | 侧栏「看板」 |
| IP5 | fertility → 「＋ 记录生育力事项」 | 四态选择 → 保存 | fertility_records 新行 + 提示生成就诊问题 | 侧栏「看板」 |
| IP6 | course → 折叠卡「BEP 第 N 周期」→「＋ 记录本周期血象」 | 表单 → 保存 | lab_results 新行挂本周期 | 侧栏「看板」 |
| IP7 | course → 「＋ 医生原话」 | 分类+原话文本 → 保存 | doctor_quotes 新行 | 侧栏「看板」 |
| IP8 | notes → 「＋ 记一条」→ 私密开关 | 保存 → 导出预览 | notes 新行；导出预览无该条；页内计数 | 侧栏「看板」 |
| IP9 | visit → 「＋ 添加问题」/「导出就诊包」 | 清单增删 → 导出 | visit_questions 行；导出 JSON 下载 | 侧栏「看板」 |
| IP10 | trials → 关键词检索 → 候选卡详情浮窗 → 收藏 | 三子页（检索/匹配/收藏跟踪） | saved_trial 本机记录 | 侧栏「看板」 |
| IP11 | records → 「＋ 登记原件」→ 导入任务 | 文件名+类型 | attachments + import_jobs | 侧栏「看板」 |

## 通用交互约定

- 每页「和 AI 讨论」携带本页关键信息（无判定词）进输入框，不代发（IP11 家族断言）。
- 显式编辑入口每页 ≤1（IP6）；数字输入 inputmode=numeric（IP7）；更正=新增版本（IP8），全站无「不可恢复」文案。
- 整页视图（A1–A10）：详情浮层/疾病概要走整页面板，Esc 一层一退，history 唯一真源。
- 弹层（设置/影像详情）：遮罩/标题栏 ✕/Esc 三关闭口，焦点回归，不改 hash。
