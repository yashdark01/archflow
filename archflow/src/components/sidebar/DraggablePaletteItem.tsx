"use client";

import type { DragEvent, ReactNode } from "react";
import { startPaletteDrag, clearPaletteDragSession } from "@/lib/canvas/paletteDragSession";
import type { NodeType } from "@/types/diagram";

interface DraggablePaletteProps {
  nodeType?: NodeType;
  iconId?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DraggablePaletteItem({
  nodeType,
  iconId,
  title,
  children,
  className,
  onClick,
}: DraggablePaletteProps) {
  const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
    if (iconId) {
      event.dataTransfer.setData("application/archflow-icon", iconId);
      startPaletteDrag({ iconId });
    } else if (nodeType) {
      event.dataTransfer.setData("application/archflow-node", nodeType);
      startPaletteDrag({ nodeType });
    }
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <button
      type="button"
      draggable
      title={title}
      className={className}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={() => clearPaletteDragSession()}
    >
      {children}
    </button>
  );
}
