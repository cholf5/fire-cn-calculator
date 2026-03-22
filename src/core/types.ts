export type CityTier = "tier1" | "tier2" | "tier34";

export interface FireFormValues {
  monthlyBaseExpense: number;
  cityTier: CityTier;
  hasHouse: boolean;
  returnRate: number;
  inflationRate: number;
  swr: number;
  medicalExpenseRatio: number;
  rentGrowthRate: number;
  retirementYears: number;
}

export interface FireCalculationResult {
  monthlyHousingCost: number;
  baseAnnualExpense: number;
  medicalAnnualExpense: number;
  annualExpense: number;
  fireTarget: number;
  realReturn: number;
  safetyLabel: string;
  riskHighlights: string[];
  lowerBound: number;
  upperBound: number;
}
