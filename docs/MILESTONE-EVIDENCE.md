# 里程碑证据表（MILESTONE-EVIDENCE）

> 依据 starter rc.56 模板。未跑/未取得/未安装的事项如实标明；DAY-REPORT 完成结论必须回指本表。

| 里程碑 | 交付物（文件/提交号） | 验证命令 | 关键输出（原文摘录：数字/退出码） | 未验证项及原因 |
|---|---|---|---|---|
| M0 | 回填：`b664ded`、`8330ea5`；`docs/SPEC.md`、`docs/DEV-REQUIREMENTS.md`、`schema/0001_initial.sql`、`schema/0002_app_setting.sql`、`docs/CLINICAL-DATA.md` | 回填自 `git log`、`PROGRESS.md`、`DAY-REPORT-2.md` | 回填：`npm run check` exit 0、`npm test` 9/9、临床试验快照最初检索 235 条（非相关性审核数），详见既有日结 | 原始 235 条 SQLite 不在仓且无法恢复；不以历史数字代替新快照 |
| M1 | 回填：`30d12ed`；`docs/DIFF-MATRIX.md`、`docs/USER-RESEARCH.md`、`docs/signoffs/G1-自动签认.md` | 回填自 `PROGRESS.md`、`DAY-REPORT-2.md` | 回填：重名率 16.7%（1.5/9）；访谈 0；G1 七项自动检查通过，晨审追认状态按原文保留 | 人工晨审追认未在本轮重做/核实 |
| M2 | `prototypes/v0.2/`、`docs/PROTOTYPE-REVIEW.md`；确认基准 HTML SHA-256 `1b7739308f93af0f1a846a4bc5a24e77f5649254ebc761d9620a249736db05f3`；后续最小修订 `app.js`、`demo-data.js` | `sha256sum prototypes/v0.2/index.html`；`NODE_PATH=/tmp/testi-browser-deps/node_modules CHROME_PATH=/usr/bin/chromium node scripts/probe-testicular-m2.mjs --url file:///data/home/dev/testicular-workbench/prototypes/v0.2/index.html` | 哈希原文为用户指定值；探针：9 routes；曲线高度 `145/145/145`；profile B `10→3`；窄屏 `9/9`；dense labels `3 labels; y=68/82/96`；`no browser errors`；退出码 0。用户 2026-11-18 确认 P0–P9 与 Agent Pane 全范围进入生产。独立审查逐项见 PROTOTYPE-REVIEW.md | 完整读屏、MT05/06/10/11、MT14 压力数据未验证；不影响已确认的实现授权，但不得标测试通过。ego-browser 命令在 sam 不可用，本次使用系统 Chromium 与 Puppeteer 探针 |
| M3 | 回填：`9b80e5a`；schema 0001/0002、freeze contract | 回填自 `PROGRESS.md`、`DAY-REPORT-2.md`；本轮不改迁移 | 回填：`node scripts/check-schema-words.mjs .` 通过；0001/0002 与 freeze hash 一致 | 本轮仅沿用回填证据，未重做迁移检查 |
| M4 | `32a2866`（已推送）；`research/testicular/{manifest.json,trials-2026.jsonl,testicular_trials_2026.sqlite}`；`scripts/fetch-testicular-trials-2026.mjs` | 用户授权后 `UNIFIED_TRIAL_CLI=/tmp/testi-trials-mcp/node_modules/unified-trial-mcp/dist/src/cli/main.js node scripts/fetch-testicular-trials-2026.mjs`；`node scripts/check-trial-snapshot.mjs .`；`node scripts/check-trial-chain.mjs .` | `完成：9 条（合并前 9 条）bySource={"chinadrugtrials":9}`；`CHECK ... records=9/9 sourceStatuses=24`；`PASS snapshot consistency: 1 snapshot(s)`；`✓ 临床试验闸门通过`；检查退出码均为 0。manifest 登记新文件 SHA-256；后来依已确认 P8 原型范围加 `trimmed:true` 与 snapshot 9/date 元数据说明应用不提供检索/匹配，该标记不改变数据文件或哈希；用户 2026-11-18 确认授权重跑 | 9 条是宽词返回，相关性未逐条审核；其他来源失败/未配置，覆盖不完整；不得将 9 写成已审核睾丸癌研究数 |
| M5 | 本轮：`src/client.js`、`prototypes/v0.2/app.js`、`dsh/{workbench,readmodels}.js`、`public/`、`scripts/migrate-public.mjs` | `node scripts/build-client.mjs`；`node scripts/migrate-public.mjs`；`node scripts/check-ui-parity.mjs`；`node scripts/check-agent-pane-contract.mjs .`；临时 Node SQLite + Chromium profile/browser smoke；`npm test` | build client exit 0；`✓ ui-parity`；Agent contract `pass: true`；browser smoke：连接 2 个档案、化验写入回读 3.3、私密笔记 private=true、导出 private=false、浏览器错误 0；`npm test` 12/12。用户 2026-11-18 确认 P0–P9 + Agent Pane 进入生产 | Desktop 未安装，真实窗口布局/会话、键盘完整走查未验证；图表读屏和 MT 压力项继续未验证 |
| M6 | `VERSION`/`package.json`/`lib/version.js`=0.2.0；`/tmp/testi-m9-final/xyb-community-testicular-workbench-0.2.0.tgz` | `npm pack --pack-destination /tmp/testi-m9-final`；`sha256sum`；starter `scripts/check-profile.mjs --profile /tmp/testi-profile-m9-NyEbDC --only testicular`；`node scripts/check-install.mjs` | npm pack：40 files，3.0 MB，unpacked 3.4 MB，SHA-256 `cd539be18076fbcd2b26c4773f18b1279b0f024a26dab5d4c2b792cceb564610`；profile 静态扫描 `通过 1/1`，public/、bundle、dependency 均通过；`check-install` exit 1，未找到 DSH Desktop | 这是解包副本构造的测试 profile，不是真机安装；正确 Desktop profile、重启和 UI 点击未验证 |
| M7 | 本轮不执行 | 不适用 | 不发 Release、不打 tag | 按用户明确范围排除 |
| M8 | 本轮不执行 | 不适用 | 不改组织 BACKLOG | 按用户明确范围排除 |
| M9 | 门禁证据：`docs/TEST-CASES.md`、最终 tgz、各检查日志见本轮命令实跑 | `npm run check`；`npm test`；`npm run audit`；`dsh-wb-cli audit .`；`npm pack`；starter `check-profile.mjs` | `npm run check` exit 0（内含 12/12）；独立 `npm test` 12/12；`npm run audit` 与 `dsh-wb-cli audit .` 均 40/40 通过、0 失败、0 待人工；pack 40 files/3.0 MB；profile `通过 1/1`；两条用例判定一致 | 完整读屏/MT 压力项、真实 Desktop profile/重启/点击未验证；品牌名待追认

## 证据自检

- 既往 M0/M1/M3/M5 标为“回填”，仅引用仓内提交、PROGRESS 与 DAY-REPORT-2，未伪装本轮重跑。
- M4 是用户授权的新快照；manifest 与实际 JSONL/SQLite 哈希对应，不改旧 hash 凑绿。
- 生产实现、五项门禁与两条场景证据均已实跑；Desktop 实机状态和人工设计/临床审核状态保持“未验证/未完成”，不以静态检查替代。
