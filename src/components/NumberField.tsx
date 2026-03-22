import { useId, type ReactNode } from "react";

interface NumberFieldProps {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}

export function NumberField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: NumberFieldProps) {
  const id = useId();

  function handleChange(rawValue: string) {
    const nextValue = Number(rawValue);

    if (Number.isNaN(nextValue)) {
      return;
    }

    onChange(nextValue);
  }

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <div className="field-inputs">
        <input
          id={id}
          className="number-input"
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => handleChange(event.target.value)}
        />
        {suffix ? <span className="field-suffix">{suffix}</span> : null}
      </div>
      <input
        className="range-input"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => handleChange(event.target.value)}
      />
    </label>
  );
}
