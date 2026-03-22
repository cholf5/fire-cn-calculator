# 一、项目名称

**FIRE CN Calculator（fire-cn-calculator）**
副标题：A China-aware FIRE calculator

---

# 二、产品目标

构建一个**面向中国生活成本结构的 FIRE 计算工具**，支持：

* 本土化支出模型（城市/房产/医疗）
* 可调参数（收益率、通胀）
* 多场景（节制 / 舒适 / 轻奢）
* 简单但比 4% rule 更真实

---

# 三、目标用户

* 有一定储蓄/投资意识的中国用户
* 技术人群（理解参数）
* 考虑“低成本城市生活”的人

---

# 四、核心功能

## 4.1 输入模块（Input）

### 基础输入（必备）

| 参数       | 类型      | 默认值  | 说明        |
| -------- | ------- | ---- | --------- |
| 月支出      | number  | 8000 | 支持手动输入    |
| 城市等级     | enum    | 二线   | 一线/二线/三四线 |
| 是否有房     | boolean | true | 影响住房支出    |
| 投资收益率    | number  | 3%   | 可调        |
| 通胀率      | number  | 3%   | 可调        |
| 提取率（SWR） | number  | 4%   | 可调        |

---

### 高级输入（折叠）

| 参数     | 默认值 | 说明     |
| ------ | --- | ------ |
| 医疗支出占比 | 10% | 可调整    |
| 租金增长率  | 3%  | 无房时生效  |
| 退休年限   | 40年 | 用于扩展计算 |

---

## 4.2 场景预设（Preset）

提供三个按钮，一键填充参数：

### 1）节制模式

* 月支出：5000
* 城市：三四线
* 有房：是

### 2）舒适模式（默认）

* 月支出：10000
* 城市：二线
* 有房：是

### 3）轻奢模式

* 月支出：18000
* 城市：二线
* 有房：否

---

## 4.3 计算模块（Core Logic）

### 基础公式

```
年支出 = 月支出 × 12

FIRE资产 = 年支出 ÷ 提取率
```

---

### 通胀修正（简化版）

```
实际收益率 = (1 + 投资收益率) / (1 + 通胀率) - 1
```

用于提示，不强制改变主结果（避免复杂）

---

### 房产影响

```
如果 有房：
    住房成本 = 0
否则：
    住房成本 = 月支出 × 30%（可调）
```

---

### 输出结果（必须）

1. FIRE 目标资产（核心）
2. 年支出
3. 安全等级提示（根据 SWR）

---

### 输出结果（增强）

* 资产区间（±20%）
* 实际收益率提示
* 风险提示标签

---

## 4.4 输出模块（UI）

### 主结果区

* 大数字：FIRE 所需资产（例如：¥3,200,000）
* 副信息：

  * 年支出
  * 提取率
  * 实际收益率

---

### 风险提示（标签形式）

* SWR > 4% → “风险较高”
* SWR ≤ 4% → “相对安全”
* SWR ≤ 3% → “较保守”

---

### 可视化（可选但建议）

简单条形或区间：

```
最低安全值 | 推荐值 | 宽松值
```

---

# 五、免责声明（必须）

放在页面底部：

内容要点：

* 仅为估算工具，不构成投资建议
* 不考虑极端风险（医疗、政策等）
* 投资收益存在不确定性

---

# 六、技术方案

## 6.1 技术栈

* React
* Vite
* TypeScript（建议加）
* 无后端
* 静态 JSON 配置

---

## 6.2 项目结构

```
src/
  components/
    InputPanel.tsx
    ResultPanel.tsx
    PresetSelector.tsx
  core/
    calculator.ts
  config/
    presets.json
    defaults.json
  hooks/
    useFireCalc.ts
```

---

## 6.3 核心函数（示意）

```ts
interface Input {
  monthlyExpense: number;
  swr: number;
  returnRate: number;
  inflation: number;
  hasHouse: boolean;
}

export function calculateFire(input: Input) {
  const annualExpense = input.monthlyExpense * 12;

  const fireNumber = annualExpense / input.swr;

  const realReturn =
    (1 + input.returnRate) / (1 + input.inflation) - 1;

  return {
    annualExpense,
    fireNumber,
    realReturn,
  };
}
```

---

# 七、UI 要求

## 布局

* 左：输入区
* 右：结果区（实时更新）

---

## 交互

* 所有输入实时计算（无按钮）
* 滑杆优先（比输入框体验好）

---

## 风格

* 极简（类似工具站）
* 不需要复杂设计
* 移动端可用（必须）

---

# 八、发布与分发

## 部署

* GitHub Pages
* 自定义域名（可选）

---

## 开源

* MIT License

---

## README 要点

* 项目简介
* 使用截图
* 核心公式说明
* Disclaimer

---

# 九、扩展功能（必做）

1. Monte Carlo 模拟（成功率）
2. 多人家庭模型
3. 提前退休 vs 半退休（Barista FIRE）
4. 数据持久化（localStorage）
5. 分享链接（参数 encode 到 URL）

---

# 十、验收标准（给 Codex）

必须满足：

* 输入变化 → 实时更新结果
* 三个 preset 正常工作
* 计算逻辑无明显错误
* 页面可部署到 Pages
* 移动端不崩
