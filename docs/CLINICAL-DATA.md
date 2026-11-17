# CLINICAL-DATA · testicular-workbench

> 临床数据台账：医学约束 + 临床试验快照。M0 版（M1 完成 10 主题医学约束核对；未过临床审核的阈值与求助短语一律【待核】占位）。

## §一 采集与快照（M4，2026-11-14 实测）

- 脚本：scripts/fetch-testicular-trials-2026.mjs（unified-trial-mcp MCP stdio，绝不自拼 URL）。
- 实测：检索 4 词条（睾丸癌 / testicular cancer / testicular neoplasms / 生殖细胞肿瘤），合并 235 条（合并前 235）：chinadrugtrials 9、ctv 7、ictrp 219。
- 通道终态（如实，FAILED 不算查过）：chictr_online=FAILED（全部词条）、chictr_pancreatic_archive=NEEDS_SETUP（离线语料仅胰腺癌覆盖）、ictrp 在「生殖细胞肿瘤」中文词条 FAILED；xyb_chinadrugtrials_archive=NO_RESULTS；其余 SUCCESS/NO_RESULTS 逐词条入 manifest 与 source_statuses 表。
- 四件套：research/testicular/{manifest.json, testicular_trials_2026.jsonl, testicular_trials_2026.sqlite, source_statuses}（jsonl/sqlite 计数与 hash 断言在 check-trial-snapshot）。
- 登记状态一律「未核实」；快照会过期（freshness.staleAfterDays）；入排标准不在快照内，详情浮窗固定写「本机快照只存登记的结构化字段，入排标准请到官方登记页核对」。

## §二 医学约束主题（M1 逐项核数；下表为边界声明，非结论）

| # | 主题 | 内容边界 | 状态 |
| --- | --- | --- | --- |
| 1 | 标志物三线（AFP/β-hCG/LDH） | 只记录数值/单位/方法/机构；术后标志物按半衰期间隔复测是指南口径（NCCN/AUA，见 §四题录），具体半衰期数值（AFP 5–7 天、hCG 24–36h）作展示参考标注【待核】 | 边界有源，数值待核 |
| 2 | 分期体系（TNMS + 血清 S 分期） | 血清标志物参与分期与风险分层是指南口径（NCCN/AUA 题录）；本台只以医生原话照录，不展示分期判定表格 | 边界有源，待核 |
| 3 | 组织学（精原/非精原） | 只以医生原话/病理报告照录；试验检索的病理条件透传用户选择 | 待核 |
| 4 | I 期主动监测 vs 辅助化疗 | 只挂医生方案原话为节点；不呈现倾向性对比 | 待核 |
| 5 | BEP/EP 方案周期结构 | 方案名+周期序号为患者可记录粒度；不写剂量建议 | 待核 |
| 6 | 化疗骨髓抑制监测（血象组） | 数值记录；参考范围标注【待核】；不预警 | 待核 |
| 7 | 顺铂相关肾/电解质监测（肌酐/镁/钾） | 数值记录；不判定 | 待核 |
| 8 | 生育力保存时窗 | 只记录四态事实与机构；咨询时机表述引用公开患者教育材料【来源待核】 | 待核 |
| 9 | 影像随访节奏（CT 胸腹盆等） | I 期精原细胞瘤监测节奏存在按年度分层的公开口径（第 1 年每 3–4 月等）但逐版本不同，本台不写通用节奏表，节点一律由医生方案原话生成 | 有二手口径，逐版本待核 |
| 10 | 对侧睾丸与远期健康 | 只列随访节点与自查提醒式记录；无统计话术 | 待核 |

## §四 题录（2026-11-16 夜班检索，访问日期 2026-11-16）

- NCCN Guidelines – Testicular Cancer（官方 PDF 入口，全文需注册）：https://www.nccn.org/professionals/physician_gls/pdf/testicular.pdf ——「原件未取得，据检索摘要与二手转述」。
- Testicular Cancer, Version 2.2020, NCCN Clinical Practice Guidelines（JNCCN 2019-12，二次来源）：术后以半衰期间隔复测血清标志物用于分期与风险分层。
- AUA Early-Stage Testicular Cancer Guideline（Stephenson et al., 2019，二次来源）：nadir 标志物（AFP/hCG/LDH）术后按半衰期间隔复测；I 期监测含 H&P+血清标志物+腹盆 CT±胸部影像。
- 中国规范：未检索到 CSCO 睾丸肿瘤 2024 版专册（如实记录）；中文题录改录《2022 版中国肿瘤整合诊治指南（CACA）》泌尿男生殖系分册 + 《2024 版中国泌尿外科和男科疾病诊断治疗指南》（依据：中国抗癌协会泌尿男生殖系肿瘤患教手册 2024-11，http://www.caca.org.cn/system/2024/11/22/030118404.shtml）。版本核对【待核】。

## §三 红线

- 中国适应证/指南只认中国官方来源（NMPA/卫健委/CSCO 原文），题录留 URL 与访问日期。
- 指南只定内容边界，不转成自测或选治疗；本台全部派生为事实陈述（较上次/完成与否）。
- 「紧急情况联系医生/急诊」求助短语：只呈现医生已确认行动计划原话或通用「需要问你的医生」出口，模板短语【待核】。

## §五 M4 复核补记（2026-11-17）

- `trials-2026.jsonl` 存在（235行），文件 SHA-256 与 manifest 声明一致；JSONL→试验链覆盖门禁通过。
- M4 四件套要求的 `testicular_trials_2026.sqlite` 当前缺失。manifest 仍声明旧文件 SHA-256 `c19870a5082ba1afcd18e4b8ebf744b6fe118d7fea6c2129aeb6940d79580f05`、235 条记录与 24 行 source status。快照一致性门禁因此失败；没有重建数据库或改写哈希，因为当前工作区没有原 SQLite/source_statuses 原件用于逐字段核验。
- 235 是宽词检索的登记快照条目总数，尚未逐条确认睾丸癌相关性，不可作为相关试验数量或覆盖度结论。部分在线检索通道 FAILED；原 manifest 的终态原件应随快照恢复后核验。
- M4 状态：未收口。恢复可信原件/重跑获授权的统一检索工具，逐条复核病种相关性和来源链接，再执行 JSONL/SQLite/manifest 一致性门禁；不得伪造或改 hash 凑绿。
