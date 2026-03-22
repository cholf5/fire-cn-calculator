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
