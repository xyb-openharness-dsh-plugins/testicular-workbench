# PROGRESS — testicular-workbench（小勇宝 TestiPal · 睾丸癌）

> 最新进展看本文件**尾部**更新，头部「当前里程碑」可能过期。

- 当前里程碑：M0（骨架与文档九件）
- 认领依据：issue https://github.com/xyb-openharness-dsh-plugins/.github/issues/80（/claim 已评论，2026-11-14 23:12）
- 模式：无人值守夜班（2026-11-14 23:00 → 2026-11-15 08:00），晨审追认
- 已完成：BACKLOG 快照落盘（night-20261114-work/BACKLOG-snapshot-20261114.md）；issue #80 提交并 /claim；私有仓 testicular-workbench 创建并 clone；starter 1.10.0-rc.53 init 完成（config：night-20261114-work/tc-config.json）
- 下一步：M0 文档九件（SPEC、DEV-REQUIREMENTS、DIFF-MATRIX、PATIENT-FLOW、SCENARIOS、USER-RESEARCH、INTERACTION-DESIGN、CLINICAL-DATA、DEV-PLAN）+ 基线 npm run check
- 阻塞：无
- 闸口结论：无

## 2026-11-15 00:0x M0 完成记录

- 文档九件落盘：SPEC / DEV-REQUIREMENTS(+dated 快照) / DIFF-MATRIX / PATIENT-FLOW / SCENARIOS / USER-RESEARCH / INTERACTION-DESIGN / CLINICAL-DATA / DEV-PLAN。原创睾丸癌版，无跨仓 fork 文案。
- M3 前置完成：schema/0001_initial.sql（15 表+指标种子）+ 0002_app_setting + freeze-contract（sha256 6331c36b…）。
- M4 主体完成：fetch-testicular-trials-2026.mjs 实跑 235 条（chinadrugtrials 9 / ctv 7 / ictrp 219；chictr_online FAILED 等终态如实入库）。
- M5 服务层前置完成（子代理移植，已复核）：dsh 七件 + src→lib 链路 + 最小档案 UI；check exit 0（患者档案闸门 4/4）；test 9/9；grep 前病种残留 0；版本 0.1.1。
- audit 33/38：4 失败（primer-data/primer 入口/prototypes v0.2 = M2 交付物）已收敛至 M2 项；README 疾病概要与 dated DEV-REQUIREMENTS 已补。
- 下一步：M1（重名率实测 + G1）→ M2 原型（最大块）。
