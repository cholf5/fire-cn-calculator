import { useEffect, useState } from "react";
import type { FireCalculationResult, FireFormValues } from "../core/types";
import { formatCurrency, formatPercent } from "../utils/format";

interface ResultPanelProps {
  values: FireFormValues;
  result: FireCalculationResult;
}

export function ResultPanel({ values, result }: ResultPanelProps) {
  const [copyLinkState, setCopyLinkState] = useState<"idle" | "success" | "error">("idle");
  const [copySummaryState, setCopySummaryState] = useState<"idle" | "success" | "error">("idle");
  const barMax = result.upperBound;
  const recommendedWidth = `${(result.fireTarget / barMax) * 100}%`;
  const conservativeWidth = `${(result.lowerBound / barMax) * 100}%`;
  const annualHousingCost = result.monthlyHousingCost * 12;
  const cityTierLabel =
    values.cityTier === "tier1"
      ? "一线"
      : values.cityTier === "tier2"
        ? "二线"
        : "三四线";

  useEffect(() => {
    if (copyLinkState === "idle") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopyLinkState("idle");
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copyLinkState]);

  useEffect(() => {
    if (copySummaryState === "idle") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopySummaryState("idle");
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copySummaryState]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyLinkState("success");
    } catch {
      setCopyLinkState("error");
    }
  }

  async function handleCopySummary() {
    const summaryText = [
      "FIRE 当前结果摘要",
      `FIRE 所需资产：${formatCurrency(result.fireTarget)}`,
      `长期校正参考：${formatCurrency(result.longevityAdjustedTarget)}`,
      `年支出：${formatCurrency(result.annualExpense)}`,
      `提取率：${formatPercent(values.swr)}`,
      `实际收益率：${formatPercent(result.realReturn, 2)}`,
      `城市等级：${cityTierLabel}`,
      `是否有房：${values.hasHouse ? "有房" : "无房"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopySummaryState("success");
    } catch {
      setCopySummaryState("error");
    }
  }

  const copyLinkLabel =
    copyLinkState === "success"
      ? "已复制"
      : copyLinkState === "error"
        ? "复制失败"
        : "复制分享链接";
  const copySummaryLabel =
    copySummaryState === "success"
      ? "摘要已复制"
      : copySummaryState === "error"
        ? "摘要复制失败"
        : "复制当前结果摘要";

  return (
    <section className="panel result-panel">
      <div className="result-hero">
        <p className="result-label">FIRE 所需资产</p>
        <strong className="result-number">{formatCurrency(result.fireTarget)}</strong>
        <p className="result-caption">
          基于 {values.hasHouse ? "有房" : "无房"}、{formatPercent(values.swr)} 提取率估算
        </p>
        <div className="result-actions">
          <button className="share-button" type="button" onClick={handleCopyLink}>
            {copyLinkLabel}
          </button>
          <button className="share-button" type="button" onClick={handleCopySummary}>
            {copySummaryLabel}
          </button>
        </div>
      </div>

      <div className="result-grid">
        <div>
          <span>年支出</span>
          <strong>{formatCurrency(result.annualExpense)}</strong>
        </div>
        <div>
          <span>提取率</span>
          <strong>{formatPercent(values.swr)}</strong>
        </div>
        <div>
          <span>实际收益率</span>
          <strong>{formatPercent(result.realReturn, 2)}</strong>
        </div>
      </div>

      <div className="breakdown-card">
        <h2>结果拆解</h2>
        <div className="breakdown-grid">
          <div>
            <span>基础年支出</span>
            <strong>{formatCurrency(result.baseAnnualExpense)}</strong>
          </div>
          <div>
            <span>住房成本补充</span>
            <strong>{formatCurrency(annualHousingCost)}</strong>
          </div>
          <div>
            <span>医疗支出增量</span>
            <strong>{formatCurrency(result.medicalAnnualExpense)}</strong>
          </div>
        </div>
      </div>

      <div className="longevity-card">
        <h2>长期校正参考</h2>
        <div className="longevity-grid">
          <div>
            <span>参考资产</span>
            <strong>{formatCurrency(result.longevityAdjustedTarget)}</strong>
          </div>
          <div>
            <span>与主结果差额</span>
            <strong>
              {result.longevityAdjustmentDelta >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(result.longevityAdjustmentDelta)).replace("¥ ", "¥ ")}
            </strong>
          </div>
        </div>
        <p className="longevity-caption">基于退休年限与未来支出增长估算</p>
      </div>

      <div className="tag-block">
        <span className="tag-label">安全等级</span>
        <strong className="risk-tag">{result.safetyLabel}</strong>
      </div>

      <div className="range-card">
        <h2>资产区间参考</h2>
        <p>
          低：{formatCurrency(result.lowerBound)} | 推荐：
          {formatCurrency(result.fireTarget)} | 高：{formatCurrency(result.upperBound)}
        </p>
        <div className="range-bar">
          <div className="range-bar-low" style={{ width: conservativeWidth }} />
          <div className="range-bar-main" style={{ width: recommendedWidth }} />
        </div>
      </div>

      <div className="risk-card">
        <h2>风险提示</h2>
        {result.riskHighlights.length > 0 ? (
          <ul>
            {result.riskHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="risk-empty">当前参数下未触发高优先级风险提示。</p>
        )}
      </div>
    </section>
  );
}
