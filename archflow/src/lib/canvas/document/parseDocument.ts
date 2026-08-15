import type {
  EraserArchitectureDocument,
  EraserDiagramStyle,
  EraserElement,
  EraserLegend,
  EraserLegendItem,
} from "@/lib/canvas/schema";
import { ERASER_DIAGRAM_STYLE_DEFAULTS } from "@/lib/canvas/schema";
import { parseConnectionLines } from "@/lib/canvas/connection/parseConnections";
import {
  isConnectionLine,
  parseGenericProperties,
  parseName,
  parsePropertiesBlock,
  skipWhitespace,
  stripComments,
} from "@/lib/canvas/document/parseUtils";

function parseElement(src: string, pos: number): { element: EraserElement; pos: number } {
  pos = skipWhitespace(src, pos);
  const { name, pos: namePos } = parseName(src, pos);
  if (!name) throw new Error("Expected element name");

  const { props, pos: propsPos } = parsePropertiesBlock(src, namePos);
  pos = skipWhitespace(src, propsPos);

  const children: EraserElement[] = [];
  let isGroup = false;

  if (src[pos] === "{") {
    isGroup = true;
    pos += 1;
    while (pos < src.length) {
      pos = skipWhitespace(src, pos);
      if (src[pos] === "}") {
        pos += 1;
        break;
      }
      const child = parseElement(src, pos);
      children.push(child.element);
      pos = child.pos;
    }
  }

  return {
    element: { name, properties: props, isGroup, children },
    pos,
  };
}

function parseLegendItemProps(props: Record<string, string>): EraserLegendItem | null {
  const label = props.label;
  if (!label) return null;

  const item: EraserLegendItem = { label };
  if (props.connection) item.connection = props.connection as EraserLegendItem["connection"];
  if (props.color) item.color = props.color;
  if (props.icon) item.icon = props.icon;
  if (props.shape) item.shape = props.shape;
  return item;
}

function parseLegend(src: string, pos: number): { legend: EraserLegend; pos: number } {
  pos = skipWhitespace(src, pos);
  const legend: EraserLegend = { items: [] };

  if (!src.slice(pos).startsWith("legend")) {
    return { legend, pos };
  }

  pos += "legend".length;
  pos = skipWhitespace(src, pos);

  const { props: headerProps, pos: headerPos } = parseGenericProperties(src, pos);
  if (headerProps.position) {
    legend.position = headerProps.position as EraserLegend["position"];
  }
  pos = headerPos;
  pos = skipWhitespace(src, pos);

  if (src[pos] !== "{") {
    return { legend, pos };
  }

  pos += 1;
  while (pos < src.length) {
    pos = skipWhitespace(src, pos);
    if (src[pos] === "}") {
      pos += 1;
      break;
    }

    const { props, pos: itemPos } = parseGenericProperties(src, pos);
    const item = parseLegendItemProps(props);
    if (item) legend.items.push(item);
    pos = itemPos;
    pos = skipWhitespace(src, pos);
    if (src[pos] === "\n") pos += 1;
  }

  return { legend, pos };
}

function parseBlock(
  src: string,
  pos: number,
): { elements: EraserElement[]; pos: number } {
  const elements: EraserElement[] = [];

  while (pos < src.length) {
    pos = skipWhitespace(src, pos);
    if (pos >= src.length) break;
    if (src[pos] === "}") return { elements, pos };

    const lineEnd = src.indexOf("\n", pos);
    const line = lineEnd === -1 ? src.slice(pos) : src.slice(pos, lineEnd);
    const trimmed = line.trim();

    if (!trimmed) {
      pos = lineEnd === -1 ? src.length : lineEnd + 1;
      continue;
    }

    if (
      trimmed.startsWith("direction") ||
      trimmed.startsWith("colorMode") ||
      trimmed.startsWith("styleMode") ||
      trimmed.startsWith("typeface")
    ) {
      pos = lineEnd === -1 ? src.length : lineEnd + 1;
      continue;
    }

    if (trimmed.startsWith("legend")) {
      return { elements, pos };
    }

    if (isConnectionLine(trimmed)) {
      return { elements, pos };
    }

    const parsed = parseElement(src, pos);
    elements.push(parsed.element);
    pos = parsed.pos;
    pos = skipWhitespace(src, pos);
    if (src[pos] === "\n") pos += 1;
  }

  return { elements, pos };
}

function applyDiagramStatement(
  style: EraserDiagramStyle,
  line: string,
): EraserDiagramStyle {
  const trimmed = line.trim();
  const directionMatch = trimmed.match(/^direction\s+(right|left|up|down)$/);
  if (directionMatch) {
    return { ...style, direction: directionMatch[1] as EraserDiagramStyle["direction"] };
  }

  const colorModeMatch = trimmed.match(/^colorMode\s+(pastel|bold|outline)$/);
  if (colorModeMatch) {
    return { ...style, colorMode: colorModeMatch[1] as EraserDiagramStyle["colorMode"] };
  }

  const styleModeMatch = trimmed.match(/^styleMode\s+(shadow|plain|watercolor)$/);
  if (styleModeMatch) {
    return { ...style, styleMode: styleModeMatch[1] as EraserDiagramStyle["styleMode"] };
  }

  const typefaceMatch = trimmed.match(/^typeface\s+(rough|clean|mono)$/);
  if (typefaceMatch) {
    return { ...style, typeface: typefaceMatch[1] as EraserDiagramStyle["typeface"] };
  }

  return style;
}

function extractTitle(lines: string[]): { title?: string; bodyLines: string[] } {
  const bodyLines = [...lines];
  const firstContentIdx = bodyLines.findIndex((line) => {
    const t = line.trim();
    return t && !t.startsWith("//");
  });

  if (firstContentIdx < 0) return { bodyLines };

  const first = bodyLines[firstContentIdx].trim();
  const isTitle =
    !first.includes("[") &&
    !first.includes("{") &&
    !isConnectionLine(first) &&
    !first.startsWith("direction") &&
    !first.startsWith("colorMode") &&
    !first.startsWith("styleMode") &&
    !first.startsWith("typeface") &&
    !first.startsWith("legend");

  if (!isTitle) return { bodyLines };

  const title = first;
  bodyLines.splice(firstContentIdx, 1);
  return { title, bodyLines };
}

/** Parse Eraser architecture DSL into canonical document. */
export function parseDocument(source: string): EraserArchitectureDocument {
  const cleaned = stripComments(source).trim();
  const rawLines = cleaned.split("\n");
  const { title, bodyLines } = extractTitle(rawLines);

  let style: EraserDiagramStyle = { ...ERASER_DIAGRAM_STYLE_DEFAULTS };
  const structuralLines: string[] = [];

  for (const line of bodyLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (
      trimmed.startsWith("direction") ||
      trimmed.startsWith("colorMode") ||
      trimmed.startsWith("styleMode") ||
      trimmed.startsWith("typeface")
    ) {
      style = applyDiagramStatement(style, trimmed);
      continue;
    }
    structuralLines.push(line);
  }

  const body = structuralLines.join("\n");
  let pos = 0;
  pos = skipWhitespace(body, pos);

  let legend: EraserLegend | undefined;

  const { elements, pos: blockPos } = parseBlock(body, pos);
  pos = blockPos;
  pos = skipWhitespace(body, pos);

  let remainder = body.slice(pos).trim();
  if (remainder.startsWith("legend")) {
    const legendStart = body.indexOf("legend", pos);
    const parsedLegend = parseLegend(body, legendStart);
    if (parsedLegend.legend.items.length > 0 || parsedLegend.legend.position) {
      legend = parsedLegend.legend;
    }
    remainder = body.slice(parsedLegend.pos).trim();
  }

  const connectionLines = remainder ? remainder.split("\n") : [];
  const connections = parseConnectionLines(connectionLines);

  const document: EraserArchitectureDocument = {
    title,
    style,
    elements,
    connections,
  };

  if (legend && (legend.items.length > 0 || legend.position)) {
    document.legend = legend;
  }

  return document;
}
