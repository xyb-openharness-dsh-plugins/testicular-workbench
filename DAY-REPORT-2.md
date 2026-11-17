# 睾丸癌工作台续跑报告（M2–M9）

日期：2026-11-17  
项目：小勇宝 TestiPal · Testicular Cancer · NCCN #37 · W3 泌尿生殖族 · T2  
仓库：`xyb-openharness-dsh-plugins/testicular-workbench`  
目标版本：`0.2.0`；仓库包当前版本仍为 `0.1.1`。本报告记录实际状态，不代表 M2–M9 全部完成。

## 里程碑状态

| 里程碑 | 状态 | 证据与遗留 |
| --- | --- | --- |
| M0/M1 | 已完成（既有记录） | M1 G1 自动签认待晨审追认；没有重复认领 Issue #80。 |
| M2 交互原型 | 原型候审，G2 未签 | `prototypes/v0.2/index.html` 及配套实现已提交；HTML SHA-256：`1b7739308f93af0f1a846a4bc5a24e77f5649254ebc761d9620a249736db05f3`。Chromium 浏览器探针 20/20，疾病概要探针 10/10，HTTP 链接检查 12/12。用户尚未确认此 hash 和模块实施范围，独立设计审查也未完成，因此未进入生产业务实现。图表密集标签与完整读屏验证仍有缺项。 |
| M3 数据合同 | 已复核 | `check-schema-words` 通过；0001/0002 与 freeze hash 一致，本轮未改迁移。 |
| M4 临床/试验数据复核 | 未完成 | Trial chain 通过；snapshot 检查失败：`research/testicular/testicular_trials_2026.sqlite` 缺失。manifest 声明 235 条、24 行 source status 及旧 hash。未重建 SQLite、未改 hash。235 条是宽词检索，不是经相关性审核的睾丸癌研究数；相关性未逐条定审。 |
| M5 Agent 面板契约 | 静态复扫完成 | `check-agent-pane-contract` 与 self-test 通过；`newSession`、`subscribe` 齐全，self-test 捕获 8 条注入反例。真实 Desktop 宿主面板行为未验证。 |
| M6 pack/测试 profile | 未完成 | `npm run pack:check` dry-run 成功，但内容仍是 0.1.1、33 files，非最终 0.2.0 包。`check-install` 未发现 DSH Desktop (`io.dsh.desktop`)；未安装 profile。 |
| M7/M8 发布准备 | 仅本仓草稿 | 草稿位于 `docs/release-draft/M7-M8-草稿.md`。没有打 tag、发 Release、投稿、创建 PR 或修改组织 BACKLOG。 |
| M9 全量自检 | 未完成 | `npm run check` 退出 1（SQLite 缺失）；`npm test` 12/12 通过；`npm run audit` 39/39 通过；`npm run pack:check` dry-run 通过。独立 `check-ui-parity` 因尚未生成 production `public/` 失败；M2 未确认前未生成正式构建。用户要求的五项门禁未全部通过。 |

## 未验证项

- DSH Desktop 安装、目标 profile 登记、退出重开、列表入口及业务点击走查：均未验证（本机环境没有 DSH Desktop）。
- Agent 面板的真实会话创建、订阅、草稿与宿主 UI 行为：未验证。
- G2 独立设计审查、完整 C1–C12 与全量读屏/密集标签检查：未完成。
- 试验快照与 SQLite/状态原件一致性：因原 SQLite 缺失未验证。
- 0.2.0 最终包、目标 profile 安装和版本一致性：未完成；当前 package 仍为 0.1.1。

## 待决定/待提供

1. 请确认原型 HTML hash `1b7739308f93af0f1a846a4bc5a24e77f5649254ebc761d9620a249736db05f3` 及 `docs/PROTOTYPE-REVIEW.md` 中的配套文件 hash，并明确全部或选定模块可进入生产实现；若需修改请给反馈。
2. M4 需要恢复可信的原始 SQLite/来源状态文件，不能通过重建数据或改 hash 关闭失败。
3. 若后续要求 Desktop 安装验收，需要在装有并已启动 DSH Desktop 的目标机器上完成安装、重启和交互核验。

## 推送记录

- `efbc503` — M2 原型候选
- `e5e65ad` — M2 原型 hash 与浏览器证据更新
- `01da0b9` — M9 门禁预检状态修订
- 本报告随 `DAY-REPORT-2.md` 一并推送。未打 tag、未发布。
