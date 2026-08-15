/** Canvas node visual design spec — maps to archflow-* CSS classes. */

export type CanvasNodeVariant =
  | "boxed"
  | "icon"
  | "iconOnly"
  | "group"
  | "text";

export interface CanvasNodeDesign {
  variant: CanvasNodeVariant;
  rootClass: string;
  minWidth?: number;
  minHeight?: number;
  iconSize: number;
  labelClass: string;
  borderWidth?: number;
  borderRadius?: string;
  shadow: string;
}

export const NODE_DESIGN: Record<CanvasNodeVariant, CanvasNodeDesign> = {
  boxed: {
    variant: "boxed",
    rootClass: "archflow-node",
    iconSize: 24,
    labelClass: "text-sm font-medium text-foreground",
    borderWidth: 1,
    borderRadius: "0.5rem",
    shadow: "shadow-sm",
  },
  icon: {
    variant: "icon",
    rootClass: "archflow-icon-node",
    iconSize: 44,
    labelClass:
      "text-[11px] font-medium text-foreground max-w-[120px] truncate",
    shadow: "drop-shadow-sm",
  },
  iconOnly: {
    variant: "iconOnly",
    rootClass: "archflow-icon-node",
    iconSize: 44,
    labelClass: "text-[11px] font-medium text-foreground",
    shadow: "drop-shadow-sm",
  },
  group: {
    variant: "group",
    rootClass: "archflow-group",
    minWidth: 200,
    minHeight: 120,
    iconSize: 0,
    labelClass:
      "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
    borderWidth: 2,
    borderRadius: "0.5rem",
    shadow: "none",
  },
  text: {
    variant: "text",
    rootClass: "archflow-text-label",
    iconSize: 0,
    labelClass: "text-sm font-medium text-foreground",
    shadow: "none",
  },
};

export const HANDLE_DESIGN = {
  boxed: {
    className: "archflow-handle !h-3 !w-3 !border-2 !border-background !shadow-sm transition-all",
  },
  icon: {
    className:
      "archflow-handle !h-2.5 !w-2.5 !border-2 !border-background !shadow-sm transition-all",
  },
} as const;

export const SELECTION_RING = {
  boxed: "ring-2 ring-primary ring-offset-2 ring-offset-background",
  icon: "ring-2 ring-primary/80 ring-offset-2 ring-offset-background",
  group: "ring-2 ring-primary/60 ring-offset-2 ring-offset-background",
  text: "ring-2 ring-primary/40 ring-offset-1 ring-offset-background",
} as const;

export function inferCanvasNodeVariant(input: {
  nodeType: string;
  icon?: string;
  borderStyle?: string;
}): CanvasNodeVariant {
  if (input.nodeType === "group") return "group";
  if (input.nodeType === "text") return "text";
  if (input.icon) {
    return input.borderStyle === "none" ? "iconOnly" : "icon";
  }
  return "boxed";
}
