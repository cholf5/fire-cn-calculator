export function formatCurrency(value: number): string {
  return `¥ ${Math.round(value).toLocaleString("en-US")}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}
