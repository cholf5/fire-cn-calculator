import { presets, type PresetKey } from "../config/presets";

interface PresetSelectorProps {
  onSelect: (key: PresetKey) => void;
  onReset: () => void;
  activePresetKey: PresetKey | null;
}

export function PresetSelector({
  onSelect,
  onReset,
  activePresetKey,
}: PresetSelectorProps) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>场景预设</h2>
      </div>
      <div className="preset-list">
        <button
          className="preset-button preset-reset-button"
          type="button"
          onClick={onReset}
        >
          重置默认值
        </button>
        {presets.map((preset) => (
          <button
            key={preset.key}
            className={`preset-button ${activePresetKey === preset.key ? "is-active" : ""}`.trim()}
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
