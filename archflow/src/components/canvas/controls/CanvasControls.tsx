"use client";

import { useReactFlow } from "reactflow";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSnapToGrid } from "@/store/slices/uiSlice";
import {
  Focus,
  Grid3x3,
  Minus,
  Plus,
  Ratio,
} from "lucide-react";

export function CanvasControls() {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const dispatch = useAppDispatch();
  const snapToGrid = useAppSelector((state) => state.ui.snapToGrid);

  return (
    <div className="canvas-control-surface absolute bottom-3 left-3 z-10 flex items-center gap-0.5 p-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Zoom in" onClick={() => zoomIn({ duration: 200 })}>
              <Plus className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Zoom out" onClick={() => zoomOut({ duration: 200 })}>
              <Minus className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Fit view"
              onClick={() => fitView({ padding: 0.25, duration: 300 })}
            >
              <Focus className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Fit view</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={snapToGrid ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="Toggle snap to grid"
              onClick={() => dispatch(toggleSnapToGrid())}
            >
              <Grid3x3 className="size-4" />
            </Button>
          }
        />
        <TooltipContent>{snapToGrid ? "Snap on" : "Snap off"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Reset zoom"
              onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
            >
              <Ratio className="size-4" />
            </Button>
          }
        />
        <TooltipContent>1:1 zoom</TooltipContent>
      </Tooltip>
    </div>
  );
}
