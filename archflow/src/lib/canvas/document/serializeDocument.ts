import type {
  EraserArchitectureDocument,
  EraserConnection,
  EraserDiagramStyle,
  EraserElement,
  EraserElementProperties,
  EraserLegend,
} from "@/lib/canvas/schema";
import {
  ERASER_DIAGRAM_STYLE_DEFAULTS,
  type EraserConnector,
} from "@/lib/canvas/schema";
import { connectorFromEdgeData } from "@/lib/canvas/style/edgeDesign";
import { ERASER_COLOR_MAP } from "@/lib/eraser/colors";

function colorToEraserName(hexOrName: string): string {
  const trimmed = hexOrName.trim();
  if (!trimmed.startsWith("#")) return trimmed;
  const normalized = trimmed.toLowerCase();
  for (const [name, value] of Object.entries(ERASER_COLOR_MAP)) {
    if (value.toLowerCase() === normalized) return name;
  }
  return `"${trimmed}"`;
}

function serializeProperties(props: EraserElementProperties): string {
  const parts: string[] = [];
  if (props.icon) parts.push(`icon: ${props.icon}`);
  if (props.color) parts.push(`color: ${colorToEraserName(props.color)}`);
  if (props.label) parts.push(`label: "${props.label.replace(/"/g, '\\"')}"`);
  if (props.link) parts.push(`link: "${props.link.replace(/"/g, '\\"')}"`);
  if (props.colorMode) parts.push(`colorMode: ${props.colorMode}`);
  if (props.styleMode) parts.push(`styleMode: ${props.styleMode}`);
  if (props.typeface) parts.push(`typeface: ${props.typeface}`);
  if (parts.length === 0) return "";
  return ` [${parts.join(", ")}]`;
}

function serializeElement(element: EraserElement, indent: number): string {
  const pad = "  ".repeat(indent);
  const props = serializeProperties(element.properties);

  if (element.isGroup) {
    let output = `${pad}${element.name}${props} {\n`;
    for (const child of element.children) {
      output += serializeElement(child, indent + 1);
    }
    output += `${pad}}\n`;
    return output;
  }

  return `${pad}${element.name}${props}\n`;
}

function serializeDiagramStyle(style: EraserDiagramStyle): string[] {
  const lines: string[] = [];
  if (style.direction !== ERASER_DIAGRAM_STYLE_DEFAULTS.direction) {
    lines.push(`direction ${style.direction}`);
  } else {
    lines.push(`direction ${style.direction}`);
  }
  if (style.colorMode !== ERASER_DIAGRAM_STYLE_DEFAULTS.colorMode) {
    lines.push(`colorMode ${style.colorMode}`);
  }
  if (style.styleMode !== ERASER_DIAGRAM_STYLE_DEFAULTS.styleMode) {
    lines.push(`styleMode ${style.styleMode}`);
  }
  if (style.typeface !== ERASER_DIAGRAM_STYLE_DEFAULTS.typeface) {
    lines.push(`typeface ${style.typeface}`);
  }
  return lines;
}

function serializeConnection(connection: EraserConnection): string {
  let line = `${connection.source} ${connection.connector} ${connection.target}`;
  if (connection.label) line += `: ${connection.label}`;

  if (connection.color) {
    line += ` [color: ${colorToEraserName(connection.color)}]`;
  }

  return line;
}

function serializeLegend(legend: EraserLegend): string {
  const headerProps: string[] = [];
  if (legend.position) headerProps.push(`position: ${legend.position}`);
  const header =
    headerProps.length > 0
      ? `legend [${headerProps.join(", ")}] {`
      : "legend {";

  const items = legend.items
    .map((item) => {
      const parts: string[] = [];
      if (item.connection) parts.push(`connection: ${item.connection}`);
      if (item.color) parts.push(`color: ${colorToEraserName(item.color)}`);
      if (item.icon) parts.push(`icon: ${item.icon}`);
      if (item.shape) parts.push(`shape: ${item.shape}`);
      parts.push(`label: ${item.label.includes(" ") ? `"${item.label}"` : item.label}`);
      return `  [${parts.join(", ")}]`;
    })
    .join("\n");

  return `${header}\n${items}\n}`;
}

/** Serialize canonical document to Eraser architecture DSL. */
export function serializeDocument(document: EraserArchitectureDocument): string {
  const lines: string[] = [];

  if (document.title && document.title !== "Untitled Diagram") {
    lines.push(document.title, "");
  }

  lines.push(...serializeDiagramStyle(document.style), "");

  for (const element of document.elements) {
    lines.push(serializeElement(element, 0).trimEnd());
  }

  if (document.elements.length > 0 && document.connections.length > 0) {
    lines.push("");
  }

  for (const connection of document.connections) {
    lines.push(serializeConnection(connection));
  }

  if (document.legend && document.legend.items.length > 0) {
    if (lines.length > 0 && lines[lines.length - 1] !== "") {
      lines.push("");
    }
    lines.push(serializeLegend(document.legend));
  }

  return lines.join("\n").trimEnd();
}

export function connectorFromEdge(
  arrowDirection: "forward" | "backward" | "bidirectional" | "none",
  strokeStyle?: "solid" | "dashed" | "dotted",
): EraserConnector {
  return connectorFromEdgeData(arrowDirection, strokeStyle);
}
