import { useEffect, useId, useRef, useState } from "react";

interface InfoTipProps {
  label: string;
  text: string;
}

export function InfoTip({ label, text }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  return (
    <span ref={containerRef} className="info-tip">
      <button
        className={`info-tip-trigger ${open ? "is-open" : ""}`}
        type="button"
        aria-label={`查看${label}说明`}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        ?
      </button>
      {open ? (
        <span id={tipId} className="info-tip-popover" role="tooltip">
          {text}
        </span>
      ) : null}
    </span>
  );
}
