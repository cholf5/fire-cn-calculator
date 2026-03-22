import { InfoTip } from "./InfoTip";

interface FieldLabelProps {
  label: string;
  helpText: string;
}

export function FieldLabel({ label, helpText }: FieldLabelProps) {
  return (
    <span className="field-label-row">
      <span>{label}</span>
      <InfoTip label={label} text={helpText} />
    </span>
  );
}
