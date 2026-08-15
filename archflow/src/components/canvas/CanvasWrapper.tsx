"use client";

import { ReactFlowProvider } from "reactflow";
import { CanvasBoard } from "@/components/canvas/CanvasBoard";
import { WatercolorFilter } from "@/components/canvas/nodes/WatercolorFilter";
import {
  CanvasKeyboardShortcuts,
  CanvasZoomIndicator,
} from "@/components/canvas/CanvasKeyboardShortcuts";

interface CanvasWrapperProps {
  readOnly?: boolean;
}

export function CanvasWrapper({ readOnly = false }: CanvasWrapperProps) {
  return (
    <ReactFlowProvider>
      <div className="relative h-full w-full">
        <WatercolorFilter />
        <CanvasBoard readOnly={readOnly} />
        <CanvasKeyboardShortcuts />
        {!readOnly ? <CanvasZoomIndicator /> : null}
      </div>
    </ReactFlowProvider>
  );
}
