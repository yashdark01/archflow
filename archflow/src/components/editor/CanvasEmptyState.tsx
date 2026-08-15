"use client";

import { useAppSelector } from "@/store/hooks";

export function CanvasEmptyState() {
  const nodeCount = useAppSelector((state) => state.diagram.nodes.length);

  if (nodeCount > 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-medium text-foreground/90">Start your diagram</p>
        <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <li>Press <kbd className="rounded border border-border px-1">+</kbd> or search to insert icons</li>
          <li>Drag nodes or icons from the palette onto the canvas</li>
          <li>Double-click empty canvas to add a text label</li>
        </ul>
      </div>
    </div>
  );
}
