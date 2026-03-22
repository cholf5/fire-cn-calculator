import { describe, expect, test, vi } from "vitest";
import { defaultFormValues } from "../config/defaults";
import type { FireFormValues } from "../core/types";
import {
  buildSearchParams,
  loadUrlFormValues,
  replaceUrlState,
} from "./urlState";

describe("urlState", () => {
  test("URL 中存在可识别字段时，按白名单参数恢复表单值", () => {
    window.history.replaceState(
      {},
      "",
      "/?m=12000&c=tier1&h=0&r=0.05&i=0.02&s=0.035&med=0.12&x=ignored",
    );

    expect(loadUrlFormValues()).toEqual<FireFormValues>({
      ...defaultFormValues,
      monthlyBaseExpense: 12000,
      cityTier: "tier1",
      hasHouse: false,
      returnRate: 0.05,
      inflationRate: 0.02,
      swr: 0.035,
      medicalExpenseRatio: 0.12,
    });
  });

  test("URL 中没有可识别字段时返回 null", () => {
    window.history.replaceState({}, "", "/?foo=bar");

    expect(loadUrlFormValues()).toBeNull();
  });

  test("非法参数会在解析时被夹紧或回退", () => {
    window.history.replaceState({}, "", "/?m=-1&s=9&r=bad&c=unknown&h=1");

    expect(loadUrlFormValues()).toEqual<FireFormValues>({
      ...defaultFormValues,
      monthlyBaseExpense: 2000,
      cityTier: defaultFormValues.cityTier,
      hasHouse: true,
      returnRate: defaultFormValues.returnRate,
      swr: 0.06,
    });
  });

  test("序列化只输出影响主结果且与默认值不同的字段", () => {
    const values: FireFormValues = {
      ...defaultFormValues,
      monthlyBaseExpense: 12000,
      hasHouse: false,
      medicalExpenseRatio: 0.12,
    };

    expect(buildSearchParams(values)).toBe("?m=12000&h=0&med=0.12");
  });

  test("replaceUrlState 使用 replaceState 写回地址栏", () => {
    const spy = vi.spyOn(window.history, "replaceState");

    replaceUrlState({
      ...defaultFormValues,
      monthlyBaseExpense: 12000,
    });

    expect(spy).toHaveBeenCalledOnce();
    expect(window.location.search).toBe("?m=12000");
  });
});
