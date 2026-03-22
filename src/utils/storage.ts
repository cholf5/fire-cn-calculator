import { defaultFormValues } from "../config/defaults";
import { sanitizeFormValues } from "../core/calculator";
import type { FireFormValues } from "../core/types";

export const FIRE_STORAGE_KEY = "fire-cn-calculator:form";

export function loadStoredFormValues(): FireFormValues {
  const raw = window.localStorage.getItem(FIRE_STORAGE_KEY);

  if (!raw) {
    return { ...defaultFormValues };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FireFormValues>;

    return sanitizeFormValues({
      ...defaultFormValues,
      ...parsed,
    });
  } catch {
    return { ...defaultFormValues };
  }
}

export function saveFormValues(values: FireFormValues): void {
  window.localStorage.setItem(
    FIRE_STORAGE_KEY,
    JSON.stringify(sanitizeFormValues(values)),
  );
}
