import type { EdgeStrokeStyle, EdgeType } from "@/types/diagram";
import type { LucideIcon } from "lucide-react";
import { CornerDownRight, GitBranch, Minus, Spline } from "lucide-react";

export const DEFAULT_EDGE_TYPE: EdgeType = "step";

export const DEFAULT_EDGE_COLOR = "#64748b";

export const DEFAULT_EDGE_STROKE_WIDTH = 2;

export const EDGE_STROKE_WEIGHTS: { value: number; label: string }[] = [
  { value: 1.5, label: "Thin" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Thick" },
];

export const EDGE_STROKE_STYLES: {
  value: EdgeStrokeStyle;
  label: string;
  dasharray?: string;
}[] = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed", dasharray: "8 4" },
  { value: "dotted", label: "Dotted", dasharray: "2 3" },
];

export function getStrokeDasharray(style?: EdgeStrokeStyle): string | undefined {
  const match = EDGE_STROKE_STYLES.find((item) => item.value === style);
  return match?.dasharray;
}

export const EDGE_TYPE_OPTIONS: { value: EdgeType; label: string }[] = [
  { value: "default", label: "Curve" },
  { value: "smoothstep", label: "Smooth" },
  { value: "straight", label: "Straight" },
  { value: "step", label: "L-shape" },
];

export const CONNECTION_STYLE_OPTIONS: {
  value: EdgeType;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "step",
    label: "L-shape",
    description: "Orthogonal with sharp bend",
    icon: CornerDownRight,
  },
  {
    value: "smoothstep",
    label: "Smooth",
    description: "Orthogonal with rounded corners",
    icon: GitBranch,
  },
  {
    value: "default",
    label: "Curve",
    description: "Bezier curve between nodes",
    icon: Spline,
  },
  {
    value: "straight",
    label: "Straight",
    description: "Direct straight line",
    icon: Minus,
  },
];
