import type {
  EraserArchitectureDocument,
  EraserConnection,
  EraserElement,
  LayoutOverride,
} from "@/lib/canvas/schema";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import { withoutLegendOverride } from "@/lib/canvas/layout/overrides";

function serializeElement(element: EraserElement): string {
  const props = [
    element.name,
    element.isGroup ? "{}" : "",
    element.properties.icon ?? "",
    element.properties.color ?? "",
    element.properties.label ?? "",
    element.properties.link ?? "",
    element.properties.colorMode ?? "",
    element.properties.styleMode ?? "",
    element.properties.typeface ?? "",
    ...element.children.map(serializeElement),
  ].join("|");
  return props;
}

function serializeConnection(connection: EraserConnection): string {
  return [
    connection.source,
    connection.target,
    connection.connector,
    connection.label ?? "",
    connection.color ?? "",
  ].join("|");
}

/** Stable key for document structure — ignores layout positions. */
export function getDocumentStructureKey(document: EraserArchitectureDocument): string {
  const styleKey = [
    document.style.direction,
    document.style.colorMode,
    document.style.styleMode,
    document.style.typeface,
  ].join(",");

  const elementsKey = document.elements
    .map(serializeElement)
    .sort()
    .join(";");

  const connectionsKey = document.connections
    .map(serializeConnection)
    .sort()
    .join(";");

  const legendKey = document.legend ? JSON.stringify(document.legend) : "";

  return `${styleKey}::${elementsKey}::${connectionsKey}::${legendKey}`;
}

/** Stable key from canvas nodes/edges (fallback when document not synced). */
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
        n.data.colorMode ?? "",
        n.data.styleMode ?? "",
        n.data.typeface ?? "",
        n.data.link ?? "",
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
        e.data?.strokeStyle ?? "",
        e.data?.connector ?? "",
        e.data?.bendPoint ? `${e.data.bendPoint.x},${e.data.bendPoint.y}` : "",
        e.type ?? "",
      ].join("|"),
    )
    .sort()
    .join(";");

  return `${nodeKey}::${edgeKey}`;
}

export function hasLayoutOverrides(
  overrides: Record<string, LayoutOverride>,
): boolean {
  return Object.keys(withoutLegendOverride(overrides)).length > 0;
}
