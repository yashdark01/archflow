"use client";

import { useEffect } from "react";
import { useReactFlow, useStore } from "reactflow";

export function CanvasZoomIndicator() {
  const zoom = useStore((state) => state.transform[2]);
  const { fitView } = useReactFlow();
  const percent = Math.round(zoom * 100);

  return (
    <div className="absolute right-3 top-3 z-20">
      <button
        type="button"
        onClick={() => fitView({ padding: 0.2, duration: 300 })}
        className="flex h-7 items-center gap-1 rounded-md border border-border bg-card/95 px-2 text-xs text-muted-foreground backdrop-blur-sm hover:bg-muted"
        aria-label={`Zoom ${percent}% — click to fit`}
      >
        {percent}%
        <span className="text-[10px] opacity-60">▾</span>
      </button>
    </div>
  );
}

export function CanvasKeyboardShortcuts() {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const onFitView = () => {
      fitView({ padding: 0.25, duration: 300 });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key === "0") {
        event.preventDefault();
        onFitView();
        return;
      }

      if (mod && (event.key === "=" || event.key === "+")) {
        event.preventDefault();
        zoomIn({ duration: 200 });
        return;
      }

      if (mod && event.key === "-") {
        event.preventDefault();
        zoomOut({ duration: 200 });
      }
    };

    window.addEventListener("archflow:fit-view", onFitView);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("archflow:fit-view", onFitView);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fitView, zoomIn, zoomOut]);

  return null;
}
