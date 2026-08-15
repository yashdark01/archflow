import type { DiagramNode } from "@/types/diagram";

/** Sanitize a display label into a valid Eraser DSL node identifier. */
export function slugifyEraserName(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "Node";
  const slug = trimmed
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  if (!slug) return "Node";
  if (/^\d/.test(slug)) return `N_${slug}`;
  return slug;
}

export function ensureUniqueEraserName(
  nodes: DiagramNode[],
  baseName: string,
  excludeNodeId?: string,
): string {
  const taken = new Set<string>();
  for (const node of nodes) {
    if (node.id === excludeNodeId) continue;
    const name = node.data.eraserName ?? node.data.label;
    taken.add(name);
  }

  if (!taken.has(baseName)) return baseName;

  let i = 2;
  while (taken.has(`${baseName}_${i}`)) i += 1;
  return `${baseName}_${i}`;
}

export function assignEraserName(
  nodes: DiagramNode[],
  label: string,
  excludeNodeId?: string,
): string {
  return ensureUniqueEraserName(nodes, slugifyEraserName(label), excludeNodeId);
}

export function getNodeEraserName(node: DiagramNode): string {
  return node.data.eraserName ?? node.data.label;
}
