import type { Connection } from "reactflow";
import {
  DEFAULT_EDGE_COLOR,
  DEFAULT_EDGE_STROKE_WIDTH,
} from "@/constants/edgeDefaults";
import { connectorFromEdgeData } from "@/lib/canvas/style/edgeDesign";
import type {
  ArrowDirection,
  DiagramEdge,
  EdgeStrokeStyle,
  EdgeType,
} from "@/types/diagram";
import { generateId } from "@/utils/generateId";
import { getEdgeMarkers } from "@/utils/edgeMarkers";

export function createEdge(
  connection: Connection,
  edgeType: EdgeType,
  color = DEFAULT_EDGE_COLOR,
  options?: {
    arrowDirection?: ArrowDirection;
    strokeWidth?: number;
    strokeStyle?: EdgeStrokeStyle;
    connector?: import("@/lib/canvas/schema").EraserConnector;
  },
): DiagramEdge {
  const arrowDirection = options?.arrowDirection ?? "forward";
  const strokeStyle = options?.strokeStyle ?? "solid";
  const connector =
    options?.connector ?? connectorFromEdgeData(arrowDirection, strokeStyle);
  const markers = getEdgeMarkers(arrowDirection, color);

  return {
    id: generateId(),
    source: connection.source!,
    target: connection.target!,
    sourceHandle: connection.sourceHandle ?? undefined,
    targetHandle: connection.targetHandle ?? undefined,
    type: edgeType,
    reconnectable: true,
    data: {
      label: "",
      color,
      arrowDirection,
      strokeWidth: options?.strokeWidth ?? DEFAULT_EDGE_STROKE_WIDTH,
      strokeStyle,
      connector,
    },
    ...markers,
  };
}
