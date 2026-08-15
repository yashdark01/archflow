import type { DiagramNode } from "@/types/diagram";

/** Stable Mermaid node id from diagram node. */
export function toMermaidId(node: DiagramNode, usedIds: Set<string>): string {
  const base =
    (node.data.eraserName ?? node.data.label)
      .trim()
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .replace(/^(\d)/, "n_$1") || `node_${node.id.slice(0, 8)}`;

  let id = base;
  let counter = 1;
  while (usedIds.has(id)) {
    id = `${base}_${counter}`;
    counter += 1;
  }
  usedIds.add(id);
  return id;
}

export function escapeMermaidLabel(label: string): string {
  return label.replace(/"/g, '\\"');
}
