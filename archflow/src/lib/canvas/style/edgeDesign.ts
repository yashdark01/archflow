import type { EraserConnector } from "@/lib/canvas/schema";
import {
  CONNECTOR_TO_ARROW,
  CONNECTOR_TO_STROKE,
} from "@/lib/canvas/schema";
import type { ArrowDirection, EdgeStrokeStyle } from "@/types/diagram";

/** Eraser architecture diagram connectors — https://docs.eraser.io/architecture-diagram-syntax */
export const ERASER_CONNECTOR_OPTIONS: {
  value: EraserConnector;
  label: string;
  description: string;
}[] = [
  { value: ">", label: "Arrow →", description: "Forward arrow" },
  { value: "<", label: "Arrow ←", description: "Backward arrow" },
  { value: "<>", label: "Arrow ↔", description: "Bidirectional" },
  { value: "-", label: "Line —", description: "Solid line, no arrow" },
  { value: "--", label: "Dotted line", description: "Dotted line, no arrow" },
  { value: "-->", label: "Dotted arrow", description: "Dotted forward arrow" },
];

/** Visual dash patterns — dotted (Eraser) vs dashed (canvas-only) are distinct. */
export const STROKE_DASHARRAY: Record<EdgeStrokeStyle, string | undefined> = {
  solid: undefined,
  dashed: "10 6",
  dotted: "3 5",
};

export const CONNECTOR_PREVIEW_DASH: Record<EraserConnector, string | undefined> = {
  ">": undefined,
  "<": undefined,
  "<>": undefined,
  "-": undefined,
  "--": "3 5",
  "-->": "3 5",
};

export function getEdgeStrokeDasharray(
  strokeStyle?: EdgeStrokeStyle,
): string | undefined {
  if (!strokeStyle || strokeStyle === "solid") return undefined;
  return STROKE_DASHARRAY[strokeStyle];
}

export function getConnectorPreviewDasharray(
  connector: EraserConnector,
): string | undefined {
  return CONNECTOR_PREVIEW_DASH[connector];
}

export function connectorFromEdgeData(
  arrowDirection: ArrowDirection,
  strokeStyle?: EdgeStrokeStyle,
): EraserConnector {
  if (strokeStyle === "dotted") {
    return arrowDirection === "forward" ? "-->" : "--";
  }
  if (arrowDirection === "backward") return "<";
  if (arrowDirection === "bidirectional") return "<>";
  if (arrowDirection === "none") return "-";
  return ">";
}

export function edgeDataFromConnector(connector: EraserConnector): {
  arrowDirection: ArrowDirection;
  strokeStyle: EdgeStrokeStyle;
  connector: EraserConnector;
} {
  return {
    arrowDirection: CONNECTOR_TO_ARROW[connector],
    strokeStyle: CONNECTOR_TO_STROKE[connector],
    connector,
  };
}

export function resolveEdgeVisualStyle(input: {
  connector?: EraserConnector;
  arrowDirection?: ArrowDirection;
  strokeStyle?: EdgeStrokeStyle;
}): {
  connector: EraserConnector;
  arrowDirection: ArrowDirection;
  strokeStyle: EdgeStrokeStyle;
  strokeDasharray?: string;
} {
  const connector =
    input.connector ??
    connectorFromEdgeData(
      input.arrowDirection ?? "forward",
      input.strokeStyle,
    );
  const arrowDirection =
    input.arrowDirection ?? CONNECTOR_TO_ARROW[connector];
  const strokeStyle =
    input.strokeStyle ?? CONNECTOR_TO_STROKE[connector];

  return {
    connector,
    arrowDirection,
    strokeStyle,
    strokeDasharray: getEdgeStrokeDasharray(strokeStyle),
  };
}

export function connectorShowsEndArrow(connector: EraserConnector): boolean {
  return connector === ">" || connector === "-->";
}

export function connectorShowsStartArrow(connector: EraserConnector): boolean {
  return connector === "<" || connector === "<>";
}
