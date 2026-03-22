import { defaultFormValues } from "../config/defaults";
import { sanitizeFormValues } from "../core/calculator";
import type { FireFormValues } from "../core/types";

type UrlParamKey = "m" | "c" | "h" | "r" | "i" | "s" | "med";

const urlFieldMap: Record<UrlParamKey, keyof FireFormValues> = {
  m: "monthlyBaseExpense",
  c: "cityTier",
  h: "hasHouse",
  r: "returnRate",
  i: "inflationRate",
  s: "swr",
  med: "medicalExpenseRatio",
};

function parseBoolean(rawValue: string | null): boolean | undefined {
  if (rawValue === "1") {
    return true;
  }
  if (rawValue === "0") {
    return false;
  }

  return undefined;
}

function parseNumber(rawValue: string | null): number | undefined {
  if (rawValue === null) {
    return undefined;
  }

  const parsed = Number(rawValue);

  return Number.isNaN(parsed) ? undefined : parsed;
}

export function loadUrlFormValues(): Partial<FireFormValues> | null {
  const params = new URLSearchParams(window.location.search);
  const partial: Partial<FireFormValues> = {};
  let hasRecognizedParam = false;

  (Object.keys(urlFieldMap) as UrlParamKey[]).forEach((key) => {
    const rawValue = params.get(key);

    if (rawValue === null) {
      return;
    }

    hasRecognizedParam = true;

    if (key === "h") {
      partial.hasHouse = parseBoolean(rawValue);
      return;
    }

    if (key === "c") {
      partial.cityTier = rawValue as FireFormValues["cityTier"];
      return;
    }

    partial[urlFieldMap[key]] = parseNumber(rawValue) as never;
  });

  if (!hasRecognizedParam) {
    return null;
  }

  return sanitizeFormValues({
    ...defaultFormValues,
    ...partial,
  });
}

function shouldSerializeField<K extends keyof FireFormValues>(
  key: K,
  values: FireFormValues,
): boolean {
  return values[key] !== defaultFormValues[key];
}

export function buildSearchParams(values: FireFormValues): string {
  const params = new URLSearchParams();

  if (shouldSerializeField("monthlyBaseExpense", values)) {
    params.set("m", String(values.monthlyBaseExpense));
  }

  if (shouldSerializeField("cityTier", values)) {
    params.set("c", values.cityTier);
  }

  if (shouldSerializeField("hasHouse", values)) {
    params.set("h", values.hasHouse ? "1" : "0");
  }

  if (shouldSerializeField("returnRate", values)) {
    params.set("r", String(values.returnRate));
  }

  if (shouldSerializeField("inflationRate", values)) {
    params.set("i", String(values.inflationRate));
  }

  if (shouldSerializeField("swr", values)) {
    params.set("s", String(values.swr));
  }

  if (shouldSerializeField("medicalExpenseRatio", values)) {
    params.set("med", String(values.medicalExpenseRatio));
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export function replaceUrlState(values: FireFormValues): void {
  const nextSearch = buildSearchParams(values);

  if (window.location.search === nextSearch) {
    return;
  }

  const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
  window.history.replaceState({}, "", nextUrl);
}
