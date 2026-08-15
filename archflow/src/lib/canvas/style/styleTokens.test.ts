import { describe, expect, it } from "vitest";
import { resolveCanvasNodeStyle } from "@/lib/canvas/style/styleTokens";
import { inferCanvasNodeVariant } from "@/lib/canvas/style/nodeDesign";

describe("resolveCanvasNodeStyle", () => {
  it("applies pastel fill and shadow by default", () => {
    const style = resolveCanvasNodeStyle({ colorHex: "#3b82f6" });
    expect(style.backgroundColor).toBe("rgba(59, 130, 246, 0.12)");
    expect(style.boxShadow).toContain("rgb");
  });

  it("applies outline and plain modes", () => {
    const style = resolveCanvasNodeStyle({
      colorHex: "#22c55e",
      colorMode: "outline",
      styleMode: "plain",
    });
    expect(style.backgroundColor).toBe("transparent");
    expect(style.boxShadow).toBe("none");
  });

  it("applies watercolor filter", () => {
    const style = resolveCanvasNodeStyle({
      colorHex: "#ef4444",
      styleMode: "watercolor",
    });
    expect(style.filter).toBe("url(#archflow-watercolor)");
  });

  it("inherits diagram defaults when node props omitted", () => {
    const style = resolveCanvasNodeStyle({
      colorHex: "#6366f1",
      diagramDefaults: {
        colorMode: "bold",
        styleMode: "plain",
        typeface: "mono",
      },
    });
    expect(style.backgroundColor).toBe("rgba(99, 102, 241, 0.28)");
    expect(style.fontFamily).toContain("mono");
  });
});

describe("inferCanvasNodeVariant", () => {
  it("detects icon-only vs boxed icon nodes", () => {
    expect(
      inferCanvasNodeVariant({
        nodeType: "service",
        icon: "aws-ec2",
        borderStyle: "none",
      }),
    ).toBe("iconOnly");
    expect(
      inferCanvasNodeVariant({
        nodeType: "service",
        icon: "aws-ec2",
        borderStyle: "solid",
      }),
    ).toBe("icon");
  });
});
