import type { DiagramNode } from "@/types/diagram";
import { humanizeIconId } from "@/constants/eraserIcons";
import { inferCanvasNodeVariant } from "@/lib/canvas/style/nodeDesign";
import {
  DEFAULT_BOXED_HEIGHT,
  DEFAULT_BOXED_WIDTH,
  GROUP_MIN_HEIGHT,
  GROUP_MIN_WIDTH,
  ICON_NODE_HEIGHT,
  ICON_NODE_WIDTH,
  ICON_NODE_WITH_LABEL_HEIGHT,
  ICON_NODE_WITH_LABEL_WIDTH,
  TEXT_LABEL_HEIGHT,
  TEXT_LABEL_MIN_WIDTH,
} from "@/lib/canvas/layout/tokens";

function iconNodeShowsLabel(node: DiagramNode): boolean {
  if (!node.data.icon) return false;
  const defaultLabel = humanizeIconId(node.data.icon);
  return (
    node.data.label.trim().length > 0 && node.data.label.trim() !== defaultLabel
  );
}

/** Estimate React Flow node bounds for dagre layout. */
export function measureNodeForLayout(node: DiagramNode): { width: number; height: number } {
  if (node.data.nodeType === "group") {
    const width =
      typeof node.style?.width === "number" ? node.style.width : GROUP_MIN_WIDTH;
    const height =
      typeof node.style?.height === "number" ? node.style.height : GROUP_MIN_HEIGHT;
    return { width, height };
  }

  if (node.data.nodeType === "text") {
    const estimated = Math.max(
      TEXT_LABEL_MIN_WIDTH,
      node.data.label.length * 7 + 16,
    );
    return { width: estimated, height: TEXT_LABEL_HEIGHT };
  }

  const variant = inferCanvasNodeVariant({
    nodeType: node.data.nodeType,
    icon: node.data.icon,
    borderStyle: node.data.borderStyle,
  });

  if (variant === "icon" || variant === "iconOnly") {
    const withLabel = variant === "icon" || iconNodeShowsLabel(node);
    return withLabel
      ? { width: ICON_NODE_WITH_LABEL_WIDTH, height: ICON_NODE_WITH_LABEL_HEIGHT }
      : { width: ICON_NODE_WIDTH, height: ICON_NODE_HEIGHT };
  }

  return { width: DEFAULT_BOXED_WIDTH, height: DEFAULT_BOXED_HEIGHT };
}
