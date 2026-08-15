"use client";

import type { NodeData } from "@/types/diagram";
import { NODE_DESIGN, SELECTION_RING } from "@/lib/canvas/style/nodeDesign";
import { cn } from "@/lib/utils";
import { useNodeLabelEdit } from "@/components/canvas/nodes/useNodeLabelEdit";
import { useResolvedNodeStyle } from "@/components/canvas/nodes/useResolvedNodeStyle";

interface TextLabelNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

export function TextLabelNode({ id, data, selected }: TextLabelNodeProps) {
  const resolved = useResolvedNodeStyle(data);
  const design = NODE_DESIGN.text;
  const { editing, editValue, setEditValue, startEditing, commitLabel, cancelEditing } =
    useNodeLabelEdit(id, data.label, { isTextLabel: true });

  return (
    <div
      className={cn(
        design.rootClass,
        "max-w-[240px] px-1 py-0.5",
        selected && SELECTION_RING.text,
      )}
      style={{ fontFamily: resolved.fontFamily }}
    >
      {editing ? (
        <input
          className="nodrag nopan min-w-[5rem] max-w-[240px] bg-transparent text-sm font-medium text-foreground outline-none"
          value={editValue}
          placeholder="Label"
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
          className={design.labelClass}
          onDoubleClick={startEditing}
        >
          {data.label}
        </span>
      )}
    </div>
  );
}
