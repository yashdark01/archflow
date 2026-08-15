"use client";

import { useState } from "react";
import type { NodeData } from "@/types/diagram";
import { EraserIcon } from "@/components/icons/EraserIcon";
import { NodeHandles } from "@/components/canvas/nodes/NodeHandles";
import { useNodeLabelEdit } from "@/components/canvas/nodes/useNodeLabelEdit";
import { useResolvedNodeStyle } from "@/components/canvas/nodes/useResolvedNodeStyle";
import {
  NODE_DESIGN,
  SELECTION_RING,
} from "@/lib/canvas/style/nodeDesign";
import { cn } from "@/lib/utils";

interface BoxedNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

export function BoxedNode({ id, data, selected }: BoxedNodeProps) {
  const design = NODE_DESIGN.boxed;
  const resolved = useResolvedNodeStyle(data);
  const [hovered, setHovered] = useState(false);
  const showHandles = hovered || selected;

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
        "group/node relative flex flex-col items-center justify-center rounded-lg border px-3 py-2",
        selected && SELECTION_RING.boxed,
      )}
      style={{
        borderColor: resolved.borderColor,
        backgroundColor: resolved.backgroundColor,
        boxShadow: resolved.boxShadow,
        filter: resolved.filter,
        fontFamily: resolved.fontFamily,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NodeHandles color={data.color} size="boxed" visible={showHandles} />

      {data.icon ? (
        <EraserIcon iconId={data.icon} size={design.iconSize} className="mb-1" />
      ) : null}

      {editing ? (
        <input
          className="z-10 w-full min-w-0 bg-transparent text-center text-sm font-medium outline-none"
          value={editValue}
          onChange={(event) => setEditValue(event.target.value)}
          onBlur={commitLabel}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitLabel();
            if (event.key === "Escape") cancelEditing();
          }}
          autoFocus
        />
      ) : (
        <span
          className={cn("z-10", design.labelClass)}
          onDoubleClick={startEditing}
        >
          {data.label}
        </span>
      )}
    </div>
  );
}
