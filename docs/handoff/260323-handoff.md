## 1. 当前任务目标
当前项目是一个已上线的中文单页工具，正式产品名为 `FIRE 财务自由测算器`。主目标已经从“搭 MVP”转为“持续打磨产品体验与可理解性”，重点不是再补基础功能，而是继续优化结果解释、输入理解、分享体验和整体 UI。

当前这轮结束时，最新完成的具体任务是：把所有参数说明统一改成“参数名右侧信息按钮，点击后弹出 tips”的交互。下一位接手的目标应是基于当前稳定版本，继续推进剩余的体验优化或新需求，并保持现有产品口径不被破坏。

完成标准：
- 新改动不破坏现有计算逻辑、URL 同步、主题切换、分享能力和测试。
- 所有对用户可见的文案仍使用当前产品心智：`推荐准备资产 / 基础估算 / 长期覆盖建议`。
- 每轮实现后都需要跑 `npm test` 和 `npm run build`，并按用户要求提交 git commit。

## 2. 当前进展
已经完成的主要工作：
- 从 PRD/UI 文档出发完成了整个单页应用开发，技术栈为 `React + Vite + TypeScript`。
- 已实现基础输入、高级输入、预设、结果面板、风险提示、免责声明、localStorage、URL 参数同步、GitHub Pages 自动部署。
- 已将早期“两个结果并列打架”的结果表达改成当前结构：
  - 主结论：`推荐准备资产`
  - 次级口径：`基础估算`
  - 次级口径：`长期覆盖建议`
- 已实现长期校正模型：`退休年限 + 租金增长率 + 通胀 + 投资收益率` 会影响长期覆盖建议。
- 已实现多个分享动作：
  - 复制分享链接
  - 复制当前结果摘要
  - 复制分享卡片图片
- 已实现浅色 / 深色 / 跟随系统主题切换。
- 已完成结果区的轻量可视化手搓方案：
  - 目标对比条
  - 年支出构成堆叠条
- 已修正风险评估相关问题：
  - 安全等级不再只看 SWR，`realReturn <= 0` 时不会再显示“相对安全”
  - `fallbackHighlights` 已从风险提示中移除，泛化提醒改挪到免责声明区域的“长期提醒”
- 最新完成：所有参数都加了可点击的信息按钮，替代原先行内灰字说明。

近期关键提交：
- `5320d92` `style: balance disclaimer footer layout`
- `c4f9bf1` `feat: add parameter info tips`

## 3. 关键上下文
重要背景信息：
- 面向中文用户，但用户认可保留 `FIRE` 术语，因此正式名称定为 `FIRE 财务自由测算器`。
- 这是前端纯静态工具，没有后端。
- 项目已成功部署到 GitHub Pages，可正常访问。

用户的明确要求：
- 每次执行一轮实现并验证通过后，都要提交代码。
- 不要用英文内部名继续面对用户，当前所有用户可见入口都应使用中文产品名。
- 风险提示必须只展示真正由参数触发的动态风险，不能再混入“标语式” fallback 提醒。
- 参数说明应以 `参数名右侧小按钮，点击弹出 tips` 的方式呈现，不用 hover-only 方案。

已知约束：
- 修改代码时遵循仓库内现有模式，优先在 Hook / 纯函数层集中逻辑，不把业务判断散到 UI。
- 手动代码编辑必须使用 `apply_patch`。
- 当前仓库 `.git` 写入在沙箱下会失败；提交时需要提权执行 `git commit`。
- 不要轻易改动技术标识，例如 repo 名、Pages base path、localStorage key，除非用户明确要求。

已做出的关键决定：
- URL 参数优先级：`URL > localStorage > defaults`
- URL 只同步真正影响主结果的字段；已扩展支持 `rg`、`ry`
- 深色模式策略：`用户手动选择 > 跟随系统 > 默认浅色`
- 结果表达策略：
  - 主数字永远只给一个：`推荐准备资产`
  - 主数字取 `max(基础估算, 长期覆盖建议)`
  - 不再出现“与主结果差额”这类系统视角文案
- 可视化策略：当前需求下不引入重图表库，继续使用 `div + CSS` 手搓解释型可视化

重要假设：
- 用户更关心“这个数为什么是这样”，而不是看完整参数面板，因此分享卡片与结果区都优先解释型表达。
- 当前产品已过功能空白期，后续新增需求应优先提升可理解性和产品完成度。

## 4. 关键发现
- 早期 `安全等级` 只看 `SWR` 的设计会误导，已经修正。后续任何风险评估调整都要同时考虑 `realReturn` 和模型上下文，不能再退回单变量规则。
- `fallbackHighlights` 和动态风险本质不是一类信息，混在一起会误导用户。现在的设计是正确的：
  - 风险区只显示命中条件的动态风险
  - “长期提醒”常驻放在免责声明区域
- `长期覆盖建议` 与 `基础估算` 平级展示会困惑用户，所以现在采用“一个主答案 + 两个辅助口径”的结构。不要轻易改回双主结果。
- 分享卡片最早信息量过低，后来已补充关键参数与结果拆解。当前卡片逻辑在 `src/utils/shareCard.ts`，再改时要注意布局边界，右下角文案曾出现过溢出问题，已修。
- 旧的行内 `field-hint` 已经整体移除；参数解释现在应只维护在 tips 里，避免一套信息有两份源头。
- `租金增长率` 和 `退休年限` 已经真实参与长期覆盖建议计算，任何说明文案都不能再写“预留扩展”“当前不影响主结果”。

## 5. 未完成事项
按优先级排序：

1. 继续做 UI / 交互精修
- 当前功能基本齐了，但仍可能有视觉层级、移动端细节、分享卡片细节、主题细节的打磨空间。

2. 检查参数 tips 的实际体验
- 最新实现只经过测试和构建验证，尚未记录人工验收结果。
- 建议实际在桌面和移动端看一遍 tips 弹层位置、遮挡、关闭手势是否自然。

3. 视用户反馈继续优化结果区
- 当前结果区已经比早期清楚，但仍可能继续微调信息密度和层级。

4. 如用户继续要新功能，可优先从“解释型增强”而不是“新模型复杂化”入手
- 例如分享卡片、结果摘要、说明文案、输入引导等。

## 6. 建议接手路径
优先查看的文件：
- [src/core/calculator.ts](/mnt/d/dev/cholf5/fire-cn-calculator/src/core/calculator.ts)
  - 核心计算、风险提示、安全等级、长期覆盖建议都在这里
- [src/hooks/useFireCalc.ts](/mnt/d/dev/cholf5/fire-cn-calculator/src/hooks/useFireCalc.ts)
  - 表单状态、localStorage、URL 同步的总入口
- [src/utils/urlState.ts](/mnt/d/dev/cholf5/fire-cn-calculator/src/utils/urlState.ts)
  - URL 参数协议与读写
- [src/components/ResultPanel.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/ResultPanel.tsx)
  - 主结果、对比条、支出构成、分享动作
- [src/utils/shareCard.ts](/mnt/d/dev/cholf5/fire-cn-calculator/src/utils/shareCard.ts)
  - 分享卡片生成逻辑，后续任何卡片改动都应先看这里
- [src/components/BasicInputs.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/BasicInputs.tsx)
- [src/components/AdvancedInputs.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/AdvancedInputs.tsx)
- [src/components/InfoTip.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/InfoTip.tsx)
- [src/styles.css](/mnt/d/dev/cholf5/fire-cn-calculator/src/styles.css)
- [src/App.test.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/App.test.tsx)

建议先验证的内容：
- 本地运行：
  - `npm test`
  - `npm run build`
- 人工验证页面：
  - 点击所有参数右侧 tips 按钮，确认桌面/移动端无遮挡、可关闭、文案正确
  - 检查结果区在浅色/深色下的对比度
  - 检查分享卡片复制后的最终效果

推荐下一步动作：
- 如果没有新的明确功能需求，先做一轮人工体验验收，重点看：
  - 参数 tips 交互是否需要进一步 polish
  - 结果区视觉是否还有可压缩空间
  - 分享卡片是否还需要微调排版
- 如果用户直接提出新需求，先判断它是否会破坏当前“单主结论”产品结构；如果会，先讨论，不要直接改。

## 7. 风险与注意事项
- 不要把 `基础估算` 和 `长期覆盖建议` 再做成两个平级最终答案；这个方向已经验证过，会让用户困惑。
- 不要把 `fallbackHighlights` 一类的泛化提醒重新塞回风险提示区域；已经证明会误导用户。
- 不要继续维护旧的 `field-hint` 文字体系；现在参数说明的单一真相源应是 `FieldLabel + InfoTip`。
- 提交 git 时要注意沙箱限制，普通 `git commit` 可能失败，需要按当前环境提权执行。
- 分享卡片的绘制边界很容易出问题，尤其是右下角或宽文本；任何文案扩充后都应重新人工检查卡片实际导出效果。
- 当前测试覆盖较全，但仍偏行为级验证，不代表视觉完全正确；涉及 UI 调整时最好做人工验收。
- 不建议现在引入图表库。当前产品仍属于“解释单次计算结果”，现有手搓可视化足够。除非用户明确需要时间序列、多图表、tooltip/axis 体系，否则不要贸然上 `Recharts`。

下一位 Agent 的第一步建议：
先运行 `npm test` 和 `npm run build` 确认环境无漂移，然后打开 [src/components/InfoTip.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/InfoTip.tsx)、[src/components/BasicInputs.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/BasicInputs.tsx)、[src/components/AdvancedInputs.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/AdvancedInputs.tsx) 和 [src/components/ResultPanel.tsx](/mnt/d/dev/cholf5/fire-cn-calculator/src/components/ResultPanel.tsx) 快速建立当前 UI 心智，再决定是做体验打磨还是承接新的功能需求。
