import { NODE_DESIGN } from "@/lib/eraser/reference/nodeDesign";

/** Spacing between sibling nodes inside a group. */
export const LAYOUT_H_GAP = 100;
export const LAYOUT_V_GAP = 90;

/** Padding inside group containers. */
export const GROUP_PAD_X = 48;
export const GROUP_PAD_Y = 56;

/** Offset for root-level diagram margin. */
export const ROOT_OFFSET_X = 80;
export const ROOT_OFFSET_Y = 80;

export const DEFAULT_BOXED_WIDTH = 100;
export const DEFAULT_BOXED_HEIGHT = 72;

export const ICON_NODE_WIDTH = 56;
export const ICON_NODE_HEIGHT = 52;
export const ICON_NODE_WITH_LABEL_WIDTH = 108;
export const ICON_NODE_WITH_LABEL_HEIGHT = 72;

export const TEXT_LABEL_MIN_WIDTH = 80;
export const TEXT_LABEL_HEIGHT = 28;

export const GROUP_MIN_WIDTH = NODE_DESIGN.group.minWidth ?? 200;
export const GROUP_MIN_HEIGHT = NODE_DESIGN.group.minHeight ?? 120;
