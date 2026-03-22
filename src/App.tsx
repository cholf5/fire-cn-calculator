import { Disclaimer } from "./components/Disclaimer";
import { Header } from "./components/Header";
import { InputPanel } from "./components/InputPanel";
import { ResultPanel } from "./components/ResultPanel";
import { useFireCalc } from "./hooks/useFireCalc";

export default function App() {
  const { values, result, updateValue, applyPreset } = useFireCalc();

  return (
    <div className="app-shell">
      <Header />
      <main className="main-layout">
        <ResultPanel values={values} result={result} />
        <InputPanel
          values={values}
          onChange={updateValue}
          onPresetSelect={applyPreset}
        />
      </main>
      <Disclaimer />
    </div>
  );
}
