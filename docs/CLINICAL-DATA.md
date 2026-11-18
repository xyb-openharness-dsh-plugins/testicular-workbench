# CLINICAL-DATA · testicular-workbench

> 临床数据台账：医学约束 + 临床试验快照。M0 版（M1 完成 10 主题医学约束核对；未过临床审核的阈值与求助短语一律【待核】占位）。

## §一 采集与快照（M4，2026-11-18 用户授权重跑）

- 脚本：`scripts/fetch-testicular-trials-2026.mjs`，通过 `unified-trial-mcp@0.3.1` 的 MCP stdio 通道取数；没有自行拼接上游 URL。
- 本次取数日期：2026-11-18；四个查询词（睾丸癌 / testicular cancer / testicular neoplasms / 生殖细胞肿瘤）返回 9 条，合并前 9 条。只有 chinadrugtrials 返回记录（9 条）；其余来源逐词条终态见 `manifest.json` 与 SQLite `source_statuses`。
- 9 条是宽词检索返回记录，未逐条审核与睾丸癌的相关性；不能写成经审核的睾丸癌研究数或覆盖度。登记状态一律“未核实”；获取成功不代表内容已核实。
- 用户 2026-11-18 确认：原 SQLite 未入仓且已不可恢复，授权使用仓内既有取数脚本重跑。当前 SQLite/JSONL 与 manifest 哈希按新产物重新计算登记；这是获授权的新快照，不是修改哈希凑绿。
- 交付物：`research/testicular/{manifest.json,trials-2026.jsonl,testicular_trials_2026.sqlite}`。`node scripts/check-trial-snapshot.mjs .` 与 `node scripts/check-trial-chain.mjs .` 均通过。来源状态详见 manifest 中按查询词列出的 `queryResults` 与 SQLite `source_statuses`。
- 快照会过期（manifest 记录来源状态）；入排标准不在快照内，详情浮窗固定写“本机快照只存登记的结构化字段，入排标准请到官方登记页核对”。

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

## §五 M4 复核补记（2026-11-18）

- 用户授权重跑后生成 9 条 JSONL / 9 条 SQLite 记录、24 行来源终态；新文件 SHA-256 见 manifest。`check-trial-snapshot` 输出 `records=9/9 sourceStatuses=24` 并 `PASS snapshot consistency: 1 snapshot(s)`；`check-trial-chain` 输出 `✓ 临床试验闸门通过`。
- 仅 chinadrugtrials 对“睾丸癌”查询返回 9 条；其余通道失败或未配置，细节按查询词记录于 manifest。此检索不是全库完整检索。
- 9 条均为宽词检索返回记录，尚未逐条审核相关性，不可称为睾丸癌相关研究数。原 235 条同样是未审核的宽词检索数；旧快照缺失后已按用户授权生成新快照，未沿用旧记录或旧哈希。
