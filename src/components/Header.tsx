import { useState } from "react";

interface HeaderProps {
  themeMode: "system" | "light" | "dark";
  onThemeChange: (mode: "system" | "light" | "dark") => void;
}

export function Header({ themeMode, onThemeChange }: HeaderProps) {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  return (
    <header className="hero">
      <div className="hero-topbar">
        <div>
          <p className="eyebrow">A China-aware FIRE calculator</p>
          <h1>FIRE CN Calculator</h1>
          <p className="hero-copy">
            用更贴近中国生活结构的口径，估算你的 FIRE 目标资产。
          </p>
        </div>
        <div className="theme-switcher">
          <button
            aria-expanded={isThemeMenuOpen}
            className="theme-trigger"
            type="button"
            onClick={() => setIsThemeMenuOpen((current) => !current)}
          >
            主题切换
          </button>
          {isThemeMenuOpen ? (
            <div className="theme-menu" role="group" aria-label="主题模式">
              <button
                className={themeMode === "light" ? "theme-option is-active" : "theme-option"}
                type="button"
                onClick={() => {
                  onThemeChange("light");
                  setIsThemeMenuOpen(false);
                }}
              >
                浅色
              </button>
              <button
                className={themeMode === "dark" ? "theme-option is-active" : "theme-option"}
                type="button"
                onClick={() => {
                  onThemeChange("dark");
                  setIsThemeMenuOpen(false);
                }}
              >
                深色
              </button>
              <button
                className={themeMode === "system" ? "theme-option is-active" : "theme-option"}
                type="button"
                onClick={() => {
                  onThemeChange("system");
                  setIsThemeMenuOpen(false);
                }}
              >
                跟随系统
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
