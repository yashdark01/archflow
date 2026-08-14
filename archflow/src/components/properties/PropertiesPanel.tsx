"use client";

import { useCallback, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { ReactNode } from "react";
import { EdgeProperties } from "@/components/properties/EdgeProperties";
import { NodeProperties } from "@/components/properties/NodeProperties";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

interface PropertiesPanelProps {
  open: boolean;
  width: number;
  onClose?: () => void;
  onResize?: (width: number) => void;
  className?: string;
}

export function PropertiesPanel({
  open,
  width,
  onClose,
  onResize,
  className,
}: PropertiesPanelProps) {
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);

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

  let content: ReactNode = (
    <p className="text-sm text-muted-foreground">
      Select a node or edge to edit properties.
    </p>
  );

  if (selectedNodeId) {
    content = <NodeProperties nodeId={selectedNodeId} />;
  } else if (selectedEdgeId) {
    content = <EdgeProperties edgeId={selectedEdgeId} />;
  }

  return (
    <>
      {open && onClose ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close properties"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "z-40 flex shrink-0 flex-col border-l border-border bg-card",
          "fixed inset-y-0 right-0 transform transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:w-0 lg:border-l-0 lg:overflow-hidden",
          resizing && "transition-none",
          className,
        )}
        style={{ width: open ? width : 0 }}
        aria-label="Properties panel"
      >
        {onResize ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize properties panel"
            className="absolute left-0 top-0 z-10 hidden h-full w-2 -translate-x-1/2 cursor-col-resize touch-none lg:block hover:bg-primary/20 active:bg-primary/30"
            onPointerDown={onResizePointerDown}
          />
        ) : null}

        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <span className="section-label">Properties</span>
          {onClose ? (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
              onClick={onClose}
            >
              Close
            </button>
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto p-4">{content}</div>
      </aside>
    </>
  );
}
