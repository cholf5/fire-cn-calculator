import { useEffect, useState } from "react";
import type { FireCalculationResult, FireFormValues } from "../core/types";
import { formatCurrency, formatPercent } from "../utils/format";
import { createShareCardBlob } from "../utils/shareCard";

interface ResultPanelProps {
  values: FireFormValues;
  result: FireCalculationResult;
}

export function ResultPanel({ values, result }: ResultPanelProps) {
  const [copyLinkState, setCopyLinkState] = useState<"idle" | "success" | "error">("idle");
  const [copySummaryState, setCopySummaryState] = useState<"idle" | "success" | "error">("idle");
  const [copyImageState, setCopyImageState] = useState<"idle" | "success" | "error">("idle");
  const barMax = result.upperBound;
  const recommendedWidth = `${(result.fireTarget / barMax) * 100}%`;
  const conservativeWidth = `${(result.lowerBound / barMax) * 100}%`;
  const annualHousingCost = result.monthlyHousingCost * 12;
  const recommendedTarget = Math.max(result.fireTarget, result.longevityAdjustedTarget);
  const targetComparisonMax = Math.max(result.fireTarget, result.longevityAdjustedTarget);
  const fireTargetWidth = `${(result.fireTarget / targetComparisonMax) * 100}%`;
  const longevityTargetWidth = `${(result.longevityAdjustedTarget / targetComparisonMax) * 100}%`;
  const expenseCompositionTotal =
    result.baseAnnualExpense + annualHousingCost + result.medicalAnnualExpense;
  const baseExpenseWidth = `${(result.baseAnnualExpense / expenseCompositionTotal) * 100}%`;
  const housingExpenseWidth = `${(annualHousingCost / expenseCompositionTotal) * 100}%`;
  const medicalExpenseWidth = `${(result.medicalAnnualExpense / expenseCompositionTotal) * 100}%`;
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

  useEffect(() => {
    if (copyImageState === "idle") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopyImageState("idle");
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copyImageState]);

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
      "FIRE 财务自由测算结果摘要",
      `推荐准备资产：${formatCurrency(recommendedTarget)}`,
      `基础估算：${formatCurrency(result.fireTarget)}`,
      `长期覆盖建议：${formatCurrency(result.longevityAdjustedTarget)}`,
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

  async function handleCopyImage() {
    try {
      if (
        typeof navigator.clipboard.write !== "function" ||
        typeof ClipboardItem === "undefined"
      ) {
        throw new Error("clipboard image unsupported");
      }

      const blob = await createShareCardBlob({
        recommendedTarget,
        baseTarget: result.fireTarget,
        longevityTarget: result.longevityAdjustedTarget,
        annualExpense: result.annualExpense,
        swr: values.swr,
        safetyLabel: result.safetyLabel,
        realReturn: result.realReturn,
        cityTierLabel,
        hasHouse: values.hasHouse,
        baseAnnualExpense: result.baseAnnualExpense,
        annualHousingCost,
        medicalAnnualExpense: result.medicalAnnualExpense,
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      setCopyImageState("success");
    } catch {
      setCopyImageState("error");
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
  const copyImageLabel =
    copyImageState === "success"
      ? "卡片已复制"
      : copyImageState === "error"
        ? "卡片复制失败"
        : "复制分享卡片";
  const adjustmentDirectionText =
    result.longevityAdjustmentDelta > 0
      ? "上调"
      : result.longevityAdjustmentDelta < 0
        ? "下调"
        : "保持不变";
  const recommendationReason =
    recommendedTarget === result.longevityAdjustedTarget && result.longevityAdjustmentDelta > 0
      ? "已把退休年限和未来支出增长一并考虑，建议优先按长期覆盖口径准备。"
      : "按当前参数，两种口径结果接近，建议至少按当前推荐值准备。";

  return (
    <section className="panel result-panel">
      <div className="result-hero">
        <p className="result-label">推荐准备资产</p>
        <strong className="result-number">{formatCurrency(recommendedTarget)}</strong>
        <p className="result-caption">{recommendationReason}</p>
        <div className="result-status-row">
          <span className="status-pill">安全等级：{result.safetyLabel}</span>
          <span className="status-pill status-pill-alt">
            长期因素{adjustmentDirectionText}
            {formatCurrency(Math.abs(result.longevityAdjustmentDelta))}
          </span>
        </div>
        <div className="result-actions">
          <button className="share-button" type="button" onClick={handleCopyLink}>
            {copyLinkLabel}
          </button>
          <button className="share-button" type="button" onClick={handleCopySummary}>
            {copySummaryLabel}
          </button>
          <button className="share-button" type="button" onClick={handleCopyImage}>
            {copyImageLabel}
          </button>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span>基础估算</span>
          <strong>{formatCurrency(result.fireTarget)}</strong>
        </div>
        <div className="summary-card">
          <span>长期覆盖建议</span>
          <strong>{formatCurrency(result.longevityAdjustedTarget)}</strong>
        </div>
        <div className="summary-card">
          <span>年支出</span>
          <strong>{formatCurrency(result.annualExpense)}</strong>
        </div>
      </div>

      <div className="insight-card">
        <div className="card-heading">
          <h2>长期结论</h2>
          <p>系统会优先采用更稳妥的口径，避免把两个结果同时当成最终答案。</p>
        </div>
        <p className="insight-lead">
          长期因素会把目标{adjustmentDirectionText}
          <strong>{formatCurrency(Math.abs(result.longevityAdjustmentDelta))}</strong>
          ，所以当前更适合参考
          <strong>{formatCurrency(recommendedTarget)}</strong>。
        </p>
        <div className="insight-grid">
          <div>
            <span>长期覆盖建议</span>
            <strong>{formatCurrency(result.longevityAdjustedTarget)}</strong>
          </div>
          <div>
            <span>基础估算</span>
            <strong>{formatCurrency(result.fireTarget)}</strong>
          </div>
          <div>
            <span>当前提取率</span>
            <strong>{formatPercent(values.swr)}</strong>
          </div>
        </div>
        <p className="longevity-caption">基于退休年限与未来支出增长估算</p>
      </div>

      <div className="comparison-card">
        <h2>目标对比</h2>
        <div className="comparison-group">
          <div className="comparison-meta">
            <span>基础估算</span>
            <strong>{formatCurrency(result.fireTarget)}</strong>
          </div>
          <div className="comparison-track" aria-hidden="true">
            <div className="comparison-fill comparison-fill-main" style={{ width: fireTargetWidth }} />
          </div>
        </div>
        <div className="comparison-group">
          <div className="comparison-meta">
            <span>长期覆盖建议</span>
            <strong>{formatCurrency(result.longevityAdjustedTarget)}</strong>
          </div>
          <div className="comparison-track" aria-hidden="true">
            <div className="comparison-fill comparison-fill-alt" style={{ width: longevityTargetWidth }} />
          </div>
        </div>
      </div>

      <div className="expense-card">
        <div className="card-heading">
          <h2>支出拆解</h2>
          <p>把主结果拆成基础消费、住房和医疗三部分，方便判断主要压力来源。</p>
        </div>
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
        <h3 className="subsection-title">年支出构成</h3>
        <div className="composition-track" aria-hidden="true">
          <div className="composition-fill composition-fill-base" style={{ width: baseExpenseWidth }} />
          <div className="composition-fill composition-fill-housing" style={{ width: housingExpenseWidth }} />
          <div className="composition-fill composition-fill-medical" style={{ width: medicalExpenseWidth }} />
        </div>
        <div className="composition-legend">
          <div>
            <span>基础支出</span>
            <strong>{formatCurrency(result.baseAnnualExpense)}</strong>
          </div>
          <div>
            <span>住房补充</span>
            <strong>{formatCurrency(annualHousingCost)}</strong>
          </div>
          <div>
            <span>医疗增量</span>
            <strong>{formatCurrency(result.medicalAnnualExpense)}</strong>
          </div>
        </div>
      </div>

      <div className="range-card">
        <h2>资产区间参考</h2>
        <p>
          低：{formatCurrency(result.lowerBound)} | 基础估算：
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
