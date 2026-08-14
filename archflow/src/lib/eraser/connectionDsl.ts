import type { ArrowDirection, DiagramEdge } from "@/types/diagram";
import { DEFAULT_EDGE_COLOR } from "@/constants/edgeDefaults";
import { ERASER_COLOR_MAP } from "@/lib/eraser/colors";

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
}

export function serializeConnectionLine(
  edge: DiagramEdge,
  sourceName: string,
  targetName: string,
): string {
  const label = edge.data?.label?.trim();
  const color = edge.data?.color ?? DEFAULT_EDGE_COLOR;
  const arrow = edge.data?.arrowDirection ?? "forward";

  let connector = ">";
  if (arrow === "backward") connector = "<";
  else if (arrow === "bidirectional") connector = "<>";
  else if (arrow === "none") connector = "-";

  let line = `${sourceName} ${connector} ${targetName}`;
  if (label) line += `: ${label}`;

  const defaultColor = DEFAULT_EDGE_COLOR.toLowerCase();
  if (color && color.toLowerCase() !== defaultColor) {
    line += ` [color: ${colorToEraserName(color)}]`;
  }

  return line;
}

function splitNames(part: string): string[] {
  return part
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

/** Parse one Eraser connection line into individual connections. */
export function parseConnectionLine(line: string): ParsedConnectionLine[] {
  const trimmed = line.trim();
  if (!trimmed) return [];

  let color: string | undefined;
  let core = trimmed;

  const bracketIdx = trimmed.lastIndexOf("[");
  if (bracketIdx > 0 && trimmed.endsWith("]")) {
    const inner = trimmed.slice(bracketIdx + 1, -1);
    const colorMatch = inner.match(/color:\s*([^,]+)/i);
    if (colorMatch) color = colorMatch[1].trim().replace(/^["']|["']$/g, "");
    core = trimmed.slice(0, bracketIdx).trim();
  }

  let label: string | undefined;
  const colonMatch = core.match(/^(.+?)\s*:\s*(.+)$/);
  if (
    colonMatch &&
    (colonMatch[1].includes(">") ||
      colonMatch[1].includes("<") ||
      colonMatch[1].includes("-"))
  ) {
    core = colonMatch[1].trim();
    label = colonMatch[2].trim();
  }

  let op: ">" | "<" | "<>" | "-" = ">";
  let left = "";
  let right = "";

  if (core.includes("<>")) {
    const idx = core.indexOf("<>");
    left = core.slice(0, idx).trim();
    right = core.slice(idx + 2).trim();
    op = "<>";
  } else if (core.includes("<")) {
    const idx = core.indexOf("<");
    left = core.slice(0, idx).trim();
    right = core.slice(idx + 1).trim();
    op = "<";
  } else if (core.includes("-") && !core.includes(">")) {
    const idx = core.indexOf("-");
    left = core.slice(0, idx).trim();
    right = core.slice(idx + 1).trim();
    op = "-";
  } else if (core.includes(">")) {
    const segments = core.split(/\s*>\s*/).map((segment) => segment.trim()).filter(Boolean);
    if (segments.length < 2) return [];

    const connections: ParsedConnectionLine[] = [];
    for (let i = 0; i < segments.length - 1; i += 1) {
      const sources = splitNames(segments[i]);
      const targets = splitNames(segments[i + 1]);
      for (const source of sources) {
        for (const target of targets) {
          connections.push({
            source,
            target,
            label,
            color,
            arrowDirection: "forward",
          });
        }
      }
    }
    return connections;
  } else {
    return [];
  }

  const arrowDirection: ArrowDirection =
    op === "<>" ? "bidirectional" : op === "<" ? "backward" : op === "-" ? "none" : "forward";

  const connections: ParsedConnectionLine[] = [];

  if (op === "<>" || op === "-" || op === "<") {
    const sources = splitNames(left);
    const targets = splitNames(right);
    for (const source of sources) {
      for (const target of targets) {
        connections.push({
          source,
          target,
          label,
          color,
          arrowDirection,
        });
      }
    }
  }

  return connections;
}
