import type { FireFormValues } from "../core/types";
import { NumberField } from "./NumberField";

interface BasicInputsProps {
  values: FireFormValues;
  onChange: <K extends keyof FireFormValues>(
    key: K,
    value: FireFormValues[K],
  ) => void;
}

export function BasicInputs({ values, onChange }: BasicInputsProps) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>基础输入</h2>
      </div>

      <NumberField
        label="月支出（不含住房）"
        value={values.monthlyBaseExpense}
        min={2000}
        max={30000}
        step={500}
        suffix="元"
        onChange={(value) => onChange("monthlyBaseExpense", value)}
      />

      <fieldset className="field radio-group">
        <legend className="field-label">城市等级</legend>
        <div className="radio-options">
          <label>
            <input
              type="radio"
              name="cityTier"
              checked={values.cityTier === "tier1"}
              onChange={() => onChange("cityTier", "tier1")}
            />
            一线
          </label>
          <label>
            <input
              type="radio"
              name="cityTier"
              checked={values.cityTier === "tier2"}
              onChange={() => onChange("cityTier", "tier2")}
            />
            二线
          </label>
          <label>
            <input
              type="radio"
              name="cityTier"
              checked={values.cityTier === "tier34"}
              onChange={() => onChange("cityTier", "tier34")}
            />
            三四线
          </label>
        </div>
      </fieldset>

      <label className="toggle-row">
        <span className="field-label">是否有房</span>
        <button
          className={`toggle ${values.hasHouse ? "is-active" : ""}`}
          type="button"
          onClick={() => onChange("hasHouse", !values.hasHouse)}
        >
          {values.hasHouse ? "是" : "否"}
        </button>
      </label>

      <NumberField
        label="投资收益率"
        value={values.returnRate * 100}
        min={0}
        max={12}
        step={0.1}
        suffix="%"
        onChange={(value) => onChange("returnRate", value / 100)}
      />

      <NumberField
        label="通胀率"
        value={values.inflationRate * 100}
        min={0}
        max={8}
        step={0.1}
        suffix="%"
        onChange={(value) => onChange("inflationRate", value / 100)}
      />

      <NumberField
        label="提取率 SWR"
        value={values.swr * 100}
        min={2}
        max={6}
        step={0.1}
        suffix="%"
        onChange={(value) => onChange("swr", value / 100)}
      />
    </section>
  );
}
