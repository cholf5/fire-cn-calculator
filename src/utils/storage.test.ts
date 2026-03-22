import { describe, expect, test } from "vitest";
import {
  FIRE_STORAGE_KEY,
  loadStoredFormValues,
  saveFormValues,
} from "./storage";
import { getDefaultFormValues } from "../core/calculator";

describe("storage", () => {
  test("能从 localStorage 恢复完整表单值", () => {
    const values = {
      ...getDefaultFormValues(),
      monthlyBaseExpense: 12345,
      hasHouse: false,
    };

    saveFormValues(values);

    expect(loadStoredFormValues()).toEqual(values);
  });

  test("localStorage 数据损坏时回退默认值", () => {
    const defaults = getDefaultFormValues();
    window.localStorage.setItem(FIRE_STORAGE_KEY, "{broken json");

    expect(loadStoredFormValues()).toEqual(defaults);
  });

  test("localStorage 中的非法值会被夹紧到允许范围", () => {
    window.localStorage.setItem(
      FIRE_STORAGE_KEY,
      JSON.stringify({
        monthlyBaseExpense: -200,
        swr: 9,
        returnRate: "bad",
      }),
    );

    const stored = loadStoredFormValues();

    expect(stored.monthlyBaseExpense).toBe(2000);
    expect(stored.swr).toBe(0.06);
    expect(stored.returnRate).toBe(0.03);
  });
});
