import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import { getNodeEraserName } from "@/lib/eraser/eraserNames";
import { serializeConnectionLine } from "@/lib/eraser/connectionDsl";
import { ERASER_COLOR_MAP } from "@/lib/eraser/colors";

function buildProps(node: DiagramNode): string {
  const parts: string[] = [];
  if (node.data.icon) parts.push(`icon: ${node.data.icon}`);
  if (node.data.color && node.data.nodeType === "group") {
    const normalized = node.data.color.toLowerCase();
    let colorName = `"${node.data.color}"`;
    for (const [name, value] of Object.entries(ERASER_COLOR_MAP)) {
      if (value.toLowerCase() === normalized) colorName = name;
    }
    parts.push(`color: ${colorName}`);
  }
  if (parts.length === 0) return "";
  return ` [${parts.join(", ")}]`;
}

function serializeChildren(
  nodes: DiagramNode[],
  parentId: string | undefined,
  indent: number,
): string {
  const pad = "  ".repeat(indent);
  const children = nodes
    .filter((node) => node.parentId === parentId)
    .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x);

  let output = "";

  for (const node of children) {
    const name = getNodeEraserName(node);
    if (node.data.nodeType === "group") {
      output += `${pad}${name}${buildProps(node)} {\n`;
      output += serializeChildren(nodes, node.id, indent + 1);
      output += `${pad}}\n`;
    } else {
      output += `${pad}${name}${buildProps(node)}\n`;
    }
  }

  return output;
}

export function diagramToDsl(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  title?: string,
): string {
  const lines: string[] = [];

  if (title && title !== "Untitled Diagram") {
    lines.push(title, "");
  }

  lines.push("direction right", "");

  const structure = serializeChildren(nodes, undefined, 0).trimEnd();
  if (structure) lines.push(structure, "");

  const idToName = new Map<string, string>();
  for (const node of nodes) {
    idToName.set(node.id, getNodeEraserName(node));
  }

  for (const edge of edges) {
    const source = idToName.get(edge.source);
    const target = idToName.get(edge.target);
    if (!source || !target) continue;
    lines.push(serializeConnectionLine(edge, source, target));
  }

  return lines.join("\n").trimEnd();
}
