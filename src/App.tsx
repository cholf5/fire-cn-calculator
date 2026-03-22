import { useEffect, useState } from "react";
import { Disclaimer } from "./components/Disclaimer";
import { Header } from "./components/Header";
import { InputPanel } from "./components/InputPanel";
import { ResultPanel } from "./components/ResultPanel";
import { useFireCalc } from "./hooks/useFireCalc";

type ThemeMode = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "fire-cn-calculator:theme";

function loadThemeMode(): ThemeMode {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") {
    return mode;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(loadThemeMode);
  const {
    values,
    result,
    activePresetKey,
    updateValue,
    applyPreset,
    resetToDefaults,
  } = useFireCalc();

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");

    function applyTheme() {
      root.dataset.theme = resolveTheme(themeMode);
    }

    applyTheme();
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);

    if (themeMode !== "system" || !mediaQuery) {
      return;
    }

    const handleChange = () => {
      applyTheme();
    };

    mediaQuery.addEventListener?.("change", handleChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
    };
  }, [themeMode]);

  return (
    <div className="app-shell">
      <Header themeMode={themeMode} onThemeChange={setThemeMode} />
      <main className="main-layout">
        <ResultPanel values={values} result={result} />
        <InputPanel
          values={values}
          activePresetKey={activePresetKey}
          onChange={updateValue}
          onPresetSelect={applyPreset}
          onReset={resetToDefaults}
        />
      </main>
      <Disclaimer />
    </div>
  );
}
