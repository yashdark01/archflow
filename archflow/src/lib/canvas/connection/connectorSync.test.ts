import { describe, expect, it } from "vitest";
import {
  createEdgeDataFromConnector,
  normalizeEdgeDataPatch,
} from "@/lib/canvas/connection/connectorSync";
import type { EdgeData } from "@/types/diagram";

const base: EdgeData = {
  label: "",
  color: "#64748b",
  arrowDirection: "forward",
  strokeStyle: "solid",
  connector: ">",
};

describe("normalizeEdgeDataPatch", () => {
  it("expands connector patch to arrow and stroke", () => {
    const patch = normalizeEdgeDataPatch({ connector: "--" }, base);
    expect(patch).toEqual({
      connector: "--",
      arrowDirection: "none",
      strokeStyle: "dotted",
    });
  });

  it("syncs connector when arrow changes", () => {
    const patch = normalizeEdgeDataPatch({ arrowDirection: "backward" }, base);
    expect(patch.connector).toBe("<");
    expect(patch.arrowDirection).toBe("backward");
    expect(patch.strokeStyle).toBe("solid");
  });

  it("syncs connector when stroke becomes dotted", () => {
    const patch = normalizeEdgeDataPatch({ strokeStyle: "dotted" }, base);
    expect(patch.connector).toBe("-->");
    expect(patch.strokeStyle).toBe("dotted");
  });

  it("keeps dashed stroke as canvas-only solid connector mapping", () => {
    const patch = normalizeEdgeDataPatch({ strokeStyle: "dashed" }, base);
    expect(patch.connector).toBe(">");
    expect(patch.strokeStyle).toBe("dashed");
  });
});

describe("createEdgeDataFromConnector", () => {
  it("builds edge data from connector preset", () => {
    const data = createEdgeDataFromConnector("<>", { label: "sync" });
    expect(data.arrowDirection).toBe("bidirectional");
    expect(data.strokeStyle).toBe("solid");
    expect(data.connector).toBe("<>");
    expect(data.label).toBe("sync");
  });
});
