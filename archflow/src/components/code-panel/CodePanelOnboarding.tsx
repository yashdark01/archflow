"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "archflow-code-onboarding-seen";

export function CodePanelOnboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="absolute bottom-3 left-3 right-3 z-10 rounded-lg border border-primary/40 bg-[#252526] px-3 py-2 text-xs text-white/90 shadow-lg sm:left-auto sm:right-3 sm:max-w-xs"
      role="status"
    >
      <p className="font-medium text-white">Diagram as code</p>
      <p className="mt-1 text-white/70">
        Edit Mermaid or Eraser DSL here — the canvas updates live. Use the copy button to
        export a snippet.
      </p>
      <button
        type="button"
        className="mt-2 text-[11px] font-medium text-primary hover:underline"
        onClick={dismiss}
      >
        Got it
      </button>
    </div>
  );
}
