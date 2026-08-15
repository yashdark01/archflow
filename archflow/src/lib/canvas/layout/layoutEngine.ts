import dagre from "dagre";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import { measureNodeForLayout } from "@/lib/canvas/layout/nodeDimensions";
import {
  GROUP_MIN_HEIGHT,
  GROUP_MIN_WIDTH,
  GROUP_PAD_X,
  GROUP_PAD_Y,
  LAYOUT_H_GAP,
  LAYOUT_V_GAP,
  ROOT_OFFSET_X,
  ROOT_OFFSET_Y,
} from "@/lib/canvas/layout/tokens";
import {
  isHorizontalRankDir,
  type LayoutRankDir,
} from "@/lib/canvas/layout/direction";

function layoutSiblingsGrid(
  siblings: DiagramNode[],
  rankDir: LayoutRankDir,
  offsetX: number,
  offsetY: number,
): void {
  let cursorX = offsetX + GROUP_PAD_X;
  let cursorY = offsetY + GROUP_PAD_Y;

  for (const sibling of siblings) {
    sibling.position = { x: cursorX, y: cursorY };
    const { width, height } = measureNodeForLayout(sibling);

    if (isHorizontalRankDir(rankDir)) {
      cursorX += width + LAYOUT_H_GAP;
    } else {
      cursorY += height + LAYOUT_V_GAP;
    }
  }
}

function layoutWithDagre(
  nodeIds: string[],
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  rankDir: LayoutRankDir,
  offsetX: number,
  offsetY: number,
): void {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: rankDir,
    nodesep: 60,
    ranksep: isHorizontalRankDir(rankDir) ? 100 : 80,
    marginx: 24,
    marginy: 36,
  });

  for (const id of nodeIds) {
    const node = nodes.find((n) => n.id === id);
    if (!node) continue;
    const { width, height } = measureNodeForLayout(node);
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
    const { width, height } = measureNodeForLayout(node);
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
    const { width, height } = measureNodeForLayout(child);
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
  rankDir: LayoutRankDir,
): void {
  const children = nodes.filter((node) => node.parentId === parentId);
  if (children.length === 0) return;

  const childIds = children.map((c) => c.id);
  const internalEdges = edges.filter(
    (edge) => childIds.includes(edge.source) && childIds.includes(edge.target),
  );

  if (internalEdges.length > 0 && children.length > 1) {
    layoutWithDagre(childIds, nodes, internalEdges, rankDir, 0, 0);
  } else {
    layoutSiblingsGrid(children, rankDir, 0, 0);
  }

  for (const child of children) {
    if (child.data.nodeType === "group") {
      layoutChildren(nodes, edges, child.id, rankDir);
      resizeGroupToFitChildren(nodes, child.id);
    }
  }
}

function cloneNodesForLayout(nodes: DiagramNode[]): DiagramNode[] {
  return nodes.map((node) => ({
    ...node,
    position: { ...node.position },
    data: { ...node.data },
    style: node.style ? { ...node.style } : undefined,
  }));
}

export function runLayoutEngine(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  rankDir: LayoutRankDir = "LR",
): DiagramNode[] {
  const cloned = cloneNodesForLayout(nodes);
  const roots = cloned.filter((node) => !node.parentId);
  const rootIds = roots.map((r) => r.id);
  const rootEdges = edges.filter(
    (edge) => rootIds.includes(edge.source) && rootIds.includes(edge.target),
  );

  if (rootEdges.length > 0 && roots.length > 1) {
    layoutWithDagre(rootIds, cloned, rootEdges, rankDir, ROOT_OFFSET_X, ROOT_OFFSET_Y);
  } else {
    layoutSiblingsGrid(roots, rankDir, ROOT_OFFSET_X, ROOT_OFFSET_Y);
  }

  for (const root of roots) {
    if (root.data.nodeType === "group") {
      layoutChildren(cloned, edges, root.id, rankDir);
      resizeGroupToFitChildren(cloned, root.id);
    }
  }

  return cloned;
}
