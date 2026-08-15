"use client";

import type { DragEvent } from "react";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { startPaletteDrag, clearPaletteDragSession } from "@/lib/canvas/paletteDragSession";
import type { NodeType } from "@/types/diagram";
import { cn } from "@/lib/utils";

interface PaletteItemProps {
  type: NodeType;
  label: string;
  description: string;
}

export function PaletteItem({ type, label, description }: PaletteItemProps) {
  const color = NODE_DEFAULTS[type].color;

  const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("application/archflow-node", type);
    event.dataTransfer.effectAllowed = "copy";
    startPaletteDrag({ nodeType: type });
  };

  const onDragEnd = () => {
    clearPaletteDragSession();
  };

  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-2 text-left transition-colors",
        "hover:border-border-strong hover:bg-muted/50 active:cursor-grabbing",
      )}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-sm ring-1 ring-border"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-sm font-medium" title={description}>
        {label}
      </span>
    </button>
  );
}
