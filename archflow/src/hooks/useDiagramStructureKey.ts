"use client";

import { useMemo } from "react";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import { getDiagramStructureKey } from "@/lib/canvas/layout/structureKey";

export { getDiagramStructureKey } from "@/lib/canvas/layout/structureKey";
export { getDocumentStructureKey } from "@/lib/canvas/layout/structureKey";

export function useDiagramStructureKey(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
): string {
  return useMemo(() => getDiagramStructureKey(nodes, edges), [nodes, edges]);
}
