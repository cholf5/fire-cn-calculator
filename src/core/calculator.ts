import { defaultFormValues } from "../config/defaults";
import type { CityTier, FireCalculationResult, FireFormValues } from "./types";

const housingRatios: Record<CityTier, number> = {
  tier1: 0.4,
  tier2: 0.3,
  tier34: 0.2,
};

export function getDefaultFormValues(): FireFormValues {
  return { ...defaultFormValues };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sanitizeNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return clamp(value, min, max);
}

export function sanitizeFormValues(values: Partial<FireFormValues>): FireFormValues {
  const cityTier: CityTier =
    values.cityTier === "tier1" || values.cityTier === "tier2" || values.cityTier === "tier34"
      ? values.cityTier
      : defaultFormValues.cityTier;

  return {
    monthlyBaseExpense: sanitizeNumber(
      values.monthlyBaseExpense,
      defaultFormValues.monthlyBaseExpense,
      2000,
      30000,
    ),
    cityTier,
    hasHouse:
      typeof values.hasHouse === "boolean"
        ? values.hasHouse
        : defaultFormValues.hasHouse,
    returnRate: sanitizeNumber(
      values.returnRate,
      defaultFormValues.returnRate,
      0,
      0.12,
    ),
    inflationRate: sanitizeNumber(
      values.inflationRate,
      defaultFormValues.inflationRate,
      0,
      0.08,
    ),
    swr: sanitizeNumber(values.swr, defaultFormValues.swr, 0.02, 0.06),
    medicalExpenseRatio: sanitizeNumber(
      values.medicalExpenseRatio,
      defaultFormValues.medicalExpenseRatio,
      0,
      0.3,
    ),
    rentGrowthRate: sanitizeNumber(
      values.rentGrowthRate,
      defaultFormValues.rentGrowthRate,
      0,
      0.1,
    ),
    retirementYears: sanitizeNumber(
      values.retirementYears,
      defaultFormValues.retirementYears,
      10,
      60,
    ),
  };
}

function getSafetyLabel(values: FireFormValues, realReturn: number): string {
  if (realReturn <= 0) {
    return "风险较高";
  }

  if (values.swr <= 0.03) {
    return "较保守";
  }
  if (values.swr <= 0.04) {
    return "相对安全";
  }
  return "风险较高";
}

function getRiskHighlights(values: FireFormValues): string[] {
  const highlights: string[] = [];
  const realReturn =
    (1 + values.returnRate) / (1 + values.inflationRate) - 1;

  if (realReturn <= 0) {
    highlights.push("实际收益率为负，长期购买力可能下滑");
  }

  if (values.swr > 0.04) {
    highlights.push("当前提取率偏高，回撤期容错更低");
  }

  if (!values.hasHouse) {
    highlights.push("无房状态下租住成本可能继续上升");
  }

  return highlights;
}

export function calculateFire(values: FireFormValues): FireCalculationResult {
  const housingRatio = values.hasHouse ? 0 : housingRatios[values.cityTier];
  const monthlyHousingCost = values.monthlyBaseExpense * housingRatio;
  const annualHousingCost = monthlyHousingCost * 12;
  const monthlyTotalExpense = values.monthlyBaseExpense + monthlyHousingCost;
  const baseAnnualExpense = monthlyTotalExpense * 12;
  const medicalAnnualExpense = baseAnnualExpense * values.medicalExpenseRatio;
  const annualExpense = baseAnnualExpense + medicalAnnualExpense;
  const fireTarget = annualExpense / values.swr;
  const realReturn =
    (1 + values.returnRate) / (1 + values.inflationRate) - 1;
  const inflationTrackedAnnualExpense = baseAnnualExpense + medicalAnnualExpense;
  let longevityAdjustedTarget = 0;

  for (let year = 1; year <= values.retirementYears; year += 1) {
    const inflationAdjustedExpense =
      inflationTrackedAnnualExpense * (1 + values.inflationRate) ** (year - 1);
    const housingAdjustedExpense =
      annualHousingCost * (1 + values.rentGrowthRate) ** (year - 1);
    const yearExpense = inflationAdjustedExpense + housingAdjustedExpense;
    const discountedExpense = yearExpense / (1 + values.returnRate) ** year;

    longevityAdjustedTarget += discountedExpense;
  }

  return {
    monthlyHousingCost,
    annualHousingCost,
    baseAnnualExpense,
    medicalAnnualExpense,
    annualExpense,
    fireTarget,
    longevityAdjustedTarget,
    longevityAdjustmentDelta: longevityAdjustedTarget - fireTarget,
    realReturn,
    safetyLabel: getSafetyLabel(values, realReturn),
    riskHighlights: getRiskHighlights(values),
    lowerBound: fireTarget * 0.8,
    upperBound: fireTarget * 1.2,
  };
}
