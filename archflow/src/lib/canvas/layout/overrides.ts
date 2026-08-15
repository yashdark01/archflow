import type { LayoutOverride } from "@/lib/canvas/schema";
import type { DiagramNode } from "@/types/diagram";
import { LEGEND_OVERRIDE_KEY } from "@/lib/canvas/legend/constants";

export function getLegendLayoutOverride(
  overrides: Record<string, LayoutOverride>,
): LayoutOverride | undefined {
  return overrides[LEGEND_OVERRIDE_KEY];
}

export function withoutLegendOverride(
  overrides: Record<string, LayoutOverride>,
): Record<string, LayoutOverride> {
  const { [LEGEND_OVERRIDE_KEY]: removedLegend, ...rest } = overrides;
  void removedLegend;
  return rest;
}

export function applyLayoutOverrides(
  nodes: DiagramNode[],
  overrides: Record<string, LayoutOverride>,
): DiagramNode[] {
  return nodes.map((node) => {
    const name = node.data.eraserName;
    if (!name || !overrides[name]) return node;

    const override = overrides[name];
    return {
      ...node,
      position: { x: override.x, y: override.y },
      ...(override.width != null || override.height != null
        ? {
            style: {
              ...node.style,
              ...(override.width != null ? { width: override.width } : {}),
              ...(override.height != null ? { height: override.height } : {}),
            },
          }
        : {}),
    };
  });
}

/** Capture manual positions keyed by Eraser element name. */
export function captureLayoutOverrides(nodes: DiagramNode[]): Record<string, LayoutOverride> {
  const overrides: Record<string, LayoutOverride> = {};

  for (const node of nodes) {
    const name = node.data.eraserName;
    if (!name) continue;

    overrides[name] = {
      x: node.position.x,
      y: node.position.y,
      ...(typeof node.style?.width === "number" ? { width: node.style.width } : {}),
      ...(typeof node.style?.height === "number" ? { height: node.style.height } : {}),
    };
  }

  return overrides;
}

export function mergeLayoutOverrides(
  base: Record<string, LayoutOverride>,
  patch: Record<string, LayoutOverride>,
): Record<string, LayoutOverride> {
  return { ...base, ...patch };
}
