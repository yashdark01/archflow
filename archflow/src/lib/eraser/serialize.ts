import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import type { EraserArchitectureDocument } from "@/lib/canvas/schema";
import { serializeDocument } from "@/lib/canvas/document/serializeDocument";
import { diagramToDocument } from "@/lib/canvas/document/fromDiagram";

export function diagramToDsl(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  meta?: Partial<Pick<EraserArchitectureDocument, "title" | "style" | "legend">>,
): string {
  const document = diagramToDocument(nodes, edges, meta);
  return serializeDocument(document);
}
