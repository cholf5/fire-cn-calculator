import { useEffect, useState } from "react";
import { defaultFormValues } from "../config/defaults";
import { presets, type PresetKey } from "../config/presets";
import { calculateFire, sanitizeFormValues } from "../core/calculator";
import type { FireFormValues } from "../core/types";
import { loadStoredFormValues, saveFormValues } from "../utils/storage";
import { loadUrlFormValues, replaceUrlState } from "../utils/urlState";

export function useFireCalc() {
  const [values, setValues] = useState<FireFormValues>(() => {
    const urlValues = loadUrlFormValues();

    if (urlValues) {
      return sanitizeFormValues(urlValues);
    }

    return loadStoredFormValues();
  });

  useEffect(() => {
    saveFormValues(values);
    replaceUrlState(values);
  }, [values]);

  const result = calculateFire(values);
  const activePresetKey =
    presets.find((preset) =>
      Object.entries(preset.values).every(([key, value]) => values[key as keyof FireFormValues] === value),
    )?.key ?? null;

  function updateValue<K extends keyof FireFormValues>(
    key: K,
    nextValue: FireFormValues[K],
  ) {
    setValues((current) => ({
      ...sanitizeFormValues({
        ...current,
        [key]: nextValue,
      }),
    }));
  }

  function applyPreset(key: PresetKey) {
    const preset = presets.find((item) => item.key === key);

    if (!preset) {
      return;
    }

    setValues({ ...preset.values });
  }

  function resetToDefaults() {
    setValues({ ...defaultFormValues });
  }

  return {
    values,
    result,
    activePresetKey,
    updateValue,
    applyPreset,
    resetToDefaults,
  };
}
