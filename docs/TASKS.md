# 实施任务与当前交接

规格版本：v0.2.0（G2 已确认）；当前包版本 `0.2.0`，目标 `0.2.0`。分支：`main`。

| ID | 业务单元 | 前置依赖 | 实现/检查要求 | 当前证据 | 状态 |
| --- | --- | --- | --- | --- | --- |
| M2 | HTML交互原型 | G1、患者流程、28号路径 | 双合成档案、交互原型、实际预览、独立评审及用户确认；C1–C12 | 原型文件已交付；`probe-testicular-m2` 20/20及疾病概要探针10/10；用户 2026-11-18 确认 P0–P9 与 Agent Pane 全范围；独立审查已记 PROTOTYPE-REVIEW；密集标签已修，读屏未测 | G2 已确认；production parity 通过 |
| M3 | schema 0001/0002 | 领域合同 | freeze hash/词汇检查 | `check-schema-words` 两迁移与 freeze hash 通过；SQL未改动 | 已完成前置复核 |
| M4 | 临床研究快照 | 来源记录 | JSONL/SQLite/manifest 一致，通道失败如实 | 用户授权 2026-11-18 重跑：9 条宽词返回/24 来源状态；snapshot 与 chain 检查通过；相关性未逐条审核 | 已完成（口径限制已标） |
| M5 | 生产工作台与 parity | G2 确认原型 | iframe 接入、SQLite 读写、修订链、私密导出、宿主 Agent Pane、UI parity | 本机临时 profile 浏览器探针：连接成功；化验写入回读 `3.3`；私密笔记入库、导出不含私密行；`check-ui-parity` 通过 | 代码实现与静态/browser API 验证完成；真实 Desktop 未验证 |
| M6 | pack/测试profile扫描 | M2–M5、版本冻结 | 0.2.0 tgz、pack 解压副本 + starter `check-profile.mjs` 静态扫 | 40 files/3.0 MB；SHA-256 `cd539be18076fbcd2b26c4773f18b1279b0f024a26dab5d4c2b792cceb564610`；profile `通过 1/1` | 测试 profile 静态扫描完成；Desktop 实机安装/退出重开/点击走查未验证 |
| M7 | 发布准备 | M6 | 只准备草稿；本任务不打tag、不发Release | `docs/release-draft/M7-M8-草稿.md` | 草稿 |
| M8 | BACKLOG回填 | 发布授权 | 本任务不改组织仓 | 仅本仓草稿 | 不执行 |
| M9 | 全量门禁 | M2–M6 | npm run check、npm test、npm run audit、最终 npm pack、测试 profile 静态扫描、≤2真实场景 | `npm run check` exit 0；`npm test` 12/12；audit 40/40；pack 40 files；profile 1/1；2 个场景一致，见 TEST-CASES / MILESTONE-EVIDENCE | 五项门禁/两条场景通过；报告提交待完成；Desktop UI 未验证 |

## 交接

- 当前：M5/M6 完成；五项 M9 门禁和两条测试用例通过。完整读屏、图表压力项与 Desktop 实机仍未验证。
- 下一步：把全量证据和 DAY-REPORT-3 推送，生成工作目录终版报告。
- 已确认授权：Git commit/push 每里程碑；不发布、不打tag、不改组织 BACKLOG；所有Desktop实机状态均未验证。

- 2026-11-18：M2 已获用户确认并经独立审查；M4 已按授权重跑并推送。逐项证据见 `docs/MILESTONE-EVIDENCE.md`。
