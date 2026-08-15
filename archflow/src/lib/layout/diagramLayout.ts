import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import {
  applyCanvasLayout,
  type LayoutDirection,
} from "@/lib/canvas/layout";

export type { LayoutDirection };

/** Backward-compatible layout API for mermaid and legacy callers. */
export function applyDiagramLayout(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  direction: LayoutDirection = "LR",
): DiagramNode[] {
  return applyCanvasLayout({
    nodes,
    edges,
    layoutDirection: direction,
  }).nodes;
}
