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

## 2026-11-19 同步远端 + Desktop 装机实测（M6）

- 远端同步：本地 0.1.2 分叉已备份到分支 backup/local-0.1.2-m2；main 对齐 origin/main（另一路 M2–M9 推进至 0.2.0：check 0 / test 12/12 / audit 40/40；试验线按用户确认的 P8 范围裁剪为快照保留 + manifest trimmed，非本机复算）。
- 装机链路（本机 DSH Desktop，harness profiles/web）：npm pack 0.2.0（40 files，sha256 cd539be1…，与远端记录一致）→ pnpm add -w 装入 profile（兄弟包 55 个未受影响）→ 登记 dsh.profile.bundles（82 项，兄弟工作台 65）→ 重启（04:13:56 启动，晚于装机 mtime）→ verify-desktop-load：本次段无激活错误、dshHomePath 数据目录生成 sqlite、清单含本仓 → check-install exit 0。
- Desktop 实机走查（CDP + 截图）：工作台真实显示「小勇宝 TestiPal v0.2.0」，顶栏 大字 / ? 疾病概要 / 资料目录 / AI 对话 四键在位；? 点击后面板可见（4 段：定义 / 医学资料规范和指南情况 / 目前治疗全景概要 / 发展趋势，hash #disease-primer，← 与 ✕ 双入口）；AI 对话点击打开宿主原生会话面板（未报错，草稿桥逻辑按 newSession+defaultWorkspace 实现核对）。
- 发现并修复：0.2.0 全页只有顶栏一个 primer 入口，首页缺文字入口（36 号双入口要求）→ 0.2.1 首页新增「先了解这个病」卡片（data-primer-entry="home"）；重建 public、pack 0.2.1（sha256 0c38fe60…）并重装重验：双入口都在，两处均可打开同一四段面板，home 入口关闭后焦点回归正确。
- 如实记录未通过/未验证：① 顶栏入口在程序化点击下关闭后焦点落到 body（真实鼠标点击路径待人工复核）；② scripts/probe-testicular-m2.mjs（远端版）本机缺 puppeteer-core，未能执行（环境缺口，不记为通过）；③ 独立评审轮次本轮未跑；④ 业务写入闭环（录入→入库→回读）在 Desktop 内未逐条点验。
# 2026-11-20 · 设置入口补齐（v0.2.3）

- Desktop 顶栏增加右上角齿轮，打开可用键盘切换的三 Tab 设置弹层：工作区、文档解析、临床数据库。工作区读服务端目录并沿用真实目录选择/校验/切换；取消和失败不更换目录。MinerU 与在线临床查询当前未接入，页面如实标明；临床页展示随包快照来源与通道终态。
- `npm_config_cache=/private/tmp/testicular-npm-cache npm run check` 通过（含设置交互测试）；`dsh-wb-cli audit .` 40/40。默认 npm 缓存含其他所有者文件，故改用临时缓存，不修改用户缓存。
- 已打包并更新至 DSH Desktop 实际 profile：`release/xyb-community-testicular-workbench-0.2.3.tgz`，SHA-256 `7117a117e1ca73005235abe45584c5916f1a64c6b2c5453bbd00736d231a2216`；安装副本版本 0.2.3 且含新设置代码。当前 Desktop 窗口仍显示 v0.2.1，需用户按宿主界面重启 Harness 后再做新版本真实界面验收；本次未自行重启。

# 2026-11-20 · MinerU 配置与临床在线来源（v0.2.4）

- MinerU 设置新增本机 Token 保存/状态/清除；保存文件默认在 `~/.testipal/secrets/mineru.json`，权限 600/目录 700，状态不回显原文。实际解析/上传尚未接入，界面如实说明。
- 临床研究主页面与设置 Tab 均改为按需读取 ClinicalTrials.gov 固定公开病种查询；旧 9 条快照中的 FAILED 只作为历史来源状态。查询失败显示错误，不解释为零结果。固定词筛并非临床相关性审核或个人匹配。
- 顶栏设置齿轮放大到 44×44 点击区域、26px 图标；顶栏资料目录按钮移除，资料目录改在设置工作区 Tab 访问。
- 完整 `npm run check` 19/19、`npm run audit` 40/40；本机浏览器预览实际取得 20 条带官方原始链接的记录，官方 API 取回 422 条宽词总数，本次检查最近更新的 100 条。在线查询结果会随时间变化。
- 已打包并更新 DSH Desktop 实际 profile：`release/xyb-community-testicular-workbench-0.2.4.tgz`，SHA-256 `8b3b518b68b20e2f7952919b92d416193726ae4b0d29cb59d5b9318bc7aa281b`；安装副本版本 0.2.4，注册描述符烟测通过。运行中的 Desktop 尚未重启 Harness，因此新界面在真宿主中的加载仍待重启后确认。

# 2026-11-20 · AI 权限与安装完整性核验

- 本机 Desktop 活动 profile 原配置 `defaultPreset: danger-full-access`；抽查一条 2026-11-20 新会话的持久权限事件，确认为完全访问且审批 `never`。工作台 AI 入口没有专属权限参数或核验。
- 已将活动 profile 的**新会话默认**改为 `read-only`，备份 `/private/tmp/testicular-dsh-permission-backup.yml`；需要宿主重新加载，既有会话不追溯变更。开发模式须显式切换并指向 Git 源码工作区。只读限制写入，不限制任意本地读取，仍需宿主级数据白名单才能达成“仅获准资料”。
- 新增外部完整性校验 `npm run verify:installed`，先核 tar SHA-256 再逐个核对安装文件；本机 42/42 文件一致，无多余文件。模拟改动、缺失、多余文件及安装包被篡改的测试通过。该校验尚非宿主启动前强制门禁；宿主级自动阻止加载/恢复需 DSH Desktop 实现。

# 2026-11-20 · MinerU 隐私文案与页面滚动（v0.2.5）

- 文档解析设置的说明与确认框改为提示：使用 MinerU 解析时文档经 MinerU API 上传到其服务，建议先遮盖姓名、证件号、联系方式等识别信息；当前版本仍只有 Token 配置，没有文件上传解析入口。
- 生产页面内容区 `#main` 和侧栏补纵向滚动。EgoLite 以 900×550 检查标志物与化验、监测节点、治疗经过、生育力保存、感受笔记、就诊准备、临床研究、资料库；超长页均可滚到末尾。390×550 下标志物与化验也可滚到末尾。
- 完整 `npm run check` 20/20，`npm run audit` 40/40。打包 `release/xyb-community-testicular-workbench-0.2.5.tgz`，SHA-256 `108866c1e78c4ca421009312734db6bcba1766d6864d9b731923848724fe4f64`；已安装到 DSH Desktop 活动 profile，安装副本 42/42 文件与可信包一致。未重启运行中的 Harness，新版在真实 Desktop 窗口中的加载待重启后确认。

# 2026-11-20 · 设置操作修复（v0.2.6）

- 根因一：Token 输入和保存按钮被未来上传确认复选框锁住；保存 Token 与上传文档是不同操作。已移除该门禁，保留 MinerU 上传与隐私脱敏提示。
- 根因二：客户端使用 `uiWorkspace.pickDirectory()`，但 `INJECT` 未声明 `uiWorkspace`。已声明 `sessions`、`uiWorkspace`，目录按钮现在有宿主能力；交互测试断言选择器调用和 POST 写入。
- 根因三：目录指针只写在新库，启动仍从固定默认目录读取。已把最后选择写回固定启动库，连续切换后重开仍落在最后目录；失败切换不改选择。
- `npm run check` 21/21、`npm run audit` 40/40；0.2.6 包 SHA-256 `34e1c833d2e4fc41212870ae319a89ce05cc4606f6d263bf558c0c40e41b85fa`，已安装到 DSH Desktop 活动 profile，安装副本 42/42 一致，注册烟测通过。
- 真 Desktop 点击验收尚未完成：本次 native CUA 连接失败，cmux CUA 报 `Computer Use onboarding is still in progress`；未重启运行中的 Harness。需用户按宿主界面重启后实际点击输入框、保存和目录选择器确认。
