import { useState } from "react";
import type { FireFormValues } from "../core/types";
import { NumberField } from "./NumberField";

interface AdvancedInputsProps {
  values: FireFormValues;
  onChange: <K extends keyof FireFormValues>(
    key: K,
    value: FireFormValues[K],
  ) => void;
}

export function AdvancedInputs({ values, onChange }: AdvancedInputsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="panel-section">
      <button
        className="expand-button"
        type="button"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "▲" : "▼"} 高级设置
      </button>

      {expanded ? (
        <div className="advanced-grid">
          <NumberField
            label="医疗支出占比"
            value={values.medicalExpenseRatio * 100}
            min={0}
            max={30}
            step={1}
            suffix="%"
            onChange={(value) => onChange("medicalExpenseRatio", value / 100)}
          />

          <NumberField
            label="租金增长率"
            value={values.rentGrowthRate * 100}
            min={0}
            max={10}
            step={0.5}
            suffix="%"
            onChange={(value) => onChange("rentGrowthRate", value / 100)}
          />

          <p className="field-hint">预留扩展，当前不影响主结果。</p>

          <NumberField
            label="退休年限"
            value={values.retirementYears}
            min={10}
            max={60}
            step={1}
            suffix="年"
            onChange={(value) => onChange("retirementYears", value)}
          />

          <p className="field-hint">预留扩展，当前不影响主结果。</p>
        </div>
      ) : null}
    </section>
  );
}
