import type { DiagramEdge, DiagramNode, DiagramSnapshot } from "@/types/diagram";
import type { LayoutDirection } from "@/lib/layout/diagramLayout";
import { parseDocument } from "@/lib/canvas/document/parseDocument";
import { documentToDiagram } from "@/lib/canvas/document/toDiagram";
import { diagramToDocument } from "@/lib/canvas/document/fromDiagram";
import type {
  EraserArchitectureDocument,
  EraserElementProperties,
} from "@/lib/canvas/schema";

/** @deprecated Use EraserElementProperties from @/lib/canvas/schema */
export type EraserProperties = EraserElementProperties;

/** @deprecated Use EraserElement from @/lib/canvas/schema */
export type ParsedElement = import("@/lib/canvas/schema").EraserElement;

/** @deprecated Use EraserConnection from @/lib/canvas/schema */
export type ParsedConnection = {
  source: string;
  target: string;
  label?: string;
  color?: string;
  arrowDirection?: import("@/types/diagram").ArrowDirection;
};

export type ParseResult = EraserArchitectureDocument;

export function eraserDirectionToLayout(
  direction: EraserArchitectureDocument["style"]["direction"],
): LayoutDirection {
  return direction === "up" || direction === "down" ? "TD" : "LR";
}

export function parseEraserDsl(source: string): ParseResult {
  return parseDocument(source);
}

export function dslToDiagram(
  source: string,
  options?: {
    applyLayout?: boolean;
    existingNodes?: DiagramNode[];
    layoutDirection?: LayoutDirection;
  },
): DiagramSnapshot {
  const document = parseDocument(source);
  return documentToDiagram(document, options);
}

export function diagramFromDocument(document: EraserArchitectureDocument): DiagramSnapshot {
  return documentToDiagram(document, { applyLayout: true });
}

export function documentFromDiagram(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  title?: string,
): EraserArchitectureDocument {
  return diagramToDocument(nodes, edges, { title });
}
