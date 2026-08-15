import type { DiagramNode } from "@/types/diagram";
import type { LegendPosition } from "@/lib/canvas/schema";

export const LEGEND_MARGIN = 24;

export interface FlowBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function computeNodesFlowBounds(nodes: DiagramNode[]): FlowBounds {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 480, maxY: 320 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    const width = node.width ?? 120;
    const height = node.height ?? 48;
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  }

  return { minX, minY, maxX, maxY };
}

export function computeLegendFlowPosition(
  bounds: FlowBounds,
  position: LegendPosition | undefined,
  legendSize: { width: number; height: number },
): { x: number; y: number } {
  const resolved = position ?? "top-right";
  const { minX, minY, maxX, maxY } = bounds;
  const margin = LEGEND_MARGIN;
  const centerX = (minX + maxX) / 2 - legendSize.width / 2;
  const centerY = (minY + maxY) / 2 - legendSize.height / 2;

  switch (resolved) {
    case "top-left":
      return { x: minX + margin, y: minY + margin };
    case "top-right":
      return { x: maxX - legendSize.width - margin, y: minY + margin };
    case "bottom-left":
      return { x: minX + margin, y: maxY - legendSize.height - margin };
    case "bottom-right":
      return { x: maxX - legendSize.width - margin, y: maxY - legendSize.height - margin };
    case "top":
      return { x: centerX, y: minY + margin };
    case "bottom":
      return { x: centerX, y: maxY - legendSize.height - margin };
    case "left":
      return { x: minX + margin, y: centerY };
    case "right":
      return { x: maxX - legendSize.width - margin, y: centerY };
    default:
      return { x: maxX - legendSize.width - margin, y: minY + margin };
  }
}
