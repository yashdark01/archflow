import { describe, expect, it } from "vitest";
import {
  connectorFromEdgeData,
  edgeDataFromConnector,
  getEdgeStrokeDasharray,
  resolveEdgeVisualStyle,
} from "@/lib/canvas/style/edgeDesign";
import { parseConnectionLine } from "@/lib/eraser/connectionDsl";
import { serializeConnectionLine } from "@/lib/eraser/connectionDsl";
import type { DiagramEdge } from "@/types/diagram";

describe("edgeDesign", () => {
  it("maps Eraser connectors to arrow and stroke", () => {
    expect(edgeDataFromConnector(">")).toEqual({
      connector: ">",
      arrowDirection: "forward",
      strokeStyle: "solid",
    });
    expect(edgeDataFromConnector("--")).toEqual({
      connector: "--",
      arrowDirection: "none",
      strokeStyle: "dotted",
    });
    expect(edgeDataFromConnector("-->")).toEqual({
      connector: "-->",
      arrowDirection: "forward",
      strokeStyle: "dotted",
    });
  });

  it("derives connector from arrow and stroke", () => {
    expect(connectorFromEdgeData("forward", "solid")).toBe(">");
    expect(connectorFromEdgeData("none", "dotted")).toBe("--");
    expect(connectorFromEdgeData("forward", "dotted")).toBe("-->");
    expect(connectorFromEdgeData("forward", "dashed")).toBe(">");
  });

  it("uses distinct dash patterns for dashed vs dotted", () => {
    expect(getEdgeStrokeDasharray("dashed")).toBe("10 6");
    expect(getEdgeStrokeDasharray("dotted")).toBe("3 5");
    expect(getEdgeStrokeDasharray("solid")).toBeUndefined();
  });

  it("resolveEdgeVisualStyle prefers explicit connector", () => {
    const visual = resolveEdgeVisualStyle({ connector: "-->" });
    expect(visual.strokeStyle).toBe("dotted");
    expect(visual.strokeDasharray).toBe("3 5");
    expect(visual.arrowDirection).toBe("forward");
  });
});

describe("connection DSL round-trip", () => {
  const baseEdge: DiagramEdge = {
    id: "e1",
    source: "n1",
    target: "n2",
    type: "step",
    data: {
      label: "req",
      color: "#64748b",
      arrowDirection: "forward",
      strokeStyle: "dotted",
      connector: "-->",
    },
  };

  it("serializes dotted connectors", () => {
    expect(serializeConnectionLine(baseEdge, "A", "B")).toBe("A --> B: req");
  });

  it("parses dotted line without arrow", () => {
    const parsed = parseConnectionLine("Service -- Database");
    expect(parsed[0].connector).toBe("--");
    expect(parsed[0].strokeStyle).toBe("dotted");
    expect(parsed[0].arrowDirection).toBe("none");
  });

  it("parses dotted forward arrow", () => {
    const parsed = parseConnectionLine("A --> B: label");
    expect(parsed[0].connector).toBe("-->");
    expect(parsed[0].strokeStyle).toBe("dotted");
    expect(parsed[0].arrowDirection).toBe("forward");
    expect(parsed[0].label).toBe("label");
  });
});
