"use client";

import { useAppSelector } from "@/store/hooks";
import type { NodeData } from "@/types/diagram";
import { resolveNodeDataStyle } from "@/lib/canvas/style/styleTokens";

export function useResolvedNodeStyle(data: NodeData) {
  const diagramStyle = useAppSelector((state) => state.diagram.document.style);
  return resolveNodeDataStyle(data, diagramStyle);
}
