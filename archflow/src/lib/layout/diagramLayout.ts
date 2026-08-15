import dagre from "dagre";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";

export type LayoutDirection = "LR" | "TD";

const H_GAP = 100;
const V_GAP = 90;
const GROUP_PAD_X = 48;
const GROUP_PAD_Y = 56;
const NODE_WIDTH = 100;
const NODE_HEIGHT = 72;
const GROUP_MIN_WIDTH = 220;
const GROUP_MIN_HEIGHT = 140;

function getNodeDimensions(node: DiagramNode): { width: number; height: number } {
  if (node.data.nodeType === "group") {
    const w = typeof node.style?.width === "number" ? node.style.width : GROUP_MIN_WIDTH;
    const h = typeof node.style?.height === "number" ? node.style.height : GROUP_MIN_HEIGHT;
    return { width: w, height: h };
  }
  return { width: NODE_WIDTH, height: NODE_HEIGHT };
}

function layoutSiblingsGrid(
  siblings: DiagramNode[],
  direction: LayoutDirection,
  offsetX: number,
  offsetY: number,
): void {
  let cursorX = offsetX + GROUP_PAD_X;
  let cursorY = offsetY + GROUP_PAD_Y;

  for (const sibling of siblings) {
    sibling.position = { x: cursorX, y: cursorY };
    const { width, height } = getNodeDimensions(sibling);

    if (direction === "LR") {
      cursorX += width + H_GAP;
    } else {
      cursorY += height + V_GAP;
    }
  }
}

function layoutWithDagre(
  nodeIds: string[],
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  direction: LayoutDirection,
  offsetX: number,
  offsetY: number,
): void {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: direction,
    nodesep: 60,
    ranksep: direction === "LR" ? 100 : 80,
    marginx: 24,
    marginy: 36,
  });

  for (const id of nodeIds) {
    const node = nodes.find((n) => n.id === id);
    if (!node) continue;
    const { width, height } = getNodeDimensions(node);
    graph.setNode(id, { width, height });
  }

  for (const edge of edges) {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(graph);

  for (const id of nodeIds) {
    const node = nodes.find((n) => n.id === id);
    const layoutNode = graph.node(id);
    if (!node || !layoutNode) continue;
    const { width, height } = getNodeDimensions(node);
    node.position = {
      x: offsetX + layoutNode.x - width / 2,
      y: offsetY + layoutNode.y - height / 2,
    };
  }
}

function resizeGroupToFitChildren(nodes: DiagramNode[], groupId: string): void {
  const group = nodes.find((n) => n.id === groupId);
  if (!group) return;

  const children = nodes.filter((n) => n.parentId === groupId);
  if (children.length === 0) return;

  let maxX = 0;
  let maxY = 0;

  for (const child of children) {
    const { width, height } = getNodeDimensions(child);
    maxX = Math.max(maxX, child.position.x + width);
    maxY = Math.max(maxY, child.position.y + height);
  }

  group.style = {
    width: Math.max(GROUP_MIN_WIDTH, maxX + GROUP_PAD_X),
    height: Math.max(GROUP_MIN_HEIGHT, maxY + GROUP_PAD_Y),
  };
}

function layoutChildren(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  parentId: string,
  direction: LayoutDirection,
): void {
  const children = nodes.filter((node) => node.parentId === parentId);
  if (children.length === 0) return;

  const childIds = children.map((c) => c.id);
  const internalEdges = edges.filter((edge) => {
    return childIds.includes(edge.source) && childIds.includes(edge.target);
  });

  if (internalEdges.length > 0 && children.length > 1) {
    layoutWithDagre(childIds, nodes, internalEdges, direction, 0, 0);
  } else {
    layoutSiblingsGrid(children, direction, 0, 0);
  }

  for (const child of children) {
    if (child.data.nodeType === "group") {
      layoutChildren(nodes, edges, child.id, direction);
      resizeGroupToFitChildren(nodes, child.id);
    }
  }
}

export function applyDiagramLayout(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  direction: LayoutDirection = "LR",
): DiagramNode[] {
  const cloned = nodes.map((node) => ({
    ...node,
    position: { ...node.position },
    data: { ...node.data },
    style: node.style ? { ...node.style } : undefined,
  }));

  const roots = cloned.filter((node) => !node.parentId);
  const rootIds = roots.map((r) => r.id);
  const rootEdges = edges.filter(
    (edge) => rootIds.includes(edge.source) && rootIds.includes(edge.target),
  );

  if (rootEdges.length > 0 && roots.length > 1) {
    layoutWithDagre(rootIds, cloned, rootEdges, direction, 80, 80);
  } else {
    layoutSiblingsGrid(roots, direction, 80, 80);
  }

  for (const root of roots) {
    if (root.data.nodeType === "group") {
      layoutChildren(cloned, edges, root.id, direction);
      resizeGroupToFitChildren(cloned, root.id);
    }
  }

  return cloned;
}
