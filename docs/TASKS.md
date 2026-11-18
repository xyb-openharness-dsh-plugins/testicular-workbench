# 实施任务与当前交接

规格版本：v0.2.0（G2 已确认）；当前包版本 `0.1.1`，目标 `0.2.0`。分支：`main`。

| ID | 业务单元 | 前置依赖 | 实现/检查要求 | 当前证据 | 状态 |
| --- | --- | --- | --- | --- | --- |
| M2 | HTML交互原型 | G1、患者流程、28号路径 | 双合成档案、交互原型、实际预览、独立评审及用户确认；C1–C12 | 原型文件已交付；`probe-testicular-m2` 20/20及疾病概要探针10/10；用户 2026-11-18 确认 P0–P9 与 Agent Pane 全范围；独立审查已记 PROTOTYPE-REVIEW；密集标签已修，读屏未测 | G2 已确认；production parity 待完成 |
| M3 | schema 0001/0002 | 领域合同 | freeze hash/词汇检查 | `check-schema-words` 两迁移与 freeze hash 通过；SQL未改动 | 已完成前置复核 |
| M4 | 临床研究快照 | 来源记录 | JSONL/SQLite/manifest 一致，通道失败如实 | 用户授权 2026-11-18 重跑：9 条宽词返回/24 来源状态；snapshot 与 chain 检查通过；相关性未逐条审核 | 已完成（口径限制已标） |
| M5 | Agent pane 契约 | 官方合同+原型 | newSession+subscribe、self-test反向对照 | `check-agent-pane-contract .` 通过；`--self-test` 反例8条/正例零误报 | 静态合同复扫完成；真实宿主未验证 |
| M6 | pack/测试profile安装 | M2–M5、版本冻结 | pack、正确Desktop profile安装及验证 | `check-install` 明确找不到 `io.dsh.desktop`；没有包安装 | 未完成（Desktop未安装） |
| M7 | 发布准备 | M6 | 只准备草稿；本任务不打tag、不发Release | `docs/release-draft/M7-M8-草稿.md` | 草稿 |
| M8 | BACKLOG回填 | 发布授权 | 本任务不改组织仓 | 仅本仓草稿 | 不执行 |
| M9 | 全量门禁 | 前置里程碑闭合 | npm run check、npm test、五项门禁 | `npm test`12/12、audit39/39、pack dry-run通过；路由探针覆盖门禁已修复并通过；`npm run check` 当前因缺失 trial SQLite 失败；独立 `check-ui-parity` 因未生成 production `public/` 失败；Desktop 未验证 | 未完成 |

## 交接

- 当前阻塞：M5 production UI/parity 待完成；M6 Desktop 未安装但按授权做测试 profile 验证；完整读屏与压力项仍未验证。
- 下一步：按已确认原型实现 production iframe 与数据读写；完成 parity、M6 测试 profile 与 M9 五项门禁。
- 已确认授权：Git commit/push 每里程碑；不发布、不打tag、不改组织 BACKLOG；所有Desktop实机状态均未验证。

- 2026-11-18：M2 已获用户确认并经独立审查；M4 已按授权重跑并推送。逐项证据见 `docs/MILESTONE-EVIDENCE.md`。
