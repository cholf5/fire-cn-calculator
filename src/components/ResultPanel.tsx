import type { FireCalculationResult, FireFormValues } from "../core/types";
import { formatCurrency, formatPercent } from "../utils/format";

interface ResultPanelProps {
  values: FireFormValues;
  result: FireCalculationResult;
}

export function ResultPanel({ values, result }: ResultPanelProps) {
  const barMax = result.upperBound;
  const recommendedWidth = `${(result.fireTarget / barMax) * 100}%`;
  const conservativeWidth = `${(result.lowerBound / barMax) * 100}%`;

  return (
    <section className="panel result-panel">
      <div className="result-hero">
        <p className="result-label">FIRE 所需资产</p>
        <strong className="result-number">{formatCurrency(result.fireTarget)}</strong>
        <p className="result-caption">
          基于 {values.hasHouse ? "有房" : "无房"}、{formatPercent(values.swr)} 提取率估算
        </p>
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
        <ul>
          {result.riskHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
