import { DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { applyDiagramLayout } from "@/lib/layout/diagramLayout";
import type {
  ArrowDirection,
  DiagramEdge,
  DiagramNode,
  DiagramSnapshot,
  NodeType,
} from "@/types/diagram";
import { createEdge } from "@/utils/edgeFactory";
import { generateId } from "@/utils/generateId";

export interface MermaidParseResult {
  snapshot: DiagramSnapshot;
  direction: "right" | "down";
}

export interface MermaidParseError {
  message: string;
  line?: number;
}

const GRAPH_RE = /^\s*graph\s+(LR|RL|TD|BT|TB)\s*$/i;
const SUBGRAPH_RE =
  /^\s*subgraph\s+([^\s\[]+)(?:\s*\["([^"]*)"\]|\s*\[([^\]]*)\])?\s*$/i;
const END_RE = /^\s*end\s*$/i;
const NODE_RE =
  /^\s*([A-Za-z_][\w]*)\s*(?:\[\("([^"]*)"\)\]|\(\("([^"]*)"\)\)|\{"([^"]*)"\}|\["([^"]*)"\]|\[([^\]]*)\]|\(([^)]*)\))\s*$/;
const EDGE_RE =
  /^\s*([A-Za-z_][\w]*)\s*(<-->|-->|-\.->|---|<--)\s*(?:\|"?([^"|]*)"?\|)?\s*([A-Za-z_][\w]*)\s*$/;

function inferNodeType(syntax: string): NodeType {
  if (syntax.includes("[(")) return "database";
  if (syntax.includes("((")) return "user";
  if (syntax.includes("{") && !syntax.includes("{{")) return "queue";
  return "service";
}

function stripComments(source: string): string {
  return source
    .split("\n")
    .map((line) => line.replace(/%%.*$/, "").trimEnd())
    .join("\n");
}

export function parseMermaid(source: string): MermaidParseResult | MermaidParseError {
  const cleaned = stripComments(source).trim();
  if (!cleaned) {
    return { message: "Empty diagram" };
  }

  const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    return { message: "Empty diagram" };
  }

  let direction: MermaidParseResult["direction"] = "right";
  let startIdx = 0;

  if (GRAPH_RE.test(lines[0])) {
    const match = lines[0].match(GRAPH_RE);
    const dir = match?.[1]?.toUpperCase();
    if (dir === "TD" || dir === "BT" || dir === "TB") direction = "down";
    startIdx = 1;
  }

  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const idToNodeId = new Map<string, string>();
  const subgraphStack: string[] = [];

  for (let i = startIdx; i < lines.length; i += 1) {
    const line = lines[i];

    if (GRAPH_RE.test(line)) continue;

    if (END_RE.test(line)) {
      if (subgraphStack.length > 0) subgraphStack.pop();
      continue;
    }

    const subgraphMatch = line.match(SUBGRAPH_RE);
    if (subgraphMatch) {
      const mermaidId = subgraphMatch[1];
      const label = subgraphMatch[2] ?? subgraphMatch[3] ?? mermaidId;
      const parentId = subgraphStack[subgraphStack.length - 1];
      const nodeId = generateId();
      idToNodeId.set(mermaidId, nodeId);

      nodes.push({
        id: nodeId,
        type: "group",
        position: { x: 0, y: 0 },
        parentId: parentId,
        data: {
          nodeType: "group",
          label,
          color: NODE_DEFAULTS.group.color,
          description: "",
          borderStyle: "solid",
          eraserName: mermaidId,
        },
        style: { width: 240, height: 180 },
      });

      subgraphStack.push(nodeId);
      continue;
    }

    const edgeMatch = line.match(EDGE_RE);
    if (edgeMatch) {
      const left = edgeMatch[1];
      const arrow = edgeMatch[2];
      const edgeLabel = edgeMatch[3]?.trim() ?? "";
      const right = edgeMatch[4];

      let sourceMermaid = left;
      let targetMermaid = right;
      let arrowDirection: ArrowDirection = "forward";

      if (arrow === "<--") {
        sourceMermaid = right;
        targetMermaid = left;
      } else if (arrow === "<-->") {
        arrowDirection = "bidirectional";
      } else if (arrow === "---") {
        arrowDirection = "none";
      }

      const ensureNode = (mermaidId: string) => {
        if (!idToNodeId.has(mermaidId)) {
          const nodeId = generateId();
          idToNodeId.set(mermaidId, nodeId);
          const parentId = subgraphStack[subgraphStack.length - 1];
          nodes.push({
            id: nodeId,
            type: "service",
            position: { x: 0, y: 0 },
            parentId,
            extent: parentId ? "parent" : undefined,
            data: {
              nodeType: "service",
              label: mermaidId,
              color: NODE_DEFAULTS.service.color,
              description: "",
              borderStyle: "none",
              eraserName: mermaidId,
            },
          });
        }
      };

      ensureNode(sourceMermaid);
      ensureNode(targetMermaid);

      const sourceId = idToNodeId.get(sourceMermaid)!;
      const targetId = idToNodeId.get(targetMermaid)!;

      const edge = createEdge(
        { source: sourceId, target: targetId, sourceHandle: null, targetHandle: null },
        DEFAULT_EDGE_TYPE,
      );
      edge.data = {
        label: edgeLabel,
        color: edge.data?.color ?? "#64748b",
        arrowDirection,
      };
      edges.push(edge);
      continue;
    }

    const nodeMatch = line.match(NODE_RE);
    if (nodeMatch) {
      const mermaidId = nodeMatch[1];
      const label =
        nodeMatch[2] ??
        nodeMatch[3] ??
        nodeMatch[4] ??
        nodeMatch[5] ??
        nodeMatch[6] ??
        nodeMatch[7] ??
        mermaidId;
      const nodeType = inferNodeType(line);
      const parentId = subgraphStack[subgraphStack.length - 1];
      const nodeId = generateId();
      idToNodeId.set(mermaidId, nodeId);

      const defaults = NODE_DEFAULTS[nodeType];
      nodes.push({
        id: nodeId,
        type: nodeType === "group" ? "group" : "service",
        position: { x: 0, y: 0 },
        parentId,
        extent: parentId ? "parent" : undefined,
        data: {
          nodeType,
          label,
          color: defaults.color,
          description: defaults.description,
          borderStyle: nodeType === "group" ? "dashed" : "none",
          eraserName: mermaidId,
        },
        style: nodeType === "group" ? { width: 240, height: 180 } : undefined,
      });
      continue;
    }

    return { message: `Unrecognized syntax: ${line}`, line: i + 1 };
  }

  const layoutDirection = direction === "down" ? "TD" : "LR";
  const laidOut = applyDiagramLayout(nodes, edges, layoutDirection);

  return {
    snapshot: { nodes: laidOut, edges },
    direction,
  };
}

export function mermaidToFlow(source: string): DiagramSnapshot {
  const result = parseMermaid(source);
  if ("message" in result && !("snapshot" in result)) {
    throw new Error(result.message);
  }
  return (result as MermaidParseResult).snapshot;
}
