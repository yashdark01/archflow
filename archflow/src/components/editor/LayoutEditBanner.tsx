"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { RotateCcw } from "lucide-react";

interface LayoutEditBannerProps {
  onResetLayout: () => void;
}

export function LayoutEditBanner({ onResetLayout }: LayoutEditBannerProps) {
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);
  const layoutManual = useAppSelector((state) => state.ui.layoutManual);

  if (!selectedNodeId && !selectedEdgeId) return null;

  return (
    <div
      className="archflow-layout-banner absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-card/95 px-4 py-2 shadow-lg backdrop-blur-sm"
    >
      <span className="text-xs text-muted-foreground">
        {layoutManual ? "Manual layout — drag to reposition" : "Diagram-as-code layout"}
      </span>
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
    </div>
  );
}
