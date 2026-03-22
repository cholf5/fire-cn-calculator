import type { FireFormValues } from "../core/types";
import { FieldLabel } from "./FieldLabel";
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
        label={
          <FieldLabel
            label="月支出（不含住房）"
            helpText="这里填写不含房租或房贷的基础月支出，住房部分会按是否有房和城市等级单独估算。"
          />
        }
        value={values.monthlyBaseExpense}
        min={2000}
        max={30000}
        step={500}
        suffix="元"
        onChange={(value) => onChange("monthlyBaseExpense", value)}
      />

      <fieldset className="field radio-group">
        <legend className="field-label">
          <FieldLabel
            label="城市等级"
            helpText="只在无房时影响住房补充比例，一线、二线、三四线会采用不同住房压力口径。"
          />
        </legend>
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
        <span className="field-label">
          <FieldLabel
            label="是否有房"
            helpText="有房时住房补充按 0 计算；无房时会额外加入住房成本。"
          />
        </span>
        <button
          className={`toggle ${values.hasHouse ? "is-active" : ""}`}
          type="button"
          onClick={() => onChange("hasHouse", !values.hasHouse)}
        >
          {values.hasHouse ? "是" : "否"}
        </button>
      </label>

      <NumberField
        label={
          <FieldLabel
            label="投资收益率"
            helpText="用于计算实际收益率，并参与长期覆盖建议的折现估算。"
          />
        }
        value={values.returnRate * 100}
        min={0}
        max={12}
        step={0.1}
        suffix="%"
        onChange={(value) => onChange("returnRate", value / 100)}
      />

      <NumberField
        label={
          <FieldLabel
            label="通胀率"
            helpText="用于估算未来支出增长，通胀越高，长期覆盖建议通常越高。"
          />
        }
        value={values.inflationRate * 100}
        min={0}
        max={8}
        step={0.1}
        suffix="%"
        onChange={(value) => onChange("inflationRate", value / 100)}
      />

      <NumberField
        label={
          <FieldLabel
            label="提取率 SWR"
            helpText="表示退休后每年可从资产中提取的比例，提取率越高，基础估算越低，但风险通常更高。"
          />
        }
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
