# CODE_MAP - 核心入口索引

给 AI 的快速定位索引。只记录功能入口文件，从入口可追踪到实现。

---

## App Shell

- **应用入口**: `src/main.tsx`
- **页面装配入口**: `src/App.tsx`

---

## 输入面板

- **输入区入口**: `src/components/InputPanel.tsx`
- **基础输入**: `src/components/BasicInputs.tsx`
- **高级输入**: `src/components/AdvancedInputs.tsx`
- **预设选择器**: `src/components/PresetSelector.tsx`

---

## 结果展示

- **结果区入口**: `src/components/ResultPanel.tsx`
- **页面头部**: `src/components/Header.tsx`
- **免责声明**: `src/components/Disclaimer.tsx`

---

## 状态与计算

- **状态管理入口**: `src/hooks/useFireCalc.ts`
- **计算核心**: `src/core/calculator.ts`
- **核心类型**: `src/core/types.ts`
- **默认参数**: `src/config/defaults.ts`
- **预设配置**: `src/config/presets.ts`
- **本地存储**: `src/utils/storage.ts`
- **格式化工具**: `src/utils/format.ts`

---

## 测试入口

- **应用交互测试**: `src/App.test.tsx`
- **计算测试**: `src/core/calculator.test.ts`
- **存储测试**: `src/utils/storage.test.ts`

---
