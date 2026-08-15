"use client";

import { useAppSelector } from "@/store/hooks";
import { getEdgePathForType } from "@/lib/edges/edgePaths";
import {
  connectorFromEdgeData,
  connectorShowsEndArrow,
  connectorShowsStartArrow,
  getConnectorPreviewDasharray,
} from "@/lib/canvas/style/edgeDesign";
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
  const activeArrowDirection = useAppSelector(
    (state) => state.ui.activeArrowDirection,
  );
  const activeStrokeStyle = useAppSelector((state) => state.ui.activeStrokeStyle);

  const connector = connectorFromEdgeData(
    activeArrowDirection,
    activeStrokeStyle,
  );
  const strokeDasharray = getConnectorPreviewDasharray(connector);

  const [path] = getEdgePathForType(activeEdgeType, {
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  const showEnd = connectorShowsEndArrow(connector);
  const showStart = connectorShowsStartArrow(connector);

  return (
    <g className="archflow-connection-preview">
      <defs>
        <marker
          id="archflow-preview-arrow-end"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--primary)" />
        </marker>
        <marker
          id="archflow-preview-arrow-start"
          markerWidth="8"
          markerHeight="8"
          refX="1"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M8,0 L0,4 L8,8 Z" fill="var(--primary)" />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2}
        strokeDasharray={strokeDasharray}
        strokeLinecap={strokeDasharray ? "round" : "butt"}
        className="archflow-connection-line"
        markerEnd={showEnd ? "url(#archflow-preview-arrow-end)" : undefined}
        markerStart={showStart ? "url(#archflow-preview-arrow-start)" : undefined}
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
