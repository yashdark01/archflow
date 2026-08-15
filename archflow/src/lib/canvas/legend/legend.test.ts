import { describe, expect, it } from "vitest";
import { parseDocument } from "@/lib/canvas/document/parseDocument";
import { serializeDocument } from "@/lib/canvas/document/serializeDocument";
import { structuralEqual } from "@/lib/canvas/document/validateDocument";
import {
  computeLegendFlowPosition,
  computeNodesFlowBounds,
} from "@/lib/canvas/legend/legendPosition";
import { getLegendLayoutOverride } from "@/lib/canvas/layout/overrides";
import { LEGEND_OVERRIDE_KEY } from "@/lib/canvas/legend/constants";
import type { DiagramNode } from "@/types/diagram";

describe("legend DSL", () => {
  it("parses and serializes legend blocks", () => {
    const source = [
      "direction right",
      "Node [icon: aws-ec2]",
      "",
      "legend [position: bottom-left] {",
      "  [connection: -->, label: Async]",
      "  [color: red, label: Error]",
      "  [icon: aws-lambda, label: Lambda]",
      "  [shape: diamond, label: Decision]",
      "}",
    ].join("\n");

    const doc = parseDocument(source);
    expect(doc.legend?.position).toBe("bottom-left");
    expect(doc.legend?.items).toHaveLength(4);
    expect(doc.legend?.items[0]).toMatchObject({
      connection: "-->",
      label: "Async",
    });

    const roundTrip = parseDocument(serializeDocument(doc));
    expect(structuralEqual(doc, roundTrip)).toBe(true);
  });
});

describe("legendPosition", () => {
  const nodes: DiagramNode[] = [
    {
      id: "a",
      type: "archflow",
      position: { x: 100, y: 80 },
      data: {
        nodeType: "cloud",
        label: "A",
        color: "#3b82f6",
        icon: "aws-ec2",
        description: "",
        borderStyle: "solid",
      },
      width: 120,
      height: 60,
    },
    {
      id: "b",
      type: "archflow",
      position: { x: 320, y: 200 },
      data: {
        nodeType: "cloud",
        label: "B",
        color: "#22c55e",
        icon: "aws-s3",
        description: "",
        borderStyle: "solid",
      },
      width: 120,
      height: 60,
    },
  ];

  it("computes bounds from node geometry", () => {
    const bounds = computeNodesFlowBounds(nodes);
    expect(bounds.minX).toBe(100);
    expect(bounds.minY).toBe(80);
    expect(bounds.maxX).toBe(440);
    expect(bounds.maxY).toBe(260);
  });

  it("anchors legend to top-right by default", () => {
    const bounds = computeNodesFlowBounds(nodes);
    const position = computeLegendFlowPosition(bounds, undefined, {
      width: 160,
      height: 80,
    });
    expect(position.x).toBe(bounds.maxX - 160 - 24);
    expect(position.y).toBe(bounds.minY + 24);
  });

  it("reads manual legend position from layout overrides", () => {
    const overrides = {
      [LEGEND_OVERRIDE_KEY]: { x: 42, y: 84 },
    };
    expect(getLegendLayoutOverride(overrides)).toEqual({ x: 42, y: 84 });
  });
});
