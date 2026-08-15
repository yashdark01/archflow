import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseDocument } from "@/lib/canvas/document/parseDocument";
import { documentToDiagram } from "@/lib/canvas/document/toDiagram";
import { applyCanvasLayout } from "@/lib/canvas/layout/applyLayout";
import {
  captureLayoutOverrides,
  applyLayoutOverrides,
} from "@/lib/canvas/layout/overrides";
import {
  eraserDirectionToRankDir,
  layoutDirectionToRankDir,
} from "@/lib/canvas/layout/direction";

const awsExample = readFileSync(
  path.join(process.cwd(), "src/lib/eraser/reference/examples/aws-diagram.eraser"),
  "utf8",
);

function assertSpread(nodes: { position: { x: number; y: number } }[]) {
  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const xSpread = Math.max(...xs) - Math.min(...xs);
  const ySpread = Math.max(...ys) - Math.min(...ys);
  expect(xSpread + ySpread).toBeGreaterThan(50);
}

describe("canvas layout engine", () => {
  it("maps Eraser directions to dagre rankdir", () => {
    expect(eraserDirectionToRankDir("right")).toBe("LR");
    expect(eraserDirectionToRankDir("left")).toBe("RL");
    expect(eraserDirectionToRankDir("down")).toBe("TB");
    expect(eraserDirectionToRankDir("up")).toBe("BT");
    expect(layoutDirectionToRankDir("TD")).toBe("TB");
    expect(layoutDirectionToRankDir("LR")).toBe("LR");
  });

  it("lays out AWS example horizontally (direction right)", () => {
    const doc = parseDocument(awsExample);
    const { nodes, edges } = documentToDiagram(doc, { applyLayout: false });
    const { nodes: laidOut } = applyCanvasLayout({
      nodes,
      edges,
      eraserDirection: "right",
    });
    const roots = laidOut.filter((n) => !n.parentId);
    assertSpread(roots);
  });

  it("lays out AWS example vertically (direction down)", () => {
    const doc = parseDocument(awsExample);
    doc.style.direction = "down";
    const { nodes, edges } = documentToDiagram(doc, { applyLayout: false });
    const { nodes: laidOut } = applyCanvasLayout({
      nodes,
      edges,
      eraserDirection: "down",
    });
    const roots = laidOut.filter((n) => !n.parentId);
    const ySpread =
      Math.max(...roots.map((n) => n.position.y)) -
      Math.min(...roots.map((n) => n.position.y));
    expect(ySpread).toBeGreaterThan(80);
  });

  it("preserves manual overrides after auto layout", () => {
    const doc = parseDocument("A\nB\nA > B");
    const { nodes, edges } = documentToDiagram(doc, { applyLayout: true });
    const moved = nodes.map((n) =>
      n.data.eraserName === "A"
        ? { ...n, position: { x: 400, y: 300 } }
        : n,
    );
    const overrides = captureLayoutOverrides(moved);
    const { nodes: relayouted } = applyCanvasLayout({
      nodes: moved,
      edges,
      eraserDirection: "right",
      layoutOverrides: overrides,
    });
    const nodeA = relayouted.find((n) => n.data.eraserName === "A");
    expect(nodeA?.position).toEqual({ x: 400, y: 300 });
  });

  it("clears overrides when relayouting without them", () => {
    const doc = parseDocument("A\nB");
    const { nodes, edges } = documentToDiagram(doc, { applyLayout: true });
    const overrides = { A: { x: 500, y: 500 } };
    const withOverrides = applyLayoutOverrides(nodes, overrides);
    const { nodes: fresh } = applyCanvasLayout({
      nodes: withOverrides,
      edges,
      eraserDirection: "right",
      layoutOverrides: {},
    });
    const nodeA = fresh.find((n) => n.data.eraserName === "A");
    expect(nodeA?.position).not.toEqual({ x: 500, y: 500 });
  });
});
