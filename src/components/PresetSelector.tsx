import { presets, type PresetKey } from "../config/presets";

interface PresetSelectorProps {
  onSelect: (key: PresetKey) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>场景预设</h2>
      </div>
      <div className="preset-list">
        {presets.map((preset) => (
          <button
            key={preset.key}
            className="preset-button"
            type="button"
            onClick={() => onSelect(preset.key)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}
