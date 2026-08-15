"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useReactFlow, useStore } from "reactflow";
import { LegendItemPreview } from "@/components/canvas/legend/LegendItemPreview";
import {
  computeLegendFlowPosition,
  computeNodesFlowBounds,
} from "@/lib/canvas/legend/legendPosition";
import { getLegendLayoutOverride } from "@/lib/canvas/layout/overrides";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLegendLayoutOverride } from "@/store/slices/diagramSlice";
import { cn } from "@/lib/utils";

interface CanvasLegendProps {
  readOnly?: boolean;
}

export function CanvasLegend({ readOnly = false }: CanvasLegendProps) {
  const dispatch = useAppDispatch();
  const legend = useAppSelector((state) => state.diagram.document.legend);
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const layoutOverrides = useAppSelector((state) => state.diagram.layoutOverrides);
  const colorScheme = useAppSelector((state) => state.ui.colorScheme);
  const transform = useStore((state) => state.transform);
  const { screenToFlowPosition } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 200, height: 80 });
  const dragRef = useRef<{
    pointerFlow: { x: number; y: number };
    legendFlow: { x: number; y: number };
  } | null>(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const { width, height } = element.getBoundingClientRect();
    if (width > 0 && height > 0) {
      setSize({ width, height });
    }
  }, [legend?.items.length, legend?.position]);

  if (!legend?.items.length) return null;

  const bounds = computeNodesFlowBounds(nodes);
  const legendOverride = getLegendLayoutOverride(layoutOverrides);
  const anchorPosition = legendOverride
    ? { x: legendOverride.x, y: legendOverride.y }
    : computeLegendFlowPosition(bounds, legend.position, size);
  const [tx, ty, zoom] = transform;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (readOnly) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerFlow: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
      legendFlow: { ...anchorPosition },
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    event.stopPropagation();
    const pointerFlow = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const dx = pointerFlow.x - dragRef.current.pointerFlow.x;
    const dy = pointerFlow.y - dragRef.current.pointerFlow.y;
    dispatch(
      updateLegendLayoutOverride({
        x: dragRef.current.legendFlow.x + dx,
        y: dragRef.current.legendFlow.y + dy,
      }),
    );
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    event.stopPropagation();
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-[5] origin-top-left"
      style={{
        transform: `translate(${anchorPosition.x * zoom + tx}px, ${anchorPosition.y * zoom + ty}px) scale(${zoom})`,
      }}
    >
      <div
        ref={containerRef}
        className={cn(
          "min-w-[160px] max-w-[240px] rounded-lg border px-3 py-2 shadow-md",
          colorScheme === "light"
            ? "border-border/80 bg-card/95 text-foreground"
            : "border-white/10 bg-[#1c1c1f]/95 text-foreground",
          !readOnly && "pointer-events-auto cursor-grab active:cursor-grabbing",
        )}
        aria-label="Diagram legend"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <ul className="space-y-1.5">
          {legend.items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              <LegendItemPreview item={item} />
              <span className="text-xs leading-tight text-foreground/90">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
