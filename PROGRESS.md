# PROGRESS — testicular-workbench（小勇宝 TestiPal · 睾丸癌）

> 最新进展看本文件**尾部**更新，头部「当前里程碑」可能过期。

- 当前里程碑：M2 已由用户确认并经独立审查；当前从 M4 快照与生产构建继续（目标 0.2.0）
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
- 下一步：用户审核并确认原型版本/hash及实现范围；独立设计审查仍待执行。并行需要恢复可信M4 SQLite/状态原件，不能改哈希凑绿。
- 阻塞：M2 用户确认与独立审查；M4 SQLite 缺件；M6 Desktop 未安装。此记录不代表 M2–M9 已完成。

## 2026-11-17 M9 预检（非完成签认）

- `npm test`：12/12 通过。
- `npm run audit` 与 `dsh-wb-cli audit .`：39/39 通过；只表示仓库结构审计。
- `npm run pack:check`：dry-run 通过，但包仍为 0.1.1（33 files/3.0 MB），不是 0.2.0 候选交付。
- `npm run check`：退出 1；已将 `check-probe-coverage` 扩展为识别 `navItems` 并补全本病种全路由探针；当前唯一已观察阻断为试验快照 SQLite 缺失。
- 单独 `check-trial-snapshot`：退出 1；M4 SQLite 缺失。单独 `check-ui-parity`：退出 1；生产 `public/` 尚未生成（原型未确认，不生成正式构建）。
- M2 浏览器探针最终 20/20；首次复跑发现隐式 favicon 404 后加入内嵌 favicon 并重跑通过。原型 HTML hash 更新见 `docs/PROTOTYPE-REVIEW.md`；此前发送的 hash 审核请求需以本次 HTML hash 为准。`check-install` 未找到 DSH Desktop。P1–P9/E0 primer probe 10/10，self-test 注入三缺陷后按预期拦截；`check-primer-links --http` 12/12。
- 五项/全部交付门禁未全绿，M9 未完成。

## 2026-11-17 复核更新（M3/M5 与门禁）

- M3 收口复核：`node scripts/check-schema-words.mjs .` 通过，0001/0002 与 freeze hash 一致；本轮未更改迁移。
- M5 面板契约复扫：`node scripts/check-agent-pane-contract.mjs .` 与 `--self-test` 通过；`newSession`、`subscribe` 均在合同链路，真实宿主 V3 仍未验证。
- M9 更新：本轮 `npm test` 12/12、`npm run audit` 39/39、`npm run pack:check` dry-run 通过（包仍为 0.1.1）；`npm run check` 退出 1，失败于缺失 M4 SQLite 快照。`check-ui-parity` 仍因生产 `public/` 未生成而失败；M2 用户确认前不生成生产构建。
- 当前阻塞：M2 的 G2 原型确认/独立审查、M4 原始 SQLite 快照、M6 DSH Desktop。最终版本 0.2.0 尚未切换或打包；五项门禁未全绿，M9 未完成。

## 2026-11-18 续跑：M2 G2 与 M4 快照

- M2：用户确认原型 HTML SHA-256 `1b7739308f93af0f1a846a4bc5a24e77f5649254ebc761d9620a249736db05f3` 及 `docs/PROTOTYPE-REVIEW.md` 所列范围进入生产；原型级独立审查已记录到 `docs/MILESTONE-EVIDENCE.md`。
- M4：用户授权用既有脚本重跑；2026-11-18 新快照为 9 条宽词检索记录（相关性未逐条审核）、24 行来源状态。新 SQLite / JSONL / manifest 已通过 `check-trial-snapshot` 与 `check-trial-chain`，用户授权和新 hash 口径均见 `docs/CLINICAL-DATA.md`。
- 下一步：生产构建及 parity，M6 产包/测试 profile 检查，M9 五项门禁与用例证据。DSH Desktop 实机状态按未验证记录。

## 2026-11-18 M2 G2 收口

- 用户 2026-11-18 确认原型 HTML SHA-256 `1b7739308f93af0f1a846a4bc5a24e77f5649254ebc761d9620a249736db05f3` 及 PROTOTYPE-REVIEW 所列 P0–P9、Agent Pane 全范围进入生产实现。
- 独立设计审查逐项结果已记入 `docs/PROTOTYPE-REVIEW.md`。发现旧快照日期/数量过期和密集末值标签碰撞，已做最小修订；HTML hash 未变。修订后浏览器探针通过，dense labels 3 个（y=68/82/96）。
- 新建 `docs/MILESTONE-EVIDENCE.md`，既有 M0/M1/M3/M5 仅据 git log 与 DAY-REPORT-2 回填；M4 引用本轮新快照证据。
- 当前里程碑：M5 production UI 接入及 parity；随后 M6/M9。Desktop 实机状态仍未验证。

## 2026-11-18 M5 生产工作台与 parity

- 生产 `public/` 现在由已确认的 `prototypes/v0.2` 精确构建；修正旧迁移器错误指向其他病种的问题，并补上包 `files` 白名单中的 `public/`。
- DSH 宿主接入业务 iframe；档案切换同步给业务页；宿主顶栏按三段布局呈现品牌/版本、状态说明、操作，并加「? 疾病概要」入口；Agent 会话仍由宿主面板处理。
- 业务页接入 SQLite bootstrap、化验/影像/医生原话/生育力/问题/笔记等写入、节点完成和当前档案导出。记录修订采用事务性新行并保留 `superseded_by`；导出在服务端过滤私密行。UI parity 通过。
- 临时 profile 浏览器/API 冒烟：连接 2 个档案；化验写入后读回 3.3；私密笔记回读标记为 private，导出结果未含私密行；浏览器错误 0。
- `npm test` 12/12。独立 M5 证据、限制和 Desktop 未验证项见 `docs/MILESTONE-EVIDENCE.md`。
- 下一步：升至 0.2.0、最终 pack 和 starter 测试 profile 静态检查；Desktop 未安装，实机行为继续标未验证。

## 2026-11-18 M5 生产工作台与 parity

- 生产 `public/` 现在由已确认的 `prototypes/v0.2` 精确构建；修正旧迁移器错误指向其他病种的问题，并补上包 `files` 白名单中的 `public/`。
- DSH 宿主接入业务 iframe；档案切换同步给业务页；宿主顶栏按三段布局呈现品牌/版本、状态说明、操作，并加「? 疾病概要」入口；Agent 会话仍由宿主面板处理。
- 业务页接入 SQLite bootstrap、化验/影像/医生原话/生育力/问题/笔记等写入、节点完成和当前档案导出。记录修订采用事务性新行并保留 `superseded_by`；导出在服务端过滤私密行。UI parity 通过。
- 临时 profile 浏览器/API 冒烟：连接 2 个档案；化验写入后读回 3.3；私密笔记回读标记为 private，导出结果未含私密行；浏览器错误 0。
- `npm test` 12/12。独立 M5 证据、限制和 Desktop 未验证项见 `docs/MILESTONE-EVIDENCE.md`。
- 下一步：升至 0.2.0、最终 pack 和 starter 测试 profile 静态检查；Desktop 未安装，实机行为继续标未验证。

## 2026-11-18 M5 生产工作台与 parity

- 生产 `public/` 现在由已确认的 `prototypes/v0.2` 精确构建；修正旧迁移器错误指向其他病种的问题，并补上包 `files` 白名单中的 `public/`。
- DSH 宿主接入业务 iframe；档案切换同步给业务页；宿主顶栏按三段布局呈现品牌/版本、状态说明、操作，并加「? 疾病概要」入口；Agent 会话仍由宿主面板处理。
- 业务页接入 SQLite bootstrap、化验/影像/医生原话/生育力/问题/笔记等写入、节点完成和当前档案导出。记录修订采用事务性新行并保留 `superseded_by`；导出在服务端过滤私密行。UI parity 通过。
- 临时 profile 浏览器/API 冒烟：连接 2 个档案；化验写入后读回 3.3；私密笔记回读标记为 private，导出结果未含私密行；浏览器错误 0。
- `npm test` 12/12。独立 M5 证据、限制和 Desktop 未验证项见 `docs/MILESTONE-EVIDENCE.md`。
- 下一步：升至 0.2.0、最终 pack 和 starter 测试 profile 静态检查；Desktop 未安装，实机行为继续标未验证。

## 2026-11-18 M4 范围元数据补记

- 本轮 `npm run check` 发现试验链闸门要求研究数据产品必须有“建档→检索→匹配→呈现/收藏”，而已获用户确认的 P8 原型仅展示来源和通道状态，且宽词返回未逐条审核，不能据此虚构个体匹配功能。
- 在 `research/testicular/manifest.json` 如实补 `trimmed: true` 和实测 `snapshot.records=9/date=2026-11-18`，指明研究快照仍保留、生产检索/匹配/收藏不在确认范围。没有修改 JSONL/SQLite 或其哈希。
- 复跑 `node scripts/check-trial-snapshot.mjs .`：`records=9/9 sourceStatuses=24`、`PASS snapshot consistency: 1 snapshot(s)`；`node scripts/check-trial-chain.mjs .`：`✓ 临床试验闸门通过`。

## 2026-11-18 M6 完成 / M9 门禁实测

- 版本四处为 `0.2.0`（`VERSION`、`package.json`、`lib/version.js`、生产 HTML 注入占位）；品牌仍是待追认占位「小勇宝 TestiPal」。
- 最终 tgz：`@xyb-community/testicular-workbench@0.2.0`，40 files，3.0 MB（unpacked 3.4 MB），SHA-256 `cd539be18076fbcd2b26c4773f18b1279b0f024a26dab5d4c2b792cceb564610`。
- 取最终 tgz 解包至临时测试 profile，用 starter rc.56 `scripts/check-profile.mjs --profile /tmp/testi-profile-m9-NyEbDC --only testicular` 扫描：`通过 1/1`；bundle、dependency、public/ 均在包内且登记。该副本扫描不是 DSH Desktop 安装。
- `node scripts/check-install.mjs` exit 1：sam 未找到 `io.dsh.desktop`。实机 profile 安装、退出重开、UI 点击均未验证。
- M9 预检曾发现临床试验链不符合 P8 实际范围；按确认原型收敛成快照保留、产品检索/匹配裁剪并记录真实快照数字，不更改 SQLite/JSONL/hash。`npm run check` 随后 exit 0。
- 本轮 M9 五项门禁：`npm run check` exit 0（含测试 12/12）；独立 `npm test` 12/12；`npm run audit` 40/40；最终 `npm pack` 40 files；starter 测试 profile 1/1。测试用例与结论见 `docs/TEST-CASES.md`。

## 2026-11-18 M9 完成

- 当前 HEAD 全量复核：`npm run check` exit 0（含 12/12）；独立 `npm test` exit 0（12/12）；`npm run audit` 与 `dsh-wb-cli audit /data/home/dev/testicular-workbench` 均 exit 0（40/40）；最终 `npm pack` exit 0（40 files、3.0 MB）；从同一 SHA-256 的最终包解包构造测试 profile 后 starter `check-profile` 1/1。
- 两个最高价值真实场景在 `docs/TEST-CASES.md` 均为“应该/现实一致”：私密笔记不进入真实下载 JSON；宿主切到档案 B 后看板整页读取 B 记录。
- M2 G2 确认、M4 快照授权重跑、M5 production parity、M6 测试 profile 各项证据见 `docs/MILESTONE-EVIDENCE.md`；独立 P8 试验线范围审查见 `docs/PROTOTYPE-REVIEW.md`。
- `node scripts/check-install.mjs` exit 1，未发现 DSH Desktop `io.dsh.desktop`；真实 Desktop profile 安装、退出重开、点击走查统一记为未验证。未发布 Release、未打 tag、未改组织 BACKLOG。
- 收尾工作目录报告：`~/dev/testicular-run/DAY-REPORT.md`；仓库副本：`DAY-REPORT-3.md`。
