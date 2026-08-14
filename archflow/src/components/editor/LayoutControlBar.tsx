"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLayoutDirection } from "@/store/slices/uiSlice";
import type { LayoutDirection } from "@/store/slices/uiSlice";
import {
  ArrowDown,
  ArrowRight,
  Focus,
  LayoutGrid,
  MousePointerClick,
  RotateCcw,
} from "lucide-react";

interface LayoutControlBarProps {
  onAutoLayout: (direction?: LayoutDirection) => void;
  onResetLayout: () => void;
  onSelectDiagram: () => void;
}

export function LayoutControlBar({
  onAutoLayout,
  onResetLayout,
  onSelectDiagram,
}: LayoutControlBarProps) {
  const dispatch = useAppDispatch();
  const nodeCount = useAppSelector((state) => state.diagram.nodes.length);
  const layoutManual = useAppSelector((state) => state.ui.layoutManual);
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);
  const allSelected = useAppSelector(
    (state) =>
      state.diagram.nodes.length > 0 &&
      state.diagram.nodes.every((node) => node.selected),
  );

  if (nodeCount === 0) return null;

  const hasElementSelection = selectedNodeId || selectedEdgeId;

  return (
    <div
      className="archflow-layout-banner absolute bottom-4 left-1/2 z-20 flex max-w-[95vw] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm"
    >
      <span className="hidden text-xs text-muted-foreground sm:inline">
        {layoutManual ? "Manual layout" : "Auto layout"}
      </span>

      {hasElementSelection ? (
        <span className="text-xs text-primary">Drag to reposition · double-click edge to label</span>
      ) : null}

      {allSelected ? (
        <span className="text-xs text-muted-foreground">Diagram selected — drag to move all</span>
      ) : null}

      <div className="flex items-center gap-0.5 rounded-md border border-border bg-muted/40 p-0.5">
        <Button
          type="button"
          variant={layoutDirection === "LR" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={() => {
            dispatch(setLayoutDirection("LR"));
            if (!layoutManual) onAutoLayout("LR");
          }}
        >
          <ArrowRight className="size-3" />
          LR
        </Button>
        <Button
          type="button"
          variant={layoutDirection === "TD" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={() => {
            dispatch(setLayoutDirection("TD"));
            if (!layoutManual) onAutoLayout("TD");
          }}
        >
          <ArrowDown className="size-3" />
          TD
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={onSelectDiagram}
      >
        <MousePointerClick className="size-3" />
        Select diagram
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={() => onAutoLayout()}
      >
        <LayoutGrid className="size-3" />
        Auto layout
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={onResetLayout}
      >
        <RotateCcw className="size-3" />
        Reset layout
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={() => window.dispatchEvent(new Event("archflow:fit-view"))}
      >
        <Focus className="size-3" />
        Fit
      </Button>
    </div>
  );
}
