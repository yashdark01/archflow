"use client";

import { useState } from "react";
import { NodeResizer } from "reactflow";
import type { NodeData } from "@/types/diagram";
import { NodeHandles } from "@/components/canvas/nodes/NodeHandles";
import {
  NODE_DESIGN,
  SELECTION_RING,
} from "@/lib/canvas/style/nodeDesign";
import { cn } from "@/lib/utils";
import { useResolvedNodeStyle } from "@/components/canvas/nodes/useResolvedNodeStyle";

interface GroupNodeProps {
  data: NodeData;
  selected: boolean;
}

export function GroupNode({ data, selected }: GroupNodeProps) {
  const resolved = useResolvedNodeStyle(data);
  const design = NODE_DESIGN.group;
  const [hovered, setHovered] = useState(false);
  const showHandles = hovered || selected;

  return (
    <div
      className={cn(
        design.rootClass,
        "relative h-full w-full rounded-lg border-2",
        selected && SELECTION_RING.group,
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
      <NodeResizer
        isVisible={selected}
        minWidth={design.minWidth ?? 200}
        minHeight={design.minHeight ?? 120}
        lineClassName="!border-primary"
        handleClassName="!h-2.5 !w-2.5 !rounded-sm !border-2 !border-background !bg-primary"
      />
      <div
        className={cn("absolute left-3 top-2", design.labelClass)}
        style={{ color: resolved.color }}
      >
        {data.label}
      </div>
      <NodeHandles color={data.color} size="boxed" visible={showHandles} />
    </div>
  );
}
