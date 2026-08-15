"use client";

import { useCallback, useState, type PointerEvent as ReactPointerEvent } from "react";
import { PropertiesPanelContent } from "@/components/properties/PropertiesPanelContent";
import { cn } from "@/lib/utils";

interface PropertiesPanelProps {
  open: boolean;
  width: number;
  onResize?: (width: number) => void;
  className?: string;
}

/** Legacy standalone properties aside — editor uses `EditorRightPanel` instead. */
export function PropertiesPanel({
  open,
  width,
  onResize,
  className,
}: PropertiesPanelProps) {
  const [resizing, setResizing] = useState(false);

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!onResize) return;
      event.preventDefault();
      setResizing(true);
      const startX = event.clientX;
      const startWidth = width;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const delta = startX - moveEvent.clientX;
        onResize(startWidth + delta);
      };

      const onPointerUp = () => {
        setResizing(false);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [onResize, width],
  );

  if (!open) return null;

  return (
    <aside
      className={cn(
        "relative z-30 flex shrink-0 flex-col border-l border-border bg-card",
        resizing && "transition-none",
        className,
      )}
      style={{ width }}
      aria-label="Properties panel"
    >
      {onResize ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize properties panel"
          className="absolute left-0 top-0 z-10 h-full w-2 -translate-x-1/2 cursor-col-resize touch-none hover:bg-primary/20 active:bg-primary/30"
          onPointerDown={onResizePointerDown}
        />
      ) : null}
      <PropertiesPanelContent />
    </aside>
  );
}
