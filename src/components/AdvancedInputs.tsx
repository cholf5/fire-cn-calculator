import { useState } from "react";
import type { FireFormValues } from "../core/types";
import { FieldLabel } from "./FieldLabel";
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
            label={
              <FieldLabel
                label="医疗支出占比"
                helpText="会按比例抬高总年支出，用于预留基础医疗和健康支出空间。"
              />
            }
            value={values.medicalExpenseRatio * 100}
            min={0}
            max={30}
            step={1}
            suffix="%"
            onChange={(value) => onChange("medicalExpenseRatio", value / 100)}
          />

          <NumberField
            label={
              <FieldLabel
                label="租金增长率"
                helpText="无房时用于推算未来住房支出的增长，会影响长期覆盖建议。"
              />
            }
            value={values.rentGrowthRate * 100}
            min={0}
            max={10}
            step={0.5}
            suffix="%"
            onChange={(value) => onChange("rentGrowthRate", value / 100)}
          />

          <NumberField
            label={
              <FieldLabel
                label="退休年限"
                helpText="用于估算需要覆盖多少年的退休生活，年限越长，长期覆盖建议通常越高。"
              />
            }
            value={values.retirementYears}
            min={10}
            max={60}
            step={1}
            suffix="年"
            onChange={(value) => onChange("retirementYears", value)}
          />
        </div>
      ) : null}
    </section>
  );
}
