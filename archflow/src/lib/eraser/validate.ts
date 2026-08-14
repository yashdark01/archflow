import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import { getNodeEraserName } from "@/lib/eraser/eraserNames";

export interface DiagramValidationIssue {
  code: string;
  message: string;
  edgeId?: string;
  nodeName?: string;
}

export function validateDiagram(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
): DiagramValidationIssue[] {
  const issues: DiagramValidationIssue[] = [];
  const nameToIds = new Map<string, string[]>();

  for (const node of nodes) {
    const name = getNodeEraserName(node);
    const list = nameToIds.get(name) ?? [];
    list.push(node.id);
    nameToIds.set(name, list);
  }

  for (const [name, ids] of nameToIds) {
    if (ids.length > 1) {
      issues.push({
        code: "duplicate_name",
        message: `Duplicate DSL name "${name}" — connections may attach to the wrong node`,
        nodeName: name,
      });
    }
  }

  const nodeIds = new Set(nodes.map((n) => n.id));

  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      issues.push({
        code: "dangling_source",
        message: `Connection source node missing (edge ${edge.id})`,
        edgeId: edge.id,
      });
    }
    if (!nodeIds.has(edge.target)) {
      issues.push({
        code: "dangling_target",
        message: `Connection target node missing (edge ${edge.id})`,
        edgeId: edge.id,
      });
    }
    if (edge.source === edge.target) {
      issues.push({
        code: "self_loop",
        message: `Self-connection on node`,
        edgeId: edge.id,
      });
    }
  }

  return issues;
}

export function formatValidationSummary(issues: DiagramValidationIssue[]): string {
  if (issues.length === 0) return "";
  return issues.map((i) => i.message).join("\n");
}
