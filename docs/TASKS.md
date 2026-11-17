# 实施任务与当前交接

规格版本：v0.2.0 候审；包版本 `0.1.1`。分支：`main`。

| ID | 业务单元 | 前置依赖 | 实现/检查要求 | 当前证据 | 状态 |
| --- | --- | --- | --- | --- | --- |
| M2 | HTML交互原型 | G1、患者流程、28号路径 | 双合成档案、交互原型、实际预览、独立评审及用户确认；C1–C12 | 原型文件已交付；`probe-testicular-m2` 20/20及疾病概要探针10/10；用户/独立审查未完成；密集末点/读屏未测 | 候审，G2未通过 |
| M3 | schema 0001/0002 | 领域合同 | freeze hash/词汇检查 | `check-schema-words` 两迁移与 freeze hash 通过；SQL未改动 | 已完成前置复核 |
| M4 | 临床研究快照 | 来源记录 | JSONL/SQLite/manifest 一致，通道失败如实 | `check-trial-chain` 通过；`check-trial-snapshot` 因SQLite缺失失败；235相关性未审 | 未完成 |
| M5 | Agent pane 契约 | 官方合同+原型 | newSession+subscribe、self-test反向对照 | `check-agent-pane-contract .` 通过；`--self-test` 反例8条/正例零误报 | 静态合同复扫完成；真实宿主未验证 |
| M6 | pack/测试profile安装 | M2–M5、版本冻结 | pack、正确Desktop profile安装及验证 | `check-install` 明确找不到 `io.dsh.desktop`；没有包安装 | 未完成（Desktop未安装） |
| M7 | 发布准备 | M6 | 只准备草稿；本任务不打tag、不发Release | `docs/release-draft/M7-M8-草稿.md` | 草稿 |
| M8 | BACKLOG回填 | 发布授权 | 本任务不改组织仓 | 仅本仓草稿 | 不执行 |
| M9 | 全量门禁 | 前置里程碑闭合 | npm run check、npm test、五项门禁 | `npm test`12/12、audit39/39、pack dry-run通过；check因probe-coverage失败；trial snapshot/UI parity失败 | 未完成 |

## 交接

- 当前阻塞：M2 等用户确认原型具体 hash/模块范围，并缺独立审查与完整 C1–C12；M4 快照 SQLite 原件缺失；M6 Desktop 未安装。
- 下一步：取得 M2 模块确认后继续相应 G2/实现；恢复 M4可信原件；其余只做已确认且独立的任务。
- 已确认授权：Git commit/push 每里程碑；不发布、不打tag、不改组织 BACKLOG；所有Desktop实机状态均未验证。
