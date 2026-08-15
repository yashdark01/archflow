"use client";

import { useMemo } from "react";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";

/** Stable key for canvas→code sync — ignores positions (manual layout). */
export function getDiagramStructureKey(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
): string {
  const nodeKey = nodes
    .map((n) =>
      [
        n.id,
        n.parentId ?? "",
        n.data.eraserName ?? "",
        n.data.label,
        n.data.nodeType,
        n.data.icon ?? "",
        n.data.color,
        n.data.borderStyle,
      ].join("|"),
    )
    .sort()
    .join(";");

  const edgeKey = edges
    .map((e) =>
      [
        e.id,
        e.source,
        e.target,
        e.data?.label ?? "",
        e.data?.color ?? "",
        e.data?.arrowDirection ?? "forward",
        e.data?.bendPoint
          ? `${e.data.bendPoint.x},${e.data.bendPoint.y}`
          : "",
        e.type ?? "",
      ].join("|"),
    )
    .sort()
    .join(";");

  return `${nodeKey}::${edgeKey}`;
}

export function useDiagramStructureKey(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
): string {
  return useMemo(() => getDiagramStructureKey(nodes, edges), [nodes, edges]);
}
