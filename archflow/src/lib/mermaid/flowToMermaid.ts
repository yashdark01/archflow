import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import { escapeMermaidLabel, toMermaidId } from "@/lib/mermaid/sanitize";

export type MermaidDirection = "LR" | "TD";

function nodeMermaidSyntax(id: string, label: string, nodeType: DiagramNode["data"]["nodeType"]): string {
  const safe = escapeMermaidLabel(label);
  switch (nodeType) {
    case "database":
      return `${id}[("${safe}")]`;
    case "user":
      return `${id}(("${safe}"))`;
    case "queue":
    case "cache":
      return `${id}{"${safe}"}`;
    default:
      return `${id}["${safe}"]`;
  }
}

function edgeMermaidSyntax(
  sourceId: string,
  targetId: string,
  edge: DiagramEdge,
): string {
  const label = edge.data?.label?.trim();
  const arrow = edge.data?.arrowDirection ?? "forward";
  const labelPart = label ? `|"${escapeMermaidLabel(label)}"| ` : "";

  switch (arrow) {
    case "backward":
      return `${targetId} -->${labelPart}${sourceId}`;
    case "bidirectional":
      return `${sourceId} <-->${labelPart}${targetId}`;
    case "none":
      return `${sourceId} ---${labelPart}${targetId}`;
    default:
      return `${sourceId} -->${labelPart}${targetId}`;
  }
}

function serializeGroup(
  nodes: DiagramNode[],
  groupId: string,
  idMap: Map<string, string>,
  lines: string[],
  indent: number,
): void {
  const pad = "  ".repeat(indent);
  const group = nodes.find((n) => n.id === groupId);
  if (!group) return;

  const mermaidId = idMap.get(groupId)!;
  const label = escapeMermaidLabel(group.data.label);
  lines.push(`${pad}subgraph ${mermaidId} ["${label}"]`);

  const children = nodes.filter((n) => n.parentId === groupId);
  for (const child of children) {
    if (child.data.nodeType === "group") {
      serializeGroup(nodes, child.id, idMap, lines, indent + 1);
    } else {
      const childId = idMap.get(child.id)!;
      lines.push(
        `${pad}  ${nodeMermaidSyntax(childId, child.data.label, child.data.nodeType)}`,
      );
    }
  }

  lines.push(`${pad}end`);
}

export function flowToMermaid(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  direction: MermaidDirection = "LR",
): string {
  if (nodes.length === 0) {
    return `graph ${direction}\n  Empty["Add nodes to the canvas"]`;
  }

  const usedIds = new Set<string>();
  const idMap = new Map<string, string>();

  for (const node of nodes) {
    idMap.set(node.id, toMermaidId(node, usedIds));
  }

  const lines: string[] = [`graph ${direction}`];

  const roots = nodes.filter((n) => !n.parentId);
  for (const node of roots) {
    if (node.data.nodeType === "group") {
      serializeGroup(nodes, node.id, idMap, lines, 1);
    } else {
      const mermaidId = idMap.get(node.id)!;
      lines.push(
        `  ${nodeMermaidSyntax(mermaidId, node.data.label, node.data.nodeType)}`,
      );
    }
  }

  lines.push("");

  for (const edge of edges) {
    const sourceId = idMap.get(edge.source);
    const targetId = idMap.get(edge.target);
    if (!sourceId || !targetId) continue;
    lines.push(`  ${edgeMermaidSyntax(sourceId, targetId, edge)}`);
  }

  return lines.join("\n").trimEnd();
}
