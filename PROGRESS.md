# PROGRESS — testicular-workbench（小勇宝 TestiPal · 睾丸癌）

> 最新进展看本文件**尾部**更新，头部「当前里程碑」可能过期。

- 当前里程碑：M2（v0.2.0 HTML 原型候审；G2 未签）
- 认领依据：issue https://github.com/xyb-openharness-dsh-plugins/.github/issues/80（/claim 已评论，2026-11-14 23:12）
- 模式：无人值守夜班（2026-11-14 23:00 → 2026-11-15 08:00），晨审追认
- 已完成：BACKLOG 快照落盘（night-20261114-work/BACKLOG-snapshot-20261114.md）；issue #80 提交并 /claim；私有仓 testicular-workbench 创建并 clone；starter 1.10.0-rc.53 init 完成（config：night-20261114-work/tc-config.json）
- 旧交接记录见下方各时间戳；最新状态以文件尾的 2026-11-17 M2–M9 检查点为准。
- 阻塞：无
- 闸口结论：无

## 2026-11-15 00:0x M0 完成记录

- 文档九件落盘：SPEC / DEV-REQUIREMENTS(+dated 快照) / DIFF-MATRIX / PATIENT-FLOW / SCENARIOS / USER-RESEARCH / INTERACTION-DESIGN / CLINICAL-DATA / DEV-PLAN。原创睾丸癌版，无跨仓 fork 文案。
- M3 前置完成：schema/0001_initial.sql（15 表+指标种子）+ 0002_app_setting + freeze-contract（sha256 6331c36b…）。
- M4 主体完成：fetch-testicular-trials-2026.mjs 实跑 235 条（chinadrugtrials 9 / ctv 7 / ictrp 219；chictr_online FAILED 等终态如实入库）。
- M5 服务层前置完成（子代理移植，已复核）：dsh 七件 + src→lib 链路 + 最小档案 UI；check exit 0（患者档案闸门 4/4）；test 9/9；grep 前病种残留 0；版本 0.1.1。
- audit 33/38：4 失败（primer-data/primer 入口/prototypes v0.2 = M2 交付物）已收敛至 M2 项；README 疾病概要与 dated DEV-REQUIREMENTS 已补。
- 下一步：M1（重名率实测 + G1）→ M2 原型（最大块）。

## 2026-11-16 23:2x M1 完成记录（第二夜班窗口 11-16 23:00 → 11-17 08:00）

- 三路并行收口：医学约束 10 主题（CLINICAL-DATA §二/§四题录带访问日期）；USER-RESEARCH 三层台账（0 访谈如实）；DIFF-MATRIX §三重名率实测 16.7%（1.5/9，对 breast v0.4 app.js:34 一级导航逐项对照）。
- G1 自动签认：docs/signoffs/G1-自动签认.md（7 项全过、返工 0、待晨审追认）。
- 下一步：M2 原型（本夜最大块）。

## 2026-11-17 M2–M9 接力检查点

- 当前状态：M2 原型已制作并在 Chromium `file://` 实际预览，v0.2.0 HTML 与配套 hash 记在 `docs/PROTOTYPE-REVIEW.md`；等用户确认模块范围与独立设计审查，G2 未签；新增 `probe-testicular-m2.mjs` 覆盖 9 个页面、指标/事件/视窗/移动窄屏主链；图表密集标签/完整读屏项见 `docs/ONE-CHART-SPEC.md`。
- M2 当前交付：`prototypes/v0.2/` 独立 HTML/CSS/JS、两套合成档案构建器、四段疾病概要、九个页面入口；已补一图秀时间映射、事件ID、独立泳道、重播/reduced-motion样式、固定高度指标翻面卡。模拟 Agent 不连接宿主。
- M3：schema 0001/0002 与 freeze 词汇/hash 门禁通过；迁移文件未改。
- M4：未完成。trial chain 通过；snapshot 一致性失败，缺 `research/testicular/testicular_trials_2026.sqlite`（manifest声明235条、source status 24行及旧哈希）。没有重建DB或改hash；235条相关性未逐条审核，见 `docs/CLINICAL-DATA.md`。
- M5：`check-agent-pane-contract .` 与 `--self-test` 通过；newSession、subscribe均齐全。真实 Desktop 面板行为未验证。
- M6：`node scripts/check-install.mjs` 未找到 DSH Desktop `io.dsh.desktop`；未装入其它Harness，Desktop安装/退出重开/业务走查均未验证。
- M7/M8：仅本仓草稿；不打tag、不发Release、不改组织 BACKLOG，见 `docs/release-draft/M7-M8-草稿.md`。
- M9：npm run check / npm test / 五项门禁尚未执行；须待前置里程碑与M2范围收口后执行。
- 下一步：用户审核并确认原型版本/hash及实现范围；独立设计审查仍待执行。并行需要恢复可信M4 SQLite/状态原件，不能改哈希凑绿。
- 阻塞：M2 用户确认与独立审查；M4 SQLite 缺件；M6 Desktop 未安装。此记录不代表 M2–M9 已完成。

## 2026-11-17 M9 预检（非完成签认）

- `npm test`：12/12 通过。
- `npm run audit` 与 `dsh-wb-cli audit .`：39/39 通过；只表示仓库结构审计。
- `npm run pack:check`：dry-run 通过，但包仍为 0.1.1（33 files/3.0 MB），不是 0.2.0 候选交付。
- ``npm run check`：退出 1；已将 `check-probe-coverage` 扩展为识别 `navItems` 并补全本病种全路由探针；当前唯一已观察阻断为试验快照 SQLite 缺失。
- 单独 `check-trial-snapshot`：退出 1；M4 SQLite 缺失。单独 `check-ui-parity`：退出 1；生产 `public/` 尚未生成（原型未确认，不生成正式构建）。
- M2 浏览器探针 20/20；`check-install` 未找到 DSH Desktop。P1–P9/E0 primer probe 10/10，self-test 注入三缺陷后按预期拦截；`check-primer-links --http` 12/12。
- 五项/全部交付门禁未全绿，M9 未完成。
