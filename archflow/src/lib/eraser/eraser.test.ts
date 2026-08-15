import { describe, expect, it } from "vitest";
import {
  parseConnectionLine,
  serializeConnectionLine,
} from "@/lib/eraser/connectionDsl";
import { dslToDiagram, parseEraserDsl } from "@/lib/eraser/parse";
import { diagramToDsl } from "@/lib/eraser/serialize";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";

function makeNode(
  id: string,
  eraserName: string,
  label = eraserName,
): DiagramNode {
  return {
    id,
    type: "service",
    position: { x: 0, y: 0 },
    data: {
      nodeType: "service",
      label,
      color: "#2563eb",
      description: "",
      borderStyle: "solid",
      eraserName,
    },
  };
}

describe("connectionDsl", () => {
  it("parses forward, backward, bidirectional, and line connections", () => {
    const forward = parseConnectionLine("API > Service: request");
    expect(forward[0]).toMatchObject({
      source: "API",
      target: "Service",
      label: "request",
      arrowDirection: "forward",
      connector: ">",
    });

    const backward = parseConnectionLine("API < Service");
    expect(backward[0]?.arrowDirection).toBe("backward");

    const bidirectional = parseConnectionLine("API <> Service");
    expect(bidirectional[0]?.arrowDirection).toBe("bidirectional");

    const line = parseConnectionLine("API - Service");
    expect(line[0]?.arrowDirection).toBe("none");
  });

  it("parses forward chains", () => {
    const chain = parseConnectionLine("A > B > C");
    expect(chain).toHaveLength(2);
    expect(chain[0]).toMatchObject({ source: "A", target: "B" });
    expect(chain[1]).toMatchObject({ source: "B", target: "C" });
  });

  it("round-trips edge direction and label through serialize", () => {
    const edge: DiagramEdge = {
      id: "e1",
      source: "a",
      target: "b",
      type: "smoothstep",
      data: {
        label: "sync",
        color: "#64748b",
        arrowDirection: "bidirectional",
      },
    };

    const line = serializeConnectionLine(edge, "API", "DB");
    expect(line).toBe("API <> DB: sync");

    const parsed = parseConnectionLine(line);
    expect(parsed[0]?.arrowDirection).toBe("bidirectional");
    expect(parsed[0]?.label).toBe("sync");
  });
});

describe("eraser dsl round-trip", () => {
  it("preserves node names and connection syntax", () => {
    const source = [
      "direction right",
      "",
      "API",
      "Service",
      "",
      "API > Service: request",
      "Service <> DB",
    ].join("\n");

    const snapshot = dslToDiagram(source, { applyLayout: false });
    const code = diagramToDsl(snapshot.nodes, snapshot.edges);

    expect(code).toContain("API");
    expect(code).toContain("Service");
    expect(code).toContain("API > Service: request");
    expect(code).toContain("Service <> DB");
  });

  it("parseEraserDsl extracts connections with connector", () => {
    const parsed = parseEraserDsl("API < Service");
    expect(parsed.connections[0]?.connector).toBe("<");
  });
});

describe("diagramToDsl", () => {
  it("uses eraserName instead of display label", () => {
    const nodes = [
      makeNode("a", "api_gateway", "API Gateway"),
      makeNode("b", "user_service", "User Service"),
    ];
    const edges: DiagramEdge[] = [
      {
        id: "e1",
        source: "a",
        target: "b",
        type: "smoothstep",
        data: { label: "", color: "#64748b", arrowDirection: "forward" },
      },
    ];

    const code = diagramToDsl(nodes, edges);
    expect(code).toContain("api_gateway > user_service");
    expect(code).toContain("label: \"API Gateway\"");
  });
});
