# freeze-contract · 迁移冻结账本

## 规则

- `0001_initial.sql` 冻结于 2026-11-14（M3 前置，夜间无人值守自动签认，待晨审追认）。
- 结构变更只能新增 `000N_*.sql`；修改已冻结文件会被 check 拦下。
- 判读列 0：全库无 diagnosis / risk_level / stage_column / prognosis / response / 评分类列
  （scripts/check-schema-words.mjs 断言）。临床分期与 S 分期只进 doctor_quotes 原文照录。
- 派生值（距下次节点天数、节点完成计数、标志物趋势读数）读时计算，不落库。
- 显式 null ≠ 0；更正只新增版本（ver + superseded_by）；候选未核对（in_use=0）不参与呈现与匹配。

## sha256

| 文件 | sha256 | 冻结时点 |
| --- | --- | --- |
| schema/0001_initial.sql | `6331c36b3da341a7ffb3b7f56c2464ddd8153e12276b1ab52aae98fa81a551cd` | 2026-11-14 M3 前置 |
