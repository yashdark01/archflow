"use client";

import { useState } from "react";
import type { NodeData } from "@/types/diagram";
import { EraserIcon } from "@/components/icons/EraserIcon";
import { humanizeIconId } from "@/constants/eraserIcons";
import { NodeHandles } from "@/components/canvas/nodes/NodeHandles";
import { useNodeLabelEdit } from "@/components/canvas/nodes/useNodeLabelEdit";
import { useResolvedNodeStyle } from "@/components/canvas/nodes/useResolvedNodeStyle";
import {
  inferCanvasNodeVariant,
  NODE_DESIGN,
  SELECTION_RING,
} from "@/lib/canvas/style/nodeDesign";
import { cn } from "@/lib/utils";

interface IconNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

export function IconNode({ id, data, selected }: IconNodeProps) {
  const variant = inferCanvasNodeVariant({
    nodeType: data.nodeType,
    icon: data.icon,
    borderStyle: data.borderStyle,
  });
  const isIconOnly = variant === "iconOnly";
  const design = NODE_DESIGN[variant];
  const resolved = useResolvedNodeStyle(data);
  const [hovered, setHovered] = useState(false);
  const showHandles = hovered || selected;

  const iconDefaultLabel = data.icon ? humanizeIconId(data.icon) : "";
  const showIconCanvasLabel =
    !isIconOnly ||
    (data.label.trim().length > 0 && data.label.trim() !== iconDefaultLabel);

  const {
    editing,
    editValue,
    setEditValue,
    startEditing,
    commitLabel,
    cancelEditing,
  } = useNodeLabelEdit(id, data.label);

  return (
    <div
      className={cn(
        design.rootClass,
        "group/node relative flex flex-col items-center px-1 py-1",
        !isIconOnly && "gap-1.5",
        selected && "rounded-lg",
        selected && SELECTION_RING.icon,
      )}
      style={{
        boxShadow: resolved.boxShadow,
        filter: resolved.filter,
        fontFamily: resolved.fontFamily,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NodeHandles color={data.color} size="icon" visible={showHandles} />

      <div className="flex flex-col items-center" onDoubleClick={startEditing}>
        <EraserIcon
          iconId={data.icon!}
          size={design.iconSize}
          className="drop-shadow-sm transition-transform duration-200 group-hover/node:scale-105"
        />
      </div>

      {editing ? (
        <input
          className="nodrag nopan z-10 w-full max-w-[120px] bg-transparent text-center text-[11px] font-medium outline-none"
          value={editValue}
          placeholder={isIconOnly ? "Optional label" : undefined}
          onChange={(event) => setEditValue(event.target.value)}
          onBlur={commitLabel}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitLabel();
            if (event.key === "Escape") cancelEditing();
          }}
          autoFocus
        />
      ) : showIconCanvasLabel ? (
        <span
          className={cn("z-10 text-center", design.labelClass)}
          onDoubleClick={startEditing}
        >
          {data.label}
        </span>
      ) : null}
    </div>
  );
}
