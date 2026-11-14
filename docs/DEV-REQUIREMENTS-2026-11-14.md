# DEV-REQUIREMENTS-2026-11-14 · 硬约束快照（逐条可验证）

> 本文件是 docs/DEV-REQUIREMENTS.md 在 2026-11-14 的可验证快照；每条硬约束挂命令或截图证据位。改约束先改主文档再出新快照。

| # | 硬约束 | 验证方式 | 当前状态 |
| --- | --- | --- | --- |
| R1 | 无判读列（diagnosis/risk_level/stage/prognosis/response 列 0） | `node scripts/check-schema-words.mjs .` | 通过（check 链成员） |
| R2 | 禁词 0（复发判定/用药建议/治愈率/匹配指数类文案） | `node scripts/check-wording.mjs .` + M2 探针全页扫描 | 通过（check 链成员） |
| R3 | 私密三出口过滤（导出/AI 上下文/看板摘要） | `node --test test/subjects-cycle.test.mjs`（导出断言）+ M2 探针 | 通过（9/9） |
| R4 | 候选未核对不参与（candidates.in_use） | 读模型单测 + M2 探针 | 通过（读模型实现） |
| R5 | 演示唯一源 | M2 探针 demo 唯一源抽查（改一值三处同步） | M2 待实测 |
| R6 | 医学阈值【待核】不入库 | `node scripts/check-wording.mjs .` | 通过 |
| R7 | 版本四处同源 | `node scripts/check-version-literal.mjs` + build:version --check | 通过 |
| R8 | 目录拒绝清单（主目录/桌面/下载根/tmp） | `node scripts/check-data-dir.mjs .` + `node --test test/check-data-dir.test.mjs` | 通过（12 反例 3 正例） |
| R9 | 试验线 35 号四段或裁剪实证 | `node scripts/check-trial-chain.mjs .` | 通过（分支 A：快照 235 条） |
| R10 | AI 面板契约（禁 Boolean(conversation)/禁 ensureSession({})/newSession+defaultWorkspace/订阅重渲/草稿只填不发） | `node scripts/check-agent-pane-contract.mjs .` | 通过（10/10） |
| R11 | 一级重名率 ≤70%（对 breast v0.4 逐字对照实测） | M1 实测回填 docs/DIFF-MATRIX.md §三 | M1 待实测 |
| R12 | 两套合成档案 + 切换不串档 | M2 探针 Q9–Q13 | M2 待实测 |

快照生成命令：`npm run check && npm run audit && npm test`（2026-11-14 23:5x：check exit 0 / audit 33/38 / test 9/9）。
