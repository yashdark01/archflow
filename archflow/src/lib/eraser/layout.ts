import type { DiagramNode } from "@/types/diagram";

const H_GAP = 110;
const V_GAP = 90;
const GROUP_PAD_X = 40;
const GROUP_PAD_Y = 52;
const ICON_NODE_WIDTH = 88;
const ICON_NODE_HEIGHT = 72;

type Direction = "right" | "left" | "up" | "down";

function layoutChildren(
  nodes: DiagramNode[],
  parentId: string | undefined,
  originX: number,
  originY: number,
  direction: Direction,
): { width: number; height: number } {
  const children = nodes.filter((node) => node.parentId === parentId);

  if (children.length === 0) {
    return { width: 200, height: 140 };
  }

  let cursorX = originX + GROUP_PAD_X;
  let cursorY = originY + GROUP_PAD_Y;
  let rowHeight = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  const horizontal = direction === "right" || direction === "left";

  for (const child of children) {
    if (child.data.nodeType === "group") {
      const nestedSize = layoutChildren(nodes, child.id, cursorX, cursorY, direction);
      child.position = { x: cursorX - originX, y: cursorY - originY };
      child.style = {
        width: nestedSize.width,
        height: nestedSize.height,
      };

      if (horizontal) {
        cursorX += nestedSize.width + H_GAP;
        rowHeight = Math.max(rowHeight, nestedSize.height);
        maxWidth = cursorX - originX;
        maxHeight = Math.max(maxHeight, rowHeight);
      } else {
        cursorY += nestedSize.height + V_GAP;
        maxHeight = cursorY - originY;
        maxWidth = Math.max(maxWidth, nestedSize.width);
      }
    } else {
      child.position = { x: cursorX - originX, y: cursorY - originY };

      if (horizontal) {
        cursorX += ICON_NODE_WIDTH + H_GAP;
        rowHeight = Math.max(rowHeight, ICON_NODE_HEIGHT);
        maxWidth = cursorX - originX;
        maxHeight = Math.max(maxHeight, rowHeight);
      } else {
        cursorY += ICON_NODE_HEIGHT + V_GAP;
        maxHeight = cursorY - originY;
        maxWidth = Math.max(maxWidth, ICON_NODE_WIDTH);
      }
    }
  }

  return {
    width: Math.max(maxWidth + GROUP_PAD_X, 220),
    height: Math.max(maxHeight + GROUP_PAD_Y, 120),
  };
}

export function applyAutoLayout(
  nodes: DiagramNode[],
  direction: Direction = "right",
): DiagramNode[] {
  const roots = nodes.filter((node) => !node.parentId);

  let cursorX = 80;
  let cursorY = 80;

  for (const root of roots) {
    if (root.data.nodeType === "group") {
      const size = layoutChildren(nodes, root.id, cursorX, cursorY, direction);
      root.position = { x: cursorX, y: cursorY };
      root.style = { width: size.width, height: size.height };

      if (direction === "right" || direction === "left") {
        cursorX += size.width + H_GAP * 2;
      } else {
        cursorY += size.height + V_GAP * 2;
      }
    } else {
      root.position = { x: cursorX, y: cursorY };
      if (direction === "right" || direction === "left") {
        cursorX += ICON_NODE_WIDTH + H_GAP * 2;
      } else {
        cursorY += ICON_NODE_HEIGHT + V_GAP * 2;
      }
    }
  }

  return [...nodes];
}
