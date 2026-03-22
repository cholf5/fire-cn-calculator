# FIRE 财务自由测算器

一个更贴近中国生活结构的 FIRE 计算器。当前版本为纯前端单页应用，支持：

- 实时计算 FIRE 目标资产
- 节制 / 舒适 / 轻奢预设
- 中国城市等级与住房成本修正
- 医疗支出占比修正
- `localStorage` 持久化
- URL 参数同步与分享链接复制

## 技术栈

- React
- Vite
- TypeScript
- Vitest

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

运行测试：

```bash
npm test
```

本地生产构建：

```bash
npm run build
```

## GitHub Pages 发布

仓库已包含 GitHub Pages 工作流：

- 工作流文件：`.github/workflows/deploy-pages.yml`
- Pages 构建命令：`npm run build:pages`
- 目标基础路径：`/fire-cn-calculator/`

首次启用时需要在 GitHub 仓库中确认：

1. 打开 `Settings > Pages`
2. 将来源设置为 `GitHub Actions`
3. 推送到 `main` 后等待工作流完成

如果发布成功，默认访问地址通常是：

```text
https://cholf5.github.io/fire-cn-calculator/
```

## URL 参数协议

当前支持的分享参数如下：

- `m`: 基础月支出
- `c`: 城市等级，取值 `tier1` / `tier2` / `tier34`
- `h`: 是否有房，`1` 为是，`0` 为否
- `r`: 投资收益率
- `i`: 通胀率
- `s`: SWR
- `med`: 医疗支出占比

示例：

```text
?m=12000&c=tier1&h=0&s=0.04&med=0.12
```

## 线上验收清单

发布后建议至少检查以下内容：

1. 页面能在 GitHub Pages 地址正常打开，没有静态资源 404
2. 首屏桌面端布局为结果区 + 输入区双栏
3. 移动端布局结果区优先显示
4. 修改输入后结果会实时更新
5. 刷新页面后输入值能从 `localStorage` 恢复
6. 打开带参数链接时，URL 参数会覆盖本地缓存
7. 点击“复制分享链接”后能复制完整绝对链接
8. 将复制出的链接发到无缓存环境中，结果一致

## 当前限制

当前版本暂未实现：

- 深色模式
- URL 可视化分享管理
- 后端服务
- 复杂退休现金流模拟
- 自定义域名说明
