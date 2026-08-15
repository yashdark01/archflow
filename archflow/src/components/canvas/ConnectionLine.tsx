"use client";

import { useAppSelector } from "@/store/hooks";
import { getEdgePathForType } from "@/lib/edges/edgePaths";
import type { ConnectionLineComponentProps } from "reactflow";

export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}: ConnectionLineComponentProps) {
  const activeEdgeType = useAppSelector((state) => state.ui.activeEdgeType);

  const [path] = getEdgePathForType(activeEdgeType, {
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g className="archflow-connection-preview">
      <path
        d={path}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2}
        strokeDasharray="8 5"
        className="archflow-connection-line"
      />
      <circle
        cx={toX}
        cy={toY}
        r={4}
        fill="var(--primary)"
        className="archflow-connection-dot"
      />
    </g>
  );
}
