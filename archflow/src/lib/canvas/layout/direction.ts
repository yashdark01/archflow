import type { EraserDirection } from "@/lib/canvas/schema";

/** Dagre rankdir values — https://github.com/dagrejs/dagre */
export type LayoutRankDir = "LR" | "RL" | "TB" | "BT";

/** Legacy UI layout toggle (horizontal vs vertical). */
export type LayoutDirection = "LR" | "TD";

export function eraserDirectionToRankDir(direction: EraserDirection): LayoutRankDir {
  switch (direction) {
    case "left":
      return "RL";
    case "up":
      return "BT";
    case "down":
      return "TB";
    case "right":
    default:
      return "LR";
  }
}

export function layoutDirectionToRankDir(direction: LayoutDirection): LayoutRankDir {
  return direction === "TD" ? "TB" : "LR";
}

export function rankDirToLayoutDirection(rankDir: LayoutRankDir): LayoutDirection {
  return rankDir === "TB" || rankDir === "BT" ? "TD" : "LR";
}

export function isHorizontalRankDir(rankDir: LayoutRankDir): boolean {
  return rankDir === "LR" || rankDir === "RL";
}
