"use client";

import { memo } from "react";
import { BaseEdge, type EdgeProps } from "reactflow";
import { EdgeBendHandle } from "@/components/canvas/edges/EdgeBendHandle";
import { EdgeCanvasLabel } from "@/components/canvas/edges/EdgeCanvasLabel";
import { DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";
import { getDefaultBendPoint, getEdgePathForType } from "@/lib/edges/edgePaths";
import { resolveEdgeVisualStyle } from "@/lib/canvas/style/edgeDesign";
import type { EdgeData, EdgeType } from "@/types/diagram";

function CustomEdgeComponent(props: EdgeProps<EdgeData>) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
    style,
    markerEnd,
    markerStart,
  } = props;
  const edgeType = ((props as EdgeProps<EdgeData> & { type?: EdgeType }).type ??
    DEFAULT_EDGE_TYPE) as EdgeType;

  const visual = resolveEdgeVisualStyle({
    connector: data?.connector,
    arrowDirection: data?.arrowDirection,
    strokeStyle: data?.strokeStyle,
  });

  const color = data?.color ?? "#64748b";
  const label = data?.label ?? "";
  const bendPoint = data?.bendPoint;
  const strokeWidth = data?.strokeWidth ?? 2;

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  const [edgePath, labelX, labelY] = getEdgePathForType(
    edgeType,
    pathParams,
    bendPoint,
  );

  const handleBend = bendPoint ?? getDefaultBendPoint(pathParams);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        interactionWidth={24}
        style={{
          ...style,
          stroke: selected ? "var(--primary)" : color,
          strokeWidth: selected ? strokeWidth + 0.5 : strokeWidth,
          strokeDasharray: visual.strokeDasharray,
          strokeLinecap: visual.strokeStyle === "dotted" ? "round" : "butt",
        }}
      />
      <EdgeCanvasLabel
        edgeId={id}
        label={label}
        x={labelX}
        y={labelY}
        selected={selected}
      />
      <EdgeBendHandle
        edgeId={id}
        x={handleBend.x}
        y={handleBend.y}
        selected={selected}
        customBend={Boolean(bendPoint)}
      />
    </>
  );
}

export const CustomEdge = memo(CustomEdgeComponent);
