import type { FireFormValues } from "../core/types";

export type PresetKey = "frugal" | "comfortable" | "premium";

export interface PresetDefinition {
  key: PresetKey;
  label: string;
  values: FireFormValues;
}

export const presets: PresetDefinition[] = [
  {
    key: "frugal",
    label: "节制",
    values: {
      monthlyBaseExpense: 5000,
      cityTier: "tier34",
      hasHouse: true,
      returnRate: 0.03,
      inflationRate: 0.03,
      swr: 0.04,
      medicalExpenseRatio: 0.1,
      rentGrowthRate: 0.03,
      retirementYears: 40,
    },
  },
  {
    key: "comfortable",
    label: "舒适",
    values: {
      monthlyBaseExpense: 10000,
      cityTier: "tier2",
      hasHouse: true,
      returnRate: 0.03,
      inflationRate: 0.03,
      swr: 0.04,
      medicalExpenseRatio: 0.1,
      rentGrowthRate: 0.03,
      retirementYears: 40,
    },
  },
  {
    key: "premium",
    label: "轻奢",
    values: {
      monthlyBaseExpense: 18000,
      cityTier: "tier2",
      hasHouse: false,
      returnRate: 0.03,
      inflationRate: 0.03,
      swr: 0.04,
      medicalExpenseRatio: 0.1,
      rentGrowthRate: 0.03,
      retirementYears: 40,
    },
  },
];
