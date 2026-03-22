# 长期校正参考设计

日期：2026-03-22

## 1. 目标

在保留现有 SWR 主结果的前提下，引入一个基于退休年限与未来支出增长的长期校正参考值。该参考值不替代主结果，只作为补充，用于提示用户：如果考虑更长退休期和未来支出增长，所需资产可能高于当前的单年 SWR 估算。

## 2. 模型原则

- 主结果继续保持为：`annualExpense / swr`
- 新增结果为：`longevityAdjustedTarget`
- 长期校正值采用逐年离散求和的支出年金现值模型
- 退休后的第 1 年支出基于当前最终年支出拆分而来
- 基础支出部分按 `inflationRate` 增长
- 住房补充部分在无房时按 `rentGrowthRate` 增长，有房时恒为 0
- 投资收益率 `returnRate` 作为逐年贴现率

## 3. 支出拆分

为了避免把未来支出增长简化成一个统一增长率，长期校正参考使用三段拆分：

1. 基础年支出（不含住房、不含医疗）
2. 住房年支出补充
3. 医疗年支出增量

其中：

- 基础年支出部分随通胀增长
- 住房年支出补充在无房时随租金增长率增长
- 医疗年支出增量并入基础支出轨迹，随通胀增长

这样做的目的是让“租金增长率”只影响真实与租房相关的部分，而不是错误放大所有生活支出。

## 4. 计算方式

记：

- `baseAnnualExpense` 为基础年支出
- `housingAnnualExpense` 为住房年支出补充
- `medicalAnnualExpense` 为医疗年支出增量
- `retirementYears` 为退休年限
- `returnRate` 为贴现率

则第 `n` 年支出为：

```ts
yearExpense(n) =
  (baseAnnualExpense + medicalAnnualExpense) * (1 + inflationRate) ** (n - 1)
  + housingAnnualExpense * (1 + rentGrowthRate) ** (n - 1)
```

若有房，则 `housingAnnualExpense = 0`。

第 `n` 年折现后现值为：

```ts
presentValue(n) = yearExpense(n) / (1 + returnRate) ** n
```

长期校正参考值为：

```ts
longevityAdjustedTarget = sum(presentValue(n)), n = 1..retirementYears
```

## 5. 边界与数值稳定性

- 不使用封闭式年金公式，统一采用逐年离散求和
- 当贴现率低于增长率时，不报错，结果自然变高
- `retirementYears` 仅影响长期校正参考值，不影响主结果
- 安全等级与风险标签仍按现有 SWR 规则生成

## 6. UI 设计

结果区新增“长期校正参考”卡片，放在主结果说明区与风险提示之间。卡片展示：

- 长期校正参考资产
- 与主结果的差额
- 固定说明文案：`基于退休年限与未来支出增长估算`

不新增图表，不替换现有资产区间条。

## 7. 测试重点

- 有房场景下住房轨迹始终为 0
- 无房场景下租金增长率会拉高长期校正参考
- 退休年限增加时长期校正参考单调上升
- 贴现率低于增长率时结果仍稳定返回
- UI 正确显示长期校正参考卡片与差额
