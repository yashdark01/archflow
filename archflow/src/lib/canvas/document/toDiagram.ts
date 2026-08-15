import type { DiagramEdge, DiagramNode, DiagramSnapshot } from "@/types/diagram";
import { DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { applyCanvasLayout } from "@/lib/canvas/layout/applyLayout";
import {
  eraserDirectionToRankDir,
  layoutDirectionToRankDir,
  type LayoutDirection,
} from "@/lib/canvas/layout/direction";
import type {
  EraserArchitectureDocument,
  EraserConnection,
  EraserElement,
} from "@/lib/canvas/schema";
import { createEdge } from "@/utils/edgeFactory";
import { generateId } from "@/utils/generateId";
import { getEdgeMarkers } from "@/utils/edgeMarkers";
import { mapEraserElementToNodeData } from "@/lib/canvas/mapping/elementMapping";
import { mapEraserConnectionToEdgeData } from "@/lib/canvas/mapping/elementMapping";

export function eraserDirectionToLayout(
  direction: EraserArchitectureDocument["style"]["direction"],
): import("@/lib/canvas/layout/direction").LayoutDirection {
  const rankDir = eraserDirectionToRankDir(direction);
  return rankDir === "TB" || rankDir === "BT" ? "TD" : "LR";
}

function createDiagramNode(
  element: EraserElement,
  parentId?: string,
): DiagramNode {
  const id = generateId();
  const data = mapEraserElementToNodeData(element);

  if (element.isGroup) {
    return {
      id,
      type: "group",
      position: { x: 0, y: 0 },
      parentId,
      data,
      style: { width: 240, height: 180 },
    };
  }

  return {
    id,
    type: "service",
    position: { x: 0, y: 0 },
    parentId,
    extent: parentId ? "parent" : undefined,
    data,
  };
}

function flattenElements(
  elements: EraserElement[],
  parentId?: string,
  nodes: DiagramNode[] = [],
): Map<string, string> {
  const nameToId = new Map<string, string>();

  for (const element of elements) {
    const node = createDiagramNode(element, parentId);
    nodes.push(node);
    nameToId.set(element.name, node.id);

    if (element.isGroup && element.children.length > 0) {
      const childMap = flattenElements(element.children, node.id, nodes);
      for (const [name, id] of childMap) {
        nameToId.set(name, id);
      }
    }
  }

  return nameToId;
}

function createPlaceholderNode(name: string): DiagramNode {
  const id = generateId();
  return {
    id,
    type: "service",
    position: { x: 0, y: 0 },
    data: {
      nodeType: "service",
      label: name,
      color: NODE_DEFAULTS.service.color,
      description: "",
      borderStyle: "solid",
      eraserName: name,
    },
  };
}

function connectionToEdge(
  connection: EraserConnection,
  sourceId: string,
  targetId: string,
): DiagramEdge {
  const edgeData = mapEraserConnectionToEdgeData(connection);
  const edge = createEdge(
    {
      source: sourceId,
      target: targetId,
      sourceHandle: null,
      targetHandle: null,
    },
    DEFAULT_EDGE_TYPE,
    edgeData.color,
  );

  edge.data = {
    label: edgeData.label ?? "",
    color: edgeData.color,
    arrowDirection: edgeData.arrowDirection ?? "forward",
    strokeStyle: edgeData.strokeStyle,
    connector: connection.connector,
  };

  const arrowDirection = edgeData.arrowDirection ?? "forward";
  const markers = getEdgeMarkers(arrowDirection, edgeData.color);
  if (markers.markerEnd) edge.markerEnd = markers.markerEnd;
  else delete edge.markerEnd;
  if (markers.markerStart) edge.markerStart = markers.markerStart;
  else delete edge.markerStart;

  return edge;
}

export function documentToDiagram(
  document: EraserArchitectureDocument,
  options?: {
    applyLayout?: boolean;
    existingNodes?: DiagramNode[];
    layoutDirection?: LayoutDirection;
  },
): DiagramSnapshot {
  const nodes: DiagramNode[] = [];
  const nameToId = flattenElements(document.elements, undefined, nodes);
  const edges: DiagramEdge[] = [];

  for (const connection of document.connections) {
    let sourceId = nameToId.get(connection.source);
    let targetId = nameToId.get(connection.target);

    if (!sourceId) {
      const placeholder = createPlaceholderNode(connection.source);
      nodes.push(placeholder);
      nameToId.set(connection.source, placeholder.id);
      sourceId = placeholder.id;
    }

    if (!targetId) {
      const placeholder = createPlaceholderNode(connection.target);
      nodes.push(placeholder);
      nameToId.set(connection.target, placeholder.id);
      targetId = placeholder.id;
    }

    edges.push(connectionToEdge(connection, sourceId!, targetId!));
  }

  if (options?.existingNodes && !options.applyLayout) {
    const positionByName = new Map<string, { x: number; y: number }>();
    for (const node of options.existingNodes) {
      const key = node.data.eraserName ?? node.data.label;
      positionByName.set(key, { ...node.position });
    }
    for (const node of nodes) {
      const key = node.data.eraserName ?? node.data.label;
      const pos = positionByName.get(key);
      if (pos) node.position = pos;
    }
  }

  const rankDir = options?.layoutDirection
    ? layoutDirectionToRankDir(options.layoutDirection)
    : eraserDirectionToRankDir(document.style.direction);
  const laidOut = options?.applyLayout
    ? applyCanvasLayout({
        nodes,
        edges,
        rankDir,
      }).nodes
    : nodes;

  return { nodes: laidOut, edges };
}
