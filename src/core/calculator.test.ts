import { describe, expect, test } from "vitest";
import { calculateFire, getDefaultFormValues } from "./calculator";

describe("calculateFire", () => {
  test("无房时按城市等级追加住房成本并推高 FIRE 目标", () => {
    const values = {
      ...getDefaultFormValues(),
      monthlyBaseExpense: 10000,
      cityTier: "tier1" as const,
      hasHouse: false,
      medicalExpenseRatio: 0.1,
      swr: 0.04,
    };

    const result = calculateFire(values);

    expect(result.monthlyHousingCost).toBe(4000);
    expect(result.baseAnnualExpense).toBe(168000);
    expect(result.medicalAnnualExpense).toBe(16800);
    expect(result.annualExpense).toBe(184800);
    expect(result.fireTarget).toBe(4620000);
  });

  test("有房时住房成本为 0，且安全等级按 SWR 映射", () => {
    const values = {
      ...getDefaultFormValues(),
      monthlyBaseExpense: 8000,
      cityTier: "tier2" as const,
      hasHouse: true,
      medicalExpenseRatio: 0.1,
      swr: 0.03,
    };

    const result = calculateFire(values);

    expect(result.monthlyHousingCost).toBe(0);
    expect(result.safetyLabel).toBe("较保守");
    expect(result.riskHighlights).toContain("医疗支出可能高于预期");
  });

  test("通胀与收益率产生独立的实际收益率提示", () => {
    const values = {
      ...getDefaultFormValues(),
      returnRate: 0.05,
      inflationRate: 0.03,
    };

    const result = calculateFire(values);

    expect(result.realReturn).toBeCloseTo(0.019417, 6);
  });
});
