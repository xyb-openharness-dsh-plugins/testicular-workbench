# 疾病概要 · 睾丸癌

- 项目 / 品牌：小勇宝 TestiPal
- 病种：睾丸癌（Testicular Cancer）
- 最后更新：2026-11-17
- 数据文件：`prototypes/v0.2/primer-data.js`（`window.DISEASE_PRIMER`）
- README 对应段：`README.md` 的 `## 疾病概要`
- 原型入口：顶栏「? 疾病概要」；由 `assets/patterns/disease-primer.js` 以整页视图打开
- 医学审核：未完成；本段仅归纳公开患者教育网页和本机检索状态，不提供个人判断

## 1 定义

睾丸癌是发生于睾丸的恶性肿瘤。NCI 资料说明多数睾丸癌属于生殖细胞肿瘤，并按精原细胞瘤与非精原细胞瘤分类介绍。本台不据个人信息分类或分期。

来源：NCI · Testicular Cancer—Health Professional Version · 在线资料，访问 2026-11-16 · 二次综述，非本项目取得的指南原件 · 页码不适用。

## 2 医学资料规范和指南情况

| 机构 | 文件/资料 | 版本 / 日期 | 原件状态 | 用途 |
|---|---|---|---|---|
| NCCN | Testicular Cancer Guidelines 官方 PDF 入口 | 访问 2026-11-16；版本待核 | **未取得原件**；需自行注册，页码待核 | 待取得原件后核对；不引述具体条文 |
| NCI | Testicular Cancer Treatment | 页面标注更新 2023-05-17；访问 2026-11-16 | 公开患者教育网页；不是指南原件 | 一般信息来源 |

NCCN 原链接为 PDF 地址，但本轮未能取得文件内容；本台将其记作受限官方入口，不声称读过原件。患者访谈与临床审核均未完成。

来源：[NCCN Testicular Cancer 官方入口（需自行注册）](https://www.nccn.org/professionals/physician_gls/pdf/testicular.pdf)；[NCI Testicular Cancer Treatment](https://www.cancer.gov/types/testicular/treatment)。访问日期 2026-11-16。

## 3 目前治疗全景概要

NCI 患者教育页面列有手术、放射治疗、化学治疗与主动监测等类别，并提供临床研究信息入口。这里只说明公开网页涉及的类别，不按个人病情映射，不排序或比较；NCCN 原件未取得，相关指南条文待核。

> 以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。

来源：[NCI Testicular Cancer Treatment](https://www.cancer.gov/types/testicular/treatment) · 患者教育网页，更新 2023-05-17；访问 2026-11-16。NCCN 原件未取得，页码待核。

## 4 发展趋势

截至 2026-11-16，本轮没有核实到可写入的 NCCN 指南版本更替、监管批件或指南结构变化事实，因此不作趋势推测。本机检索快照于 2026-11-14 保存 235 条搜索返回记录；疾病相关性尚未逐条核实，且部分在线通道失败，不能据此称为睾丸癌相关试验数量或完整覆盖。NCI 患者教育网页标注最近更新日期为 2023-05-17；这不是指南版本变化。

来源：本机 `research/testicular/manifest.json`（访问 2026-11-16；本地数据，无法提供外部直链）；[NCI Testicular Cancer Treatment](https://www.cancer.gov/types/testicular/treatment)（网页更新时间，访问 2026-11-16）。

## 原型验收状态

- HTML 路径：`prototypes/v0.2/index.html`；本机 Chromium file:// 已预览。2026-11-17 本仓探针 P1–P9 + E0：10/10 通过；带本仓 `--url ... --self-test` 注入弹窗/缺返回/趋势禁词后预期 3 项 FAIL，自测通过。
- 指南资料：本轮没有下载或读取 NCCN PDF 原件；`scripts/check-primer-links.mjs --http`：12/12 通过（HTML/官方入口 HTTP 200；该结果不代表 NCCN PDF 原件已取得）。
- 用户确认：待用户审阅原型模块范围；未确认前 G2 不签认。
