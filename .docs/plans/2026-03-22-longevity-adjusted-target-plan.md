# 长期校正参考实施计划

日期：2026-03-22

## 目标

实现基于退休年限与未来支出增长的长期校正参考值，并在结果区增加对应展示卡片，同时保持现有 SWR 主结果不变。

## 任务 1：扩展计算结果类型

文件范围：

- `src/core/types.ts`

工作内容：

- 为 `FireCalculationResult` 新增长期校正参考相关字段
- 建议至少包含：
  - `annualHousingCost`
  - `longevityAdjustedTarget`
  - `longevityAdjustmentDelta`

完成标准：

- 类型定义能支撑后续计算与 UI 展示

## 任务 2：先写计算层失败测试

文件范围：

- `src/core/calculator.test.ts`

工作内容：

- 新增以下失败测试：
  - 有房时住房轨迹为 0，长期校正参考可正常计算
  - 无房且租金增长率更高时，长期校正参考高于同条件低租金增长率
  - 退休年限增加时，长期校正参考上升
  - 贴现率低于增长率时仍返回稳定数值

完成标准：

- 测试先失败，且失败原因来自功能缺失或结果不正确

## 任务 3：实现长期校正参考计算

文件范围：

- `src/core/calculator.ts`

工作内容：

- 拆分当前支出结构，明确：
  - 基础年支出轨迹
  - 住房年支出轨迹
  - 医疗年支出轨迹
- 实现逐年离散求和的现值计算
- 产出：
  - `annualHousingCost`
  - `longevityAdjustedTarget`
  - `longevityAdjustmentDelta`

完成标准：

- 所有计算层测试转绿
- 不改变现有主结果口径

## 任务 4：结果区新增长期校正参考卡片

文件范围：

- `src/components/ResultPanel.tsx`
- `src/styles.css`

工作内容：

- 在结果区中部新增卡片
- 展示：
  - 长期校正参考资产
  - 与主结果差额
  - 固定说明文案

完成标准：

- 卡片文案清晰
- 桌面与移动端布局都正常

## 任务 5：补 UI 级测试

文件范围：

- `src/App.test.tsx`

工作内容：

- 新增一条页面测试，验证带退休年限与无房条件时，页面会显示“长期校正参考”及差额

完成标准：

- 测试先失败，再因实现转绿

## 任务 6：验证与提交

验证命令：

```bash
npm test
npm run build
```

完成标准：

- 全量测试通过
- 构建通过
- 完成后创建一次提交

## 审查范围

- `src/core/types.ts`
- `src/core/calculator.ts`
- `src/core/calculator.test.ts`
- `src/components/ResultPanel.tsx`
- `src/styles.css`
- `src/App.test.tsx`
