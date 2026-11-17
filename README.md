# 睾丸癌患者工作台（小勇宝 TestiPal）

本机优先的睾丸癌（生殖细胞肿瘤）术后标志物、监测节点、生育力保存与就诊准备记录工作台

## 疾病概要

### 定义

睾丸癌是发生于睾丸的恶性肿瘤。NCI 资料说明，多数睾丸癌属于生殖细胞肿瘤；其资料按精原细胞瘤与非精原细胞瘤分类介绍。本台不根据个人资料分类或分期。

来源：NCI · Testicular Cancer—Health Professional Version · 在线资料，访问 2026-11-16 · 未取得本项目指南原件，页码不适用。

### 医学资料规范和指南情况

NCCN 提供 Testicular Cancer 专业指南入口；本项目尚未取得 NCCN 原件，版本与页码待核。NCI PDQ 患者版是公开患者教育网页，不等同于指南。患者访谈与临床审核均尚未完成。

来源：NCCN 官方 PDF 入口（需自行注册，访问 2026-11-16）；NCI · Testicular Cancer Treatment · 页面更新 2023-05-17，访问 2026-11-16。具体状态见 [CLINICAL-DATA](docs/CLINICAL-DATA.md)。

### 目前治疗全景概要

NCI 患者教育页面列有手术、放射治疗、化学治疗与主动监测等类别，并提供临床研究信息入口。这里仅说明公开资料覆盖的类别；本台不根据病情选择、排序或比较。

> 以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。

来源：NCI · Testicular Cancer Treatment（患者教育网页）· 页面更新 2023-05-17，访问 2026-11-16。NCCN 原件未取得，页码待核。

### 发展趋势

截至 2026-11-16，本轮没有核实到可写入的 NCCN 指南版本更替、监管批件或指南结构变化事实，因此不作趋势推测。本机检索快照于 2026-11-14 保存 235 条搜索返回记录；其疾病相关性尚未逐条核实，部分在线通道失败，该数量不代表睾丸癌相关试验数或检索覆盖完整度。NCI 患者教育页面标注最近更新日期为 2023-05-17；这不是指南版本变化。

来源：本机 `research/testicular/manifest.json`（访问 2026-11-16）；NCI · Testicular Cancer Treatment（访问 2026-11-16）。

以上各段属于一般信息解释，不判断个人情况。指南版本与医学内容仍待临床审核。

这是接入骨架，尚未实现真实业务。初始化后先将 [项目设计提示词](docs/DESIGN-PROMPT.md) 交给当前Agent；它应展示实际路径并以已有用户/场景/流程素材对齐设计者、研究与取舍原则。癌种项目另有 [完整专用提示词](prompts/NEW-CANCER-WORKBENCH.md)。需求见 [BRIEF](docs/BRIEF.md)，规格见 [SPEC](docs/SPEC.md)，任务见 [TASKS](docs/TASKS.md)；先读 [AGENTS](AGENTS.md)。CLI输出交接与首问，实际对话由Agent接续。

## 开发顺序

先共创SPEC和候选数据关系，再交付HTML交互工作台；由用户确认对应版本/模块后，复核SCHEMA/API并实现生产功能。确认记录见docs/PROTOTYPE-REVIEW.md；模型不依赖前端Tab/流程。模板骨架不是业务已确认。

## 当前能力

- 一个 DSH 工作台注册、认证的健康接口、版本展示与标准/大字切换。
- 已明确选择布局：business-first。business-first 使用 customFrame；模板不创建会话或复制聊天。需要 AI 协助时按官方合同接入原生 conversation 和会话管理。
- 无业务数据库、无演示患者、无真实密钥；所有业务页按确认 spec 逐项实现。

## 开发与本地验收

需要 Node.js 22+、Git、包管理器和可用 DSH Desktop；采用 SQLite 时另核验 node:sqlite 版本条件。宿主 peers 的范围仅是模板基线，请与目标 Desktop 实际依赖核对。

```bash
npm install
npm run check
npm run pack:check
npm pack
```

`npm run check` 只保证"能装"（语法 + 装包合同），第一天就该是绿的。`npm run audit` 管"还是不是家族里的一员"：版本三处一致、`lib/layout.js` 面板参数单一来源、检查链完整、文档与密钥卫生，**只看代码与文件，不看文档自述**。新项目刚生成时 audit 必然有 fail，那是待办清单；交付/发布前必须清零，存在 fail 不得发布（`npm run release:check` 一次跑完两者）。

跑的时间点：**每次改完**跑 `check`；**G2 原型确认后、写业务代码前**先跑一次 `audit`（这时缺的多是 `lib/layout.js`、`VERSION` 这类结构，越早补越便宜）；**交付/装机前**必须跑 `release:check`；**发布或投稿前**把 `npm run audit --json` 的 `xx/xx 通过 · N 失败 · M 待人工` 抄进 `docs/RELEASE.md` 的「家族一致性」一行。`✗` 是结构缺口（补齐，或在 `docs/DEV-REQUIREMENTS-<日期>.md` 写明偏离理由并由用户确认），`!` 是需人工判断的项（逐条给「已人工确认 / 确实没有」）。

`npm install` 可能按 npm 策略解析 peer；勿为消警告重复打包宿主 runtime。客户端本身是单文件；引入 TS/组件库后需添加构建步骤并保留单文件导出。

本地安装入口以当前 Desktop/CLI 帮助为准。安装后按 [docs/06-VALIDATION-AND-RELEASE.md](docs/06-VALIDATION-AND-RELEASE.md) 与官方自测完成真实 UI 验收，并填写 [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md)。静态检查不代表已加载。

Logo 来源与使用限制见 assets/README.md。许可证、作者、仓库/发布策略由本项目维护者确认后填写；模板默认为 private/UNLICENSED。

感谢小x宝社区、DataElement 社区，以及 sam / hhx / 繁华的 ❤️ 贡献。

初始化来源记录见 `.dsh-wb-starter.json`。更新社区脚手架不会覆盖本项目；需要升级时先用相同确认配置在临时目录生成，再审阅差异。CLI 用法见 [docs/CLI-GIT.md](docs/CLI-GIT.md)。

## HTML先行与数据演进

业务开发前先交付HTML交互工作台原型、实际预览并由用户确认版本/hash和范围。数据设计先区分领域事实、流程状态和页面读模型，走查前端/流程变化、兼容与迁移；原型对象不直接作为表。见[规范](docs/14-HTML-AND-DATA-CONTRACT.md)。
