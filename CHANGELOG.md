# 变更记录

## 0.2.6 — 2026-11-20

- MinerU Token 输入与保存不再被未来文档上传提示锁住；隐私提示继续可见，实际上传功能仍未接入。
- 客户端声明 `uiWorkspace` 和 `sessions` 宿主能力，使设置中的“选择资料目录”可调用原生目录选择器。
- 资料目录选择写回固定启动目录的指针；连续切换后重新打开工作台仍使用最后选择的目录。

## 0.2.5 — 2026-11-20

- 修正文档解析设置中的隐私提示：说明今后使用 MinerU 解析时文档会经 API 上传到 MinerU 服务，建议先脱敏；同时保留当前仅支持 Token 配置、尚未接入解析上传的准确状态。
- 修复生产页面固定高度下内容区无法纵向滚动的问题；标志物与化验、临床研究等页面内容超出窗口时可滚到末尾，侧栏内容超出时也可滚动。

## 0.2.4 — 2026-11-20

- 设置中的 MinerU Token 可在本机保存、读取配置状态与清除；服务端仅返回掩码，密钥文件使用受限权限。解析和上传流程尚未接入。
- 临床研究页与设置页改为按需读取 ClinicalTrials.gov 官方登记接口，显示来源、时间、检索范围、原始记录链接与失败原因；含失败通道的旧快照只作历史说明。
- 放大顶栏设置齿轮，移除顶栏资料目录按钮；资料目录仍可在设置的工作区 Tab 选择。

## 0.2.3 — 2026-11-20

- Desktop 顶栏新增设置齿轮和工作区、文档解析、临床数据库三 Tab 弹层。
- 工作区显示本机服务返回的目录，目录选择复用原有校验与保存接口；取消、失败保留原目录。
- 文档解析如实标明 MinerU 尚未接入；临床数据库显示随包快照与通道终态，不宣称在线查询或个体匹配。
- 文档解析增加明确的不会上传确认，工作区列出容量统计与备份边界，临床页补充断网与医学解读说明。


## 0.2.1 — 2026-11-19

- 修复 Desktop 实机走查发现的界面缺口（证据：装机后在 DSH Desktop 内用 CDP 逐项点击）：v0.2.0 全页只有顶栏「? 疾病概要」一个 `data-primer-open`；按 36 号与家族口径，看板首页必须有文字入口。首页新增「先了解这个病」卡片，按钮为 `data-primer-open data-primer-entry="home"`，与顶栏 `data-primer-entry="top"` 各自独立，关闭后焦点按 entry key 回到各自触发者。
- 保持「? 专供疾病概要」不变；AI 对话仍由宿主原生面板承载，客户端 `newSession(defaultWorkspace?.()?.workspaceId)` 逻辑未改（不留空会话、失败显示原因、草稿只填不发）。
- 门禁：`npm run check` exit 0 · `npm test` 12/12 · `npm run audit` 40/40 · `probe-disease-primer` 10/10（显式 --url 本仓原型）。
- 用户可见结果：Desktop 内首页可直接点开疾病概要，不必先找顶栏的 ?；两种打开方式看到同一份四段内容。

## 0.2.0 — 2026-11-18

- 按用户确认的 v0.2.0 HTML 原型接入 DSH 生产工作台与 SQLite 读写；新增事务性修订链接、宿主档案切换同步、疾病概要入口和真实 JSON 导出。
- 私密笔记在服务端导出时过滤；本机浏览器/API 冒烟验证新增化验回读、私密记录排除。
- 重新生成并提交 2026-11-18 临床研究快照：9 条宽词返回记录，相关性未逐条核实，多个通道失败或未配置。
- 版本品牌为占位「小勇宝 TestiPal」，待用户追认；DSH Desktop 实机安装/重启/点击未验证。


只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.1.1 — 2026-11-14

- 移植家族服务层七件（源：pericarditis-workbench，语义按 schema 冻结版与睾丸癌口径重写）：
  `dsh/store.js`（openStore/closeStore/migrate，schema/*.sql 顺序执行 + schema_migrations 账本记 sha256）、
  `dsh/demo.js`（两套合成演示档案 A「小陈 · 刚确诊（术后 2 周）」/ B「小林 · 随访第二年」，is_demo=1，
  日期全部 2026 年内固定，医生原话为「示例原话，仅演示」占位）、`dsh/readmodels.js`（readBootstrap
  聚合读模型，ORDER BY rowid，显式 null；export/ai 两出口在读模型层过滤 is_private=1）、
  `dsh/server.js`（/api/testicular/api/{bootstrap,health,root,subjects,records,export}，root 带 checkDataDir）、
  `dsh/workbench.js`（Workbench 类：幂等开库+迁移+播种、switchRoot 先开后换失败回滚、records 只增 ver=1 新行）、
  `dsh/index.js`（apply 接线 hosted API_BASE '/api/testicular' + UI '/testicular'，保留 root 未配置时 health 503 降级）。
  为什么：0.1.0 只有注册骨架与健康接口，数据层零实现；家族模板已把这套链路踩稳，移植后本仓第一次具备
  「开库 → 迁移 → 播种 → 读写 → 导出」的完整数据面。
- 建立前端源 `src/client.js`（原 lib/client.js 骨架内容搬入并保持全部现有行为），业务卡片下新增最小档案 UI：
  档案列表（GET bootstrap）、当前档案名与记录计数、「＋ 新建档案」（姓名 ≤20 字 → POST subjects → 刷新并切换）、
  逐档案「切换」（换 currentProfileKey 重拉读模型）、demo 档案显示「合成示例」标记、空态给建档 CTA。
  用户可见结果：装进 Desktop 后不再只有一个静态卡片，可以直接建档并看到当前档案。
- 构建与检查链对齐家族形态：新增 `build:client` / `build:version` 接线（lib/client.js、lib/version.js 全部由
  src/ 与 VERSION 生成，不再手改）；check 链补 build-version --check / build-client --check / migrate-public
  --check / check-public-tokens / check-ui-parity / node --test（public/ 与 prototypes/ 未出现的闸门输出
  SKIP 原因，不假装通过）；package.json files 增加 schema/src/public（schema 必须随包发出，否则装机后
  readdirSync 读不到迁移 SQL，服务空转）。
- 新增 lib/identity.js（PLUGIN_ID/API_PREFIX/HOME_DIR/DB_FILE 常量）与 lib/layout.js（面板参数唯一来源，
  自家族模板）；版本徽标改读 health.version。

## 0.1.0 — 2026-11-14

- 由社区脚手架 dsh-wb-cli@1.10.0-rc.53 (daefddf) 初始化，仅有注册骨架与健康接口，无业务功能。
