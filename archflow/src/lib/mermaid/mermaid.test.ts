import { describe, expect, it } from "vitest";
import { flowToMermaid } from "@/lib/mermaid/flowToMermaid";
import { parseMermaid } from "@/lib/mermaid/mermaidToFlow";
import { DEFAULT_MERMAID_CODE } from "@/lib/mermaid/defaultCode";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";

function makeNode(
  id: string,
  label: string,
  nodeType: DiagramNode["data"]["nodeType"],
  parentId?: string,
): DiagramNode {
  return {
    id,
    type: nodeType === "group" ? "group" : "service",
    position: { x: 0, y: 0 },
    parentId,
    extent: parentId ? "parent" : undefined,
    data: {
      nodeType,
      label,
      color: "#2563eb",
      description: "",
      borderStyle: nodeType === "group" ? "dashed" : "solid",
      eraserName: label.replace(/\s+/g, "_"),
    },
    style: nodeType === "group" ? { width: 240, height: 180 } : undefined,
  };
}

describe("flowToMermaid", () => {
  it("serializes nodes and edges", () => {
    const nodes = [
      makeNode("a", "API", "apiGateway"),
      makeNode("b", "Service", "service"),
      makeNode("c", "Database", "database"),
    ];
    const edges: DiagramEdge[] = [
      {
        id: "e1",
        source: "a",
        target: "b",
        type: "smoothstep",
        data: { label: "HTTP", color: "#64748b", arrowDirection: "forward" },
      },
      {
        id: "e2",
        source: "b",
        target: "c",
        type: "smoothstep",
        data: { label: "", color: "#64748b", arrowDirection: "forward" },
      },
    ];

    const code = flowToMermaid(nodes, edges, "LR");
    expect(code).toContain("graph LR");
    expect(code).toContain("API");
    expect(code).toContain("Service");
    expect(code).toContain("Database");
    expect(code).toContain("-->|\"HTTP\"|");
  });
});

describe("parseMermaid", () => {
  it("parses default sample diagram", () => {
    const result = parseMermaid(DEFAULT_MERMAID_CODE);
    expect("snapshot" in result).toBe(true);
    if (!("snapshot" in result)) return;
    expect(result.snapshot.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.snapshot.edges.length).toBeGreaterThanOrEqual(3);
  });

  it("round-trips structure", () => {
    const initial = parseMermaid(DEFAULT_MERMAID_CODE);
    if (!("snapshot" in initial)) throw new Error("parse failed");

    const code = flowToMermaid(
      initial.snapshot.nodes,
      initial.snapshot.edges,
      "LR",
    );
    const again = parseMermaid(code);
    if (!("snapshot" in again)) throw new Error("round-trip parse failed");

    expect(again.snapshot.nodes.length).toBe(initial.snapshot.nodes.length);
    expect(again.snapshot.edges.length).toBe(initial.snapshot.edges.length);
  });

  it("round-trips a 50-node graph structure", () => {
    const nodes = Array.from({ length: 50 }, (_, i) =>
      makeNode(`n${i}`, `Service ${i}`, "service"),
    );
    const edges: DiagramEdge[] = Array.from({ length: 49 }, (_, i) => ({
      id: `e${i}`,
      source: `n${i}`,
      target: `n${i + 1}`,
      type: "step",
      data: { label: "", color: "#64748b", arrowDirection: "forward" },
    }));

    const code = flowToMermaid(nodes, edges, "LR");
    const parsed = parseMermaid(code);
    if (!("snapshot" in parsed)) throw new Error("parse failed");

    expect(parsed.snapshot.nodes.length).toBe(50);
    expect(parsed.snapshot.edges.length).toBe(49);
  });

  it("returns error for invalid syntax", () => {
    const result = parseMermaid("graph LR\n  ??? invalid");
    expect("message" in result && !("snapshot" in result)).toBe(true);
  });
});
