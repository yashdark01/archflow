import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseDocument } from "@/lib/canvas/document/parseDocument";
import { serializeDocument } from "@/lib/canvas/document/serializeDocument";
import { validateDocument, structuralEqual } from "@/lib/canvas/document/validateDocument";
import { documentToDiagram } from "@/lib/canvas/document/toDiagram";
import { diagramToDocument } from "@/lib/canvas/document/fromDiagram";
import { parseConnectionLine } from "@/lib/canvas/connection/parseConnections";
import { DEFAULT_ERASER_CODE } from "@/lib/eraser/defaultCode";

const examplesDir = path.join(
  process.cwd(),
  "src/lib/eraser/reference/examples",
);

const exampleFiles = [
  "aws-diagram.eraser",
  "gcp-diagram.eraser",
  "azure-diagram.eraser",
  "k8s-diagram.eraser",
  "etl-pipeline.eraser",
];

describe("parseDocument", () => {
  it("parses diagram-level style statements", () => {
    const doc = parseDocument(
      ["colorMode bold", "styleMode plain", "typeface mono", "", "Node [icon: aws-ec2]"].join(
        "\n",
      ),
    );
    expect(doc.style.colorMode).toBe("bold");
    expect(doc.style.styleMode).toBe("plain");
    expect(doc.style.typeface).toBe("mono");
    expect(doc.elements[0]?.properties.icon).toBe("aws-ec2");
  });

  it("parses extended node properties", () => {
    const doc = parseDocument(
      "Server [icon: aws-ec2, color: blue, label: \"Main\", link: \"https://example.com\", colorMode: bold, styleMode: plain, typeface: mono]",
    );
    expect(doc.elements[0]?.properties).toMatchObject({
      icon: "aws-ec2",
      color: "blue",
      label: "Main",
      link: "https://example.com",
      colorMode: "bold",
      styleMode: "plain",
      typeface: "mono",
    });
  });

  it("parses nested groups without space before brace", () => {
    const doc = parseDocument("ETL pipeline [color: silver]{\n  Worker [icon: aws-ec2]\n}");
    expect(doc.elements[0]?.name).toBe("ETL pipeline");
    expect(doc.elements[0]?.properties.color).toBe("silver");
    expect(doc.elements[0]?.children[0]?.name).toBe("Worker");
  });
});

describe("connection parsing", () => {
  it("parses dotted connectors", () => {
    const dotted = parseConnectionLine("A -- B");
    expect(dotted[0]?.connector).toBe("--");

    const dottedArrow = parseConnectionLine("A --> B: async");
    expect(dottedArrow[0]?.connector).toBe("-->");
    expect(dottedArrow[0]?.label).toBe("async");
  });
});

describe("document round-trip", () => {
  for (const file of exampleFiles) {
    it(`round-trips ${file}`, () => {
      const source = readFileSync(path.join(examplesDir, file), "utf8");
      const first = parseDocument(source);
      const serialized = serializeDocument(first);
      const second = parseDocument(serialized);
      expect(structuralEqual(first, second)).toBe(true);
    });
  }

  it("round-trips default eraser sample", () => {
    const first = parseDocument(DEFAULT_ERASER_CODE);
    const second = parseDocument(serializeDocument(first));
    expect(structuralEqual(first, second)).toBe(true);
  });
});

describe("validateDocument", () => {
  it("flags duplicate element names", () => {
    const doc = parseDocument("direction right\n\nNode_A\nNode_A");
    const issues = validateDocument(doc);
    expect(issues.some((i) => i.code === "duplicate_name")).toBe(true);
  });
});

describe("documentToDiagram", () => {
  it("builds nodes and edges from aws example", () => {
    const source = readFileSync(path.join(examplesDir, "aws-diagram.eraser"), "utf8");
    const doc = parseDocument(source);
    const { nodes, edges } = documentToDiagram(doc, { applyLayout: false });
    expect(nodes.length).toBeGreaterThan(5);
    expect(edges.length).toBeGreaterThan(3);
    expect(nodes.some((n) => n.data.eraserName === "VPC Subnet")).toBe(true);
  });

  it("diagramToDocument preserves connection connectors", () => {
    const source = "A -- B\nC --> D";
    const doc = parseDocument(source);
    const snapshot = documentToDiagram(doc, { applyLayout: false });
    const roundDoc = diagramToDocument(snapshot.nodes, snapshot.edges);
    expect(roundDoc.connections.map((c) => c.connector)).toEqual(["--", "-->"]);
  });
});
