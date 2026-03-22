import type { FireFormValues } from "../core/types";
import { AdvancedInputs } from "./AdvancedInputs";
import { BasicInputs } from "./BasicInputs";
import { PresetSelector } from "./PresetSelector";
import type { PresetKey } from "../config/presets";

interface InputPanelProps {
  values: FireFormValues;
  onChange: <K extends keyof FireFormValues>(
    key: K,
    value: FireFormValues[K],
  ) => void;
  onPresetSelect: (key: PresetKey) => void;
}

export function InputPanel({
  values,
  onChange,
  onPresetSelect,
}: InputPanelProps) {
  return (
    <aside className="panel input-panel">
      <PresetSelector onSelect={onPresetSelect} />
      <BasicInputs values={values} onChange={onChange} />
      <AdvancedInputs values={values} onChange={onChange} />
    </aside>
  );
}
