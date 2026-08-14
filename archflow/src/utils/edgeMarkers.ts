import { MarkerType } from "reactflow";
import type { ArrowDirection } from "@/types/diagram";

export function getEdgeMarkers(
  arrowDirection: ArrowDirection,
  color: string,
): {
  markerEnd?: { type: MarkerType; color: string };
  markerStart?: { type: MarkerType; color: string };
} {
  const marker = { type: MarkerType.ArrowClosed, color };

  switch (arrowDirection) {
    case "backward":
      return { markerStart: marker };
    case "bidirectional":
      return { markerEnd: marker, markerStart: marker };
    case "none":
      return {};
    default:
      return { markerEnd: marker };
  }
}
