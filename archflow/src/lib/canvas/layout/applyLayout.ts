import type { LayoutOverride } from "@/lib/canvas/schema";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";
import {
  eraserDirectionToRankDir,
  layoutDirectionToRankDir,
  type LayoutDirection,
  type LayoutRankDir,
} from "@/lib/canvas/layout/direction";
import { runLayoutEngine } from "@/lib/canvas/layout/layoutEngine";
import { applyLayoutOverrides } from "@/lib/canvas/layout/overrides";
import type { EraserDirection } from "@/lib/canvas/schema";

export interface ApplyCanvasLayoutInput {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  rankDir?: LayoutRankDir;
  eraserDirection?: EraserDirection;
  layoutDirection?: LayoutDirection;
  layoutOverrides?: Record<string, LayoutOverride>;
  /** When true, skip dagre and only apply overrides (manual layout). */
  manualOnly?: boolean;
}

export interface ApplyCanvasLayoutResult {
  nodes: DiagramNode[];
  rankDir: LayoutRankDir;
}

export function resolveRankDir(input: ApplyCanvasLayoutInput): LayoutRankDir {
  if (input.rankDir) return input.rankDir;
  if (input.eraserDirection) return eraserDirectionToRankDir(input.eraserDirection);
  if (input.layoutDirection) return layoutDirectionToRankDir(input.layoutDirection);
  return "LR";
}

/** Apply Eraser-style auto layout with optional manual override preservation. */
export function applyCanvasLayout(input: ApplyCanvasLayoutInput): ApplyCanvasLayoutResult {
  const rankDir = resolveRankDir(input);
  const overrides = input.layoutOverrides ?? {};

  if (input.manualOnly && Object.keys(overrides).length > 0) {
    return {
      nodes: applyLayoutOverrides(input.nodes, overrides),
      rankDir,
    };
  }

  const laidOut = runLayoutEngine(input.nodes, input.edges, rankDir);
  const withOverrides =
    Object.keys(overrides).length > 0
      ? applyLayoutOverrides(laidOut, overrides)
      : laidOut;

  return { nodes: withOverrides, rankDir };
}
