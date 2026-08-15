"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLayoutDirection, type LayoutDirection } from "@/store/slices/uiSlice";
import {
  ArrowDown,
  ArrowRight,
  Focus,
  LayoutGrid,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";

interface LayoutContextBannerProps {
  onResetLayout: () => void;
  onAutoLayout: (direction?: LayoutDirection) => void;
}

export function LayoutContextBanner({
  onResetLayout,
  onAutoLayout,
}: LayoutContextBannerProps) {
  const dispatch = useAppDispatch();
  const nodeCount = useAppSelector((state) => state.diagram.nodes.length);
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);
  const layoutManual = useAppSelector((state) => state.ui.layoutManual);
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);
  const allSelected = useAppSelector(
    (state) =>
      state.diagram.nodes.length > 0 &&
      state.diagram.nodes.every((node) => node.selected),
  );

  if (nodeCount === 0) return null;

  const hasElementSelection = Boolean(selectedNodeId || selectedEdgeId);
  const showBanner = hasElementSelection || allSelected;

  if (!showBanner) return null;

  let hint = "Drag to reposition";
  if (allSelected && !hasElementSelection) {
    hint = "Diagram selected — drag to move all";
  } else if (layoutManual) {
    hint = "Manual layout — drag to reposition";
  }

  return (
    <div
      className="archflow-layout-banner pointer-events-auto absolute bottom-4 left-1/2 z-20 flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--canvas-border)] bg-[var(--canvas-banner-bg)] px-3 py-1.5 shadow-md"
    >
      <span className="hidden text-xs text-[var(--canvas-text-muted)] sm:inline">
        {hint}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-7 gap-1.5 text-xs shadow-none"
        onClick={onResetLayout}
      >
        <RotateCcw className="size-3" />
        Reset layout
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-[var(--canvas-text-muted)]"
              aria-label="More layout options"
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          }
        />
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            onClick={() => {
              dispatch(setLayoutDirection("LR"));
              onAutoLayout("LR");
            }}
          >
            <ArrowRight className="size-3.5" />
            Layout LR
            {layoutDirection === "LR" ? " · active" : ""}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              dispatch(setLayoutDirection("TD"));
              onAutoLayout("TD");
            }}
          >
            <ArrowDown className="size-3.5" />
            Layout TD
            {layoutDirection === "TD" ? " · active" : ""}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAutoLayout()}>
            <LayoutGrid className="size-3.5" />
            Auto layout
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.dispatchEvent(new Event("archflow:fit-view"))}
          >
            <Focus className="size-3.5" />
            Fit view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
