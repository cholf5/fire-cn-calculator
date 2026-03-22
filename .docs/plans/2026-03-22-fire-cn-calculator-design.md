# FIRE CN Calculator 首版设计

日期：2026-03-22

## 1. 目标与范围

首版目标是交付一个面向中国生活成本结构的单页 FIRE 估算工具，覆盖最小 MVP 范围：输入区、实时计算、结果展示、场景预设、风险标签、免责声明，以及 `localStorage` 持久化。首版明确不做 URL 参数同步，不做深色模式，也不引入多页面、后端或外部图表库。

首版的定位不是做完整退休现金流模拟器，而是做一个“比 4% rule 更贴近中国语境，但仍然简单可解释”的估算器。因此模型必须可读、可测、可维护，避免过早引入多年期模拟、复杂租金轨迹或资产配置假设。

## 2. 架构设计

技术栈采用 React + Vite + TypeScript。应用结构保持单页，页面分为顶部标题区、中部主内容区、底部免责声明区。主内容区桌面端左右分栏，左侧为输入面板，右侧为结果面板；移动端改为结果优先、输入在下的上下布局。

核心状态集中在 `useFireCalc` Hook 中管理。Hook 负责：

- 维护完整表单状态
- 应用预设
- 调用纯计算函数生成派生结果
- 与 `localStorage` 同步

计算逻辑集中在 `src/core/calculator.ts`，只暴露纯函数，不依赖 React 或浏览器对象。配置采用本地静态模块，例如 `src/config/defaults.ts` 与 `src/config/presets.ts`，避免过早引入远程配置和运行时加载复杂度。

建议的首版目录：

```text
src/
  components/
    Header.tsx
    InputPanel.tsx
    PresetSelector.tsx
    BasicInputs.tsx
    AdvancedInputs.tsx
    ResultPanel.tsx
    Disclaimer.tsx
  config/
    defaults.ts
    presets.ts
  core/
    calculator.ts
    types.ts
  hooks/
    useFireCalc.ts
  utils/
    storage.ts
  App.tsx
  main.tsx
```

## 3. 数据模型

首版表单状态建议定义为一个显式的 `FireFormValues` 类型，避免在组件间散落匿名对象。建议字段如下：

```ts
type CityTier = "tier1" | "tier2" | "tier34";

interface FireFormValues {
  monthlyBaseExpense: number;
  cityTier: CityTier;
  hasHouse: boolean;
  returnRate: number;
  inflationRate: number;
  swr: number;
  medicalExpenseRatio: number;
  rentGrowthRate: number;
  retirementYears: number;
}
```

其中 `monthlyBaseExpense` 的业务定义已经确认：表示“不含住房的基础月支出”。这一定义是首版口径的关键，否则“无房补住房成本”会与用户输入重复计算。

`rentGrowthRate` 与 `retirementYears` 在首版中保留字段与 UI，但不进入主计算结果，仅作为后续扩展入口。

## 4. 预设设计

首版提供三个预设：

- 节制模式
- 舒适模式
- 轻奢模式

预设点击后直接覆盖整套表单值，并立即触发重算。用户在应用预设后继续修改任意字段时，不再追踪“当前属于哪个预设”，因为这类派生状态对首版没有真实业务价值，只会增加状态同步复杂度。

预设建议放在 `presets.ts` 中，以结构化对象维护，便于测试和后续扩展。例如：

```ts
const presets = {
  frugal: { ... },
  comfortable: { ... },
  premium: { ... },
};
```

## 5. 计算规则

首版采用简单、透明、可解释的规则，不做多年期资产路径模拟。

### 5.1 年支出计算

1. 读取基础月支出 `monthlyBaseExpense`
2. 根据 `hasHouse` 与 `cityTier` 计算住房月成本
3. 形成月总支出
4. 乘以 12 得到基础年支出
5. 依据 `medicalExpenseRatio` 对基础年支出做额外上浮
6. 得到最终年支出

城市等级与住房比例映射如下：

- 一线：40%
- 二线：30%
- 三四线：20%

规则定义：

- 有房：住房月成本 = 0
- 无房：住房月成本 = `monthlyBaseExpense * housingRatio`

医疗修正规则：

- 医疗年支出增量 = `基础年支出 * medicalExpenseRatio`
- 最终年支出 = `基础年支出 + 医疗年支出增量`

### 5.2 FIRE 目标资产

```ts
fireTarget = annualExpense / swr
```

这里 `swr` 在计算中使用小数形式，例如 4% 对应 `0.04`。

### 5.3 实际收益率

```ts
realReturn = (1 + returnRate) / (1 + inflationRate) - 1
```

实际收益率仅作为提示信息展示，不反向影响主结果。这样可以保持模型简单，避免把“提示变量”和“主公式变量”混在一起。

### 5.4 资产区间参考

首版资产区间采用固定带宽：

- 低值：`fireTarget * 0.8`
- 推荐值：`fireTarget`
- 高值：`fireTarget * 1.2`

这只是用于表达估算弹性，不是统计置信区间，也不应包装成精确预测。

## 6. 风险等级与提示

安全等级按 SWR 直接映射：

- `swr > 0.04`：风险较高
- `0.03 < swr <= 0.04`：相对安全
- `swr <= 0.03`：较保守

风险提示文案不做复杂规则引擎，首版采用“固定模板 + 当前输入条件挑选”的方式，展示 2 到 3 条。例如：

- 投资收益存在波动
- 医疗支出可能高于预期
- 通胀可能侵蚀购买力
- 无房状态下租住成本可能继续上升

其中最后一条可在 `hasHouse = false` 时优先显示。

## 7. 输入交互设计

输入区拆为三个组件：

- `PresetSelector`
- `BasicInputs`
- `AdvancedInputs`

基础输入包括：

- 月支出
- 城市等级
- 是否有房
- 投资收益率
- 通胀率
- 提取率 SWR

高级输入默认折叠，包括：

- 医疗支出占比
- 租金增长率
- 退休年限

首版所有数值输入统一采用“滑杆 + 数字输入框”联动方式。组件负责最小值、最大值、步进与格式化；业务公式不写在组件内部。这样可以把视觉控件与业务计算解耦，减少后续修改成本。

## 8. 结果展示设计

结果区以一个大数字突出 `FIRE 所需资产`，这是页面最高优先级信息。其下展示：

- 年支出
- 提取率
- 实际收益率

安全等级以标签形式展示。资产区间使用简单文本和原生 `div` 条形块实现，不引入图表库。首版视觉重点是清晰，而不是复杂图形表达。

移动端布局中，结果区优先于输入区，以便用户打开页面后先看到核心结果，再向下调整参数。

## 9. 持久化与恢复

首版只做 `localStorage` 持久化，不做 URL 参数同步。

建议行为：

- 应用启动时先读取默认值
- 再尝试读取 `localStorage`
- 若读取成功且结构合法，则覆盖默认值
- 若读取失败、解析失败或字段不完整，则静默回退默认值

建议使用固定 key，例如：

```ts
const STORAGE_KEY = "fire-cn-calculator:form";
```

持久化对象只保存表单输入，不保存派生计算结果，避免冗余和一致性问题。

## 10. 错误处理策略

首版不引入复杂表单库或错误提示系统，但要保证输入过程可恢复、不中断。

基本策略：

- 空值不直接进入计算核心
- 非法数字回退为最近合法值或默认值
- 超出范围自动夹紧
- `localStorage` 读取异常时静默降级

页面不使用弹窗式错误提示，避免工具型产品被打断。对于“预留扩展”字段，应在 UI 上明确其当前不影响主结果，避免误导。

## 11. 测试策略

首版测试重点放在核心业务口径，而不是 UI 快照。

至少覆盖以下场景：

- 预设应用后，输出结果与配置一致
- 无房时，住房成本按城市比例正确追加
- 有房时，住房成本为 0
- 医疗支出占比会推高年支出与 FIRE 目标
- 实际收益率公式结果正确
- SWR 安全等级映射正确
- `localStorage` 初始化成功时能恢复输入
- `localStorage` 数据损坏时能安全回退默认值

如果首版引入组件测试，则只覆盖高价值交互，例如预设点击后结果立即更新、高级设置展开收起，不做大面积样式快照。

## 12. 非目标

以下内容明确不属于首版：

- URL 参数同步
- 深色模式
- 多页面
- 登录与用户系统
- 后端接口
- 图表库
- 多年现金流模拟
- 资产配置建议
- 投资建议性质的结论

## 13. 实施建议

推荐的实现顺序：

1. 初始化 Vite + React + TypeScript 项目骨架
2. 建立类型、默认值、预设配置
3. 实现 `calculator.ts` 纯函数与对应单元测试
4. 实现 `useFireCalc`，接入状态与 `localStorage`
5. 搭建输入区组件
6. 搭建结果区组件
7. 完成响应式布局与免责声明
8. 补齐交互与回归测试

这个顺序的核心是先锁定业务正确性，再做 UI 装配，避免后期在组件里回填公式。
