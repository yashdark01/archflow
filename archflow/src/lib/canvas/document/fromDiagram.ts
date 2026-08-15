import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import type {
  EraserArchitectureDocument,
  EraserConnection,
  EraserElement,
  EraserElementProperties,
} from "@/lib/canvas/schema";
import { ERASER_DIAGRAM_STYLE_DEFAULTS } from "@/lib/canvas/schema";
import { getNodeEraserName } from "@/lib/eraser/eraserNames";
import { ERASER_COLOR_MAP } from "@/lib/eraser/colors";
import { connectorFromEdge } from "@/lib/canvas/document/serializeDocument";

function colorToEraserName(hex: string): string | undefined {
  const normalized = hex.toLowerCase();
  for (const [name, value] of Object.entries(ERASER_COLOR_MAP)) {
    if (value.toLowerCase() === normalized) return name;
  }
  return hex.startsWith("#") ? hex : undefined;
}

function nodeToElementProperties(node: DiagramNode): EraserElementProperties {
  const props: EraserElementProperties = {};
  const data = node.data;

  if (data.icon) props.icon = data.icon;
  if (data.color) {
    const colorName = colorToEraserName(data.color);
    if (colorName) props.color = colorName;
  }
  if (data.label && data.label !== getNodeEraserName(node)) {
    props.label = data.label;
  }
  if (data.link) props.link = data.link;
  if (data.colorMode) props.colorMode = data.colorMode;
  if (data.styleMode) props.styleMode = data.styleMode;
  if (data.typeface) props.typeface = data.typeface;

  return props;
}

function buildElementTree(
  nodes: DiagramNode[],
  parentId: string | undefined,
): EraserElement[] {
  const children = nodes
    .filter((node) => node.parentId === parentId)
    .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x);

  return children.map((node) => {
    const isGroup = node.data.nodeType === "group";
    return {
      name: getNodeEraserName(node),
      properties: nodeToElementProperties(node),
      isGroup,
      children: isGroup ? buildElementTree(nodes, node.id) : [],
    };
  });
}

export function diagramToDocument(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  meta?: Partial<Pick<EraserArchitectureDocument, "title" | "style" | "legend">>,
): EraserArchitectureDocument {
  const connections: EraserConnection[] = [];
  const idToName = new Map<string, string>();
  for (const node of nodes) {
    idToName.set(node.id, getNodeEraserName(node));
  }

  for (const edge of edges) {
    const source = idToName.get(edge.source);
    const target = idToName.get(edge.target);
    if (!source || !target) continue;

    const arrowDirection = edge.data?.arrowDirection ?? "forward";
    const strokeStyle = edge.data?.strokeStyle;
    const connector =
      edge.data?.connector ??
      connectorFromEdge(arrowDirection, strokeStyle);

    let color: string | undefined;
    if (edge.data?.color) {
      color = colorToEraserName(edge.data.color) ?? edge.data.color;
    }

    connections.push({
      source,
      target,
      label: edge.data?.label?.trim() || undefined,
      color,
      connector,
    });
  }

  const document: EraserArchitectureDocument = {
    title: meta?.title,
    style: meta?.style ?? { ...ERASER_DIAGRAM_STYLE_DEFAULTS },
    elements: buildElementTree(nodes, undefined),
    connections,
  };

  if (meta?.legend && (meta.legend.items.length > 0 || meta.legend.position)) {
    document.legend = meta.legend;
  }

  return document;
}
