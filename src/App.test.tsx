import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import App from "./App";

test("切换轻奢预设后会即时更新主结果", async () => {
  const user = userEvent.setup();

  render(<App />);

  expect(screen.getByText("¥ 3,300,000")).not.toBeNull();

  await user.click(screen.getByRole("button", { name: "轻奢" }));

  expect(screen.getByText("¥ 7,722,000")).not.toBeNull();
  expect(screen.getByText("风险提示")).not.toBeNull();
});

test("URL 参数会覆盖 localStorage 并反映到首屏结果", () => {
  window.localStorage.setItem(
    "fire-cn-calculator:form",
    JSON.stringify({
      monthlyBaseExpense: 6000,
      cityTier: "tier34",
      hasHouse: true,
      returnRate: 0.03,
      inflationRate: 0.03,
      swr: 0.04,
      medicalExpenseRatio: 0.1,
      rentGrowthRate: 0.03,
      retirementYears: 40,
    }),
  );
  window.history.replaceState({}, "", "/?m=12000&h=0&c=tier1");

  render(<App />);

  expect(screen.getByText("¥ 5,544,000")).not.toBeNull();
});

test("点击复制分享链接后会复制当前绝对链接并短暂显示已复制", async () => {
  vi.useFakeTimers();
  const writeText = vi.fn().mockResolvedValue(undefined);

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText,
    },
  });

  window.history.replaceState({}, "", "/?m=12000&h=0");

  render(<App />);

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "复制分享链接" }));
    await Promise.resolve();
  });

  expect(writeText).toHaveBeenCalledWith(window.location.href);
  expect(screen.getByRole("button", { name: "已复制" })).not.toBeNull();

  act(() => {
    vi.advanceTimersByTime(2000);
  });

  expect(screen.getByRole("button", { name: "复制分享链接" })).not.toBeNull();
  vi.useRealTimers();
});

test("点击重置默认值后会恢复默认结果并清空 URL 参数", async () => {
  const user = userEvent.setup();

  window.history.replaceState({}, "", "/?m=12000&h=0&c=tier1&med=0.12");

  render(<App />);

  expect(screen.getByText("¥ 5,644,800")).not.toBeNull();

  await user.click(screen.getByRole("button", { name: "重置默认值" }));

  expect(screen.getByText("¥ 3,300,000")).not.toBeNull();
  expect(window.location.search).toBe("");
});

test("预设只在完全匹配时高亮，手动改值后取消高亮", async () => {
  const user = userEvent.setup();

  render(<App />);

  expect(screen.getByRole("button", { name: "舒适" }).className).toContain("is-active");

  await user.click(screen.getByRole("button", { name: "轻奢" }));

  expect(screen.getByRole("button", { name: "轻奢" }).className).toContain("is-active");
  expect(screen.getByRole("button", { name: "舒适" }).className).not.toContain("is-active");

  await user.clear(screen.getByRole("spinbutton", { name: /月支出（不含住房）/ }));
  await user.type(screen.getByRole("spinbutton", { name: /月支出（不含住房）/ }), "17500");

  expect(screen.getByRole("button", { name: "轻奢" }).className).not.toContain("is-active");
  expect(screen.getByRole("button", { name: "舒适" }).className).not.toContain("is-active");
  expect(screen.getByRole("button", { name: "节制" }).className).not.toContain("is-active");
});

test("结果区会展示基础年支出、住房成本补充和医疗支出增量", () => {
  window.history.replaceState({}, "", "/?m=12000&h=0&c=tier1&med=0.12");

  render(<App />);

  expect(screen.getByText("基础年支出")).not.toBeNull();
  expect(screen.getByText("¥ 201,600")).not.toBeNull();
  expect(screen.getByText("住房成本补充")).not.toBeNull();
  expect(screen.getByText("¥ 57,600")).not.toBeNull();
  expect(screen.getByText("医疗支出增量")).not.toBeNull();
  expect(screen.getByText("¥ 24,192")).not.toBeNull();
});

test("关键输入字段会显示参数说明", async () => {
  const user = userEvent.setup();

  render(<App />);

  expect(screen.getByText("这里填不含住房的基础月支出。")).not.toBeNull();
  expect(screen.getByText("只在无房时影响住房补充比例。")).not.toBeNull();
  expect(screen.getByText("表示退休后每年的资产提取率。")).not.toBeNull();

  await user.click(screen.getByRole("button", { name: "▼ 高级设置" }));

  expect(screen.getByText("会按比例抬高年支出估算。")).not.toBeNull();
});

test("结果区会展示长期校正参考与差额", () => {
  window.history.replaceState({}, "", "/?m=12000&h=0&c=tier1&med=0.12&ry=40&rg=0.05");

  render(<App />);

  expect(screen.getByText("长期校正参考")).not.toBeNull();
  expect(screen.getByText("基于退休年限与未来支出增长估算")).not.toBeNull();
  expect(screen.getByText(/与主结果差额/)).not.toBeNull();
});

test("点击复制当前结果摘要后会复制包含主结果和长期参考的纯文本", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText,
    },
  });

  render(<App />);

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "复制当前结果摘要" }));
    await Promise.resolve();
  });

  const copiedText = writeText.mock.calls[0]?.[0] as string;

  expect(copiedText).toContain("FIRE 所需资产");
  expect(copiedText).toContain("长期校正参考");
  expect(copiedText).toContain("年支出");
  expect(copiedText).toContain("提取率");
  expect(copiedText).toContain("实际收益率");
  expect(copiedText).toContain("城市等级");
  expect(copiedText).toContain("是否有房");
});

test("手动切换主题后会更新根节点主题标记", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole("button", { name: "主题切换" }));
  await user.click(screen.getByRole("button", { name: "深色" }));

  expect(document.documentElement.dataset.theme).toBe("dark");
});
