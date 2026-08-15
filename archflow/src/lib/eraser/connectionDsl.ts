import type { ArrowDirection, DiagramEdge } from "@/types/diagram";
import { DEFAULT_EDGE_COLOR } from "@/constants/edgeDefaults";
import { ERASER_COLOR_MAP } from "@/lib/eraser/colors";
import type { EraserConnector } from "@/lib/canvas/schema";
import { CONNECTOR_TO_ARROW, CONNECTOR_TO_STROKE } from "@/lib/canvas/schema";
import { parseConnectionLine as parseCanvasConnectionLine } from "@/lib/canvas/connection/parseConnections";
import { connectorFromEdge } from "@/lib/canvas/document/serializeDocument";

function colorToEraserName(hex: string): string {
  const normalized = hex.toLowerCase();
  for (const [name, value] of Object.entries(ERASER_COLOR_MAP)) {
    if (value.toLowerCase() === normalized) return name;
  }
  return `"${hex}"`;
}

export interface ParsedConnectionLine {
  source: string;
  target: string;
  label?: string;
  color?: string;
  arrowDirection: ArrowDirection;
  strokeStyle?: "solid" | "dashed" | "dotted";
  connector?: EraserConnector;
}

export function serializeConnectionLine(
  edge: DiagramEdge,
  sourceName: string,
  targetName: string,
): string {
  const label = edge.data?.label?.trim();
  const color = edge.data?.color ?? DEFAULT_EDGE_COLOR;
  const arrow = edge.data?.arrowDirection ?? "forward";
  const strokeStyle = edge.data?.strokeStyle;
  const connector =
    edge.data?.connector ?? connectorFromEdge(arrow, strokeStyle);

  let line = `${sourceName} ${connector} ${targetName}`;
  if (label) line += `: ${label}`;

  const defaultColor = DEFAULT_EDGE_COLOR.toLowerCase();
  if (color && color.toLowerCase() !== defaultColor) {
    line += ` [color: ${colorToEraserName(color)}]`;
  }

  return line;
}

/** Parse one Eraser connection line into individual connections. */
export function parseConnectionLine(line: string): ParsedConnectionLine[] {
  return parseCanvasConnectionLine(line).map((connection) => ({
    source: connection.source,
    target: connection.target,
    label: connection.label,
    color: connection.color,
    arrowDirection: CONNECTOR_TO_ARROW[connection.connector],
    strokeStyle: CONNECTOR_TO_STROKE[connection.connector],
    connector: connection.connector,
  }));
}
