# 睾丸癌工作台 0.2.0 收口报告

日期：2026-11-18 UTC  
仓库：`testicular-workbench` · 分支：`main`  
品牌：**「小勇宝 TestiPal」占位名，待用户追认**

## 里程碑

| 里程碑 | 状态 | 结果 |
|---|---|---|
| M0 | 完成（回填） | 包骨架、需求与初始领域 schema 证据据 `git log`、`PROGRESS.md` 和 `DAY-REPORT-2.md` 回填；未推倒重做。 |
| M1 | 完成（回填） | 需求研究、G1 与差异矩阵关键证据回填；访谈 0、临床审核未完成的限制照原文保留。 |
| M2 | 完成 | 用户 2026-11-18 确认 HTML SHA-256 `1b7739308f93af0f1a846a4bc5a24e77f5649254ebc761d9620a249736db05f3` 及 P0–P9、Agent Pane 范围进入生产。独立设计审查与 P8 范围补记见 `docs/PROTOTYPE-REVIEW.md`、`docs/MILESTONE-EVIDENCE.md`。探针 9 路由通过，图表密集末值标签坐标为 68/82/96。 |
| M3 | 完成（回填） | schema 0001/0002 与 freeze contract 本轮未改；既有词汇/hash 检查证据回填。 |
| M4 | 完成 | 用户授权使用既有脚本重跑公开来源：2026-11-18 得到 9 条宽词返回、24 行来源状态。新 SQLite/JSONL/manifest 已入仓并通过快照对账与 chain 检查。9 条相关性未逐条审核，不代表已审核的睾丸癌研究数。原 235 条是旧的未审核宽词数。Manifest 的 `trimmed:true` 标识获批 P8 原型不提供在线检索/个体匹配；未更改 SQLite/JSONL 内容或哈希凑绿。 |
| M5 | 完成 | 生产 iframe/SQLite 读写与修订链、宿主档案同步和疾病概要入口已接入；`public/` parity 通过。临时 Chromium + SQLite 验证新增化验回读为 3.3、私密笔记写入和导出过滤；浏览器错误 0。 |
| M6 | 完成（sam 可做范围） | 版本为 0.2.0；最终 tgz 40 files、3.0 MB（解包 3.4 MB），SHA-256 `cd539be18076fbcd2b26c4773f18b1279b0f024a26dab5d4c2b792cceb564610`。从相同 tgz 解包构造的测试 profile 经 starter rc.56 `check-profile.mjs` 扫描 1/1 通过。 |
| M7/M8 | 按任务范围不执行 | 未发 Release、未打 tag、未改组织 BACKLOG。 |
| M9 | 完成 | 五项门禁与两条最高价值测试场景通过，见下。 |

## 门禁结果

- `npm run check`：退出 0；内含测试 12/12、快照 `records=9/9 sourceStatuses=24`、UI parity 和检查链通过。
- `npm test`：退出 0，12/12。
- `npm run audit` 与 `dsh-wb-cli audit /data/home/dev/testicular-workbench`：均退出 0，40/40 通过、0 fail、0 待人工。
- `npm pack`：退出 0；40 个文件，3.0 MB。
- starter `scripts/check-profile.mjs --profile /tmp/testi-profile-m9-NyEbDC --only testicular`：`通过 1/1`；业务 `public/`、bundle 与 dependency 均在解包测试 profile 中。
- `docs/TEST-CASES.md` 两个真实场景均判定“应该/现实一致”：真实 JSON 下载排除私密笔记；宿主切至档案 B 后看板读取 B 的记录。

## 未验证与待决定

- `node scripts/check-install.mjs` 退出 1：sam 未发现 DSH Desktop `io.dsh.desktop`。真实 Desktop profile 安装、退出重开、入口/业务/Agent 点击走查均为**未验证**；临时测试 profile 扫描不等于 Desktop 安装。
- 屏幕阅读器完整走查、图表压力数据（MT05/06/10/11/14）未验证。
- 正式品牌名待用户追认；用户访谈与临床审核尚未完成。
- 工作台应用包不含研究目录内的 SQLite 快照；P8 仅展示来源/状态，不提供搜索、收藏或个体匹配。研究快照保存在仓库并有未逐条审核说明。

## Git 与发布

M4、M2、M5、M6 阶段提交均已按里程碑提交并推送至 `origin/main`；本报告随 M9 提交推送。没有发布 Release、打 tag、投稿或修改组织 BACKLOG。

详细回填与本轮命令证据：[`docs/MILESTONE-EVIDENCE.md`](docs/MILESTONE-EVIDENCE.md)。  
功能范围与 parity：[`docs/PARITY.csv`](docs/PARITY.csv)、[`docs/PROTOTYPE-REVIEW.md`](docs/PROTOTYPE-REVIEW.md)。  
场景实测：[`docs/TEST-CASES.md`](docs/TEST-CASES.md)。
