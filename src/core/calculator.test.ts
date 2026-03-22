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

  test("风险提示会根据实际收益率、SWR 和无房状态动态变化", () => {
    const values = {
      ...getDefaultFormValues(),
      hasHouse: false,
      returnRate: 0.02,
      inflationRate: 0.03,
      swr: 0.05,
    };

    const result = calculateFire(values);

    expect(result.riskHighlights).toEqual([
      "实际收益率为负，长期购买力可能下滑",
      "当前提取率偏高，回撤期容错更低",
      "无房状态下租住成本可能继续上升",
    ]);
  });

  test("有房时住房年成本为 0，长期校正参考可正常计算", () => {
    const values = {
      ...getDefaultFormValues(),
      hasHouse: true,
      retirementYears: 40,
    };

    const result = calculateFire(values);

    expect(result.annualHousingCost).toBe(0);
    expect(result.longevityAdjustedTarget).toBeGreaterThan(0);
  });

  test("无房时更高的租金增长率会抬高长期校正参考", () => {
    const baseValues = {
      ...getDefaultFormValues(),
      hasHouse: false,
      cityTier: "tier1" as const,
      retirementYears: 40,
    };

    const lowGrowth = calculateFire({
      ...baseValues,
      rentGrowthRate: 0.01,
    });
    const highGrowth = calculateFire({
      ...baseValues,
      rentGrowthRate: 0.06,
    });

    expect(highGrowth.longevityAdjustedTarget).toBeGreaterThan(lowGrowth.longevityAdjustedTarget);
  });

  test("退休年限增加时长期校正参考会上升", () => {
    const baseValues = {
      ...getDefaultFormValues(),
      hasHouse: false,
    };

    const shorter = calculateFire({
      ...baseValues,
      retirementYears: 20,
    });
    const longer = calculateFire({
      ...baseValues,
      retirementYears: 40,
    });

    expect(longer.longevityAdjustedTarget).toBeGreaterThan(shorter.longevityAdjustedTarget);
  });

  test("当收益率低于支出增长时仍返回稳定的长期校正参考", () => {
    const result = calculateFire({
      ...getDefaultFormValues(),
      hasHouse: false,
      returnRate: 0.01,
      inflationRate: 0.03,
      rentGrowthRate: 0.05,
      retirementYears: 35,
    });

    expect(Number.isFinite(result.longevityAdjustedTarget)).toBe(true);
    expect(result.longevityAdjustedTarget).toBeGreaterThan(result.fireTarget);
  });
});
