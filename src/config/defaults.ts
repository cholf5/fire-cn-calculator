import type { FireFormValues } from "../core/types";

export const defaultFormValues: FireFormValues = {
  monthlyBaseExpense: 10000,
  cityTier: "tier2",
  hasHouse: true,
  returnRate: 0.03,
  inflationRate: 0.03,
  swr: 0.04,
  medicalExpenseRatio: 0.1,
  rentGrowthRate: 0.03,
  retirementYears: 40,
};
