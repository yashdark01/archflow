import type { DiagramEdge, DiagramNode, DiagramSnapshot } from "@/types/diagram";
import { DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { resolveEraserColor } from "@/lib/eraser/colors";
import { createEdge } from "@/utils/edgeFactory";
import { generateId } from "@/utils/generateId";
import { applyDiagramLayout, type LayoutDirection } from "@/lib/layout/diagramLayout";
import { parseConnectionLine } from "@/lib/eraser/connectionDsl";
import { getEdgeMarkers } from "@/utils/edgeMarkers";

export interface EraserProperties {
  icon?: string;
  color?: string;
  label?: string;
}

export interface ParsedElement {
  name: string;
  properties: EraserProperties;
  isGroup: boolean;
  children: ParsedElement[];
}

export interface ParsedConnection {
  source: string;
  target: string;
  label?: string;
  color?: string;
  arrowDirection?: import("@/types/diagram").ArrowDirection;
}

export function eraserDirectionToLayout(
  direction: ParseResult["direction"],
): LayoutDirection {
  return direction === "up" || direction === "down" ? "TD" : "LR";
}

export interface ParseResult {
  title?: string;
  direction: "right" | "left" | "up" | "down";
  elements: ParsedElement[];
  connections: ParsedConnection[];
}

const SKIP_PREFIXES = [
  "direction",
  "colorMode",
  "styleMode",
  "typeface",
  "legend",
];

function stripComments(source: string): string {
  return source.replace(/\/\/.*$/gm, "");
}

function skipWhitespace(src: string, pos: number): number {
  while (pos < src.length) {
    if (src[pos] === " " || src[pos] === "\t" || src[pos] === "\r") {
      pos += 1;
      continue;
    }
    if (src[pos] === "\n") {
      pos += 1;
      continue;
    }
    if (src.startsWith("//", pos)) {
      const end = src.indexOf("\n", pos);
      pos = end === -1 ? src.length : end + 1;
      continue;
    }
    break;
  }
  return pos;
}

function parseQuotedName(src: string, pos: number): { name: string; pos: number } {
  if (src[pos] !== '"') throw new Error("Expected quoted name");
  pos += 1;
  let name = "";
  while (pos < src.length && src[pos] !== '"') {
    name += src[pos];
    pos += 1;
  }
  pos += 1;
  return { name, pos };
}

function parseName(src: string, pos: number): { name: string; pos: number } {
  pos = skipWhitespace(src, pos);
  if (src[pos] === '"') return parseQuotedName(src, pos);

  let name = "";
  while (pos < src.length) {
    const ch = src[pos];
    if (ch === "[" || ch === "{" || ch === "\n" || ch === "\r") break;
    name += ch;
    pos += 1;
  }
  return { name: name.trim(), pos };
}

function parseProperties(src: string, pos: number): { props: EraserProperties; pos: number } {
  pos = skipWhitespace(src, pos);
  const props: EraserProperties = {};
  if (src[pos] !== "[") return { props, pos };

  pos += 1;
  while (pos < src.length && src[pos] !== "]") {
    pos = skipWhitespace(src, pos);
    let key = "";
    while (pos < src.length && src[pos] !== ":" && src[pos] !== "]") {
      key += src[pos];
      pos += 1;
    }
    key = key.trim();
    if (!key || src[pos] !== ":") break;
    pos += 1;
    pos = skipWhitespace(src, pos);

    let value = "";
    if (src[pos] === '"') {
      const quoted = parseQuotedName(src, pos);
      value = quoted.name;
      pos = quoted.pos;
    } else {
      while (pos < src.length && src[pos] !== "," && src[pos] !== "]") {
        value += src[pos];
        pos += 1;
      }
      value = value.trim();
    }

    if (key === "icon") props.icon = value;
    else if (key === "color") props.color = value;
    else if (key === "label") props.label = value;

    pos = skipWhitespace(src, pos);
    if (src[pos] === ",") pos += 1;
  }

  if (src[pos] === "]") pos += 1;
  return { props, pos };
}

function parseElement(src: string, pos: number): { element: ParsedElement; pos: number } {
  pos = skipWhitespace(src, pos);
  const { name, pos: namePos } = parseName(src, pos);
  if (!name) throw new Error("Expected element name");

  const { props, pos: propsPos } = parseProperties(src, namePos);
  pos = skipWhitespace(src, propsPos);

  const children: ParsedElement[] = [];
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

function isConnectionLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (SKIP_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) return false;
  if (trimmed.startsWith("legend")) return false;
  return (
    trimmed.includes(">") ||
    trimmed.includes("<") ||
    /[^\s]\s-\s[^\s]/.test(trimmed)
  );
}

function parseBlock(src: string, pos: number): { elements: ParsedElement[]; pos: number } {
  const elements: ParsedElement[] = [];

  while (pos < src.length) {
    pos = skipWhitespace(src, pos);
    if (pos >= src.length) break;

    if (src[pos] === "}") return { elements, pos };

    const lineEnd = src.indexOf("\n", pos);
    const line =
      lineEnd === -1 ? src.slice(pos) : src.slice(pos, lineEnd);
    const trimmed = line.trim();

    if (!trimmed) {
      pos = lineEnd === -1 ? src.length : lineEnd + 1;
      continue;
    }

    if (trimmed.startsWith("direction")) {
      pos = lineEnd === -1 ? src.length : lineEnd + 1;
      continue;
    }

    if (
      SKIP_PREFIXES.some((prefix) => trimmed.startsWith(prefix)) ||
      trimmed.startsWith("legend")
    ) {
      pos = lineEnd === -1 ? src.length : lineEnd + 1;
      continue;
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

export function parseEraserDsl(source: string): ParseResult {
  const cleaned = stripComments(source).trim();
  const lines = cleaned.split("\n");
  let title: string | undefined;
  let direction: ParseResult["direction"] = "right";

  const firstContentIdx = lines.findIndex((line) => {
    const t = line.trim();
    return t && !t.startsWith("//");
  });

  if (firstContentIdx >= 0) {
    const first = lines[firstContentIdx].trim();
    if (
      !first.includes("[") &&
      !first.includes("{") &&
      !first.includes(">") &&
      !first.includes("<") &&
      !/[^\s]\s-\s[^\s]/.test(first) &&
      !SKIP_PREFIXES.some((p) => first.startsWith(p))
    ) {
      title = first;
      lines.splice(firstContentIdx, 1);
    }
  }

  const directionLine = lines.find((line) => line.trim().startsWith("direction"));
  if (directionLine) {
    const match = directionLine.trim().match(/direction\s+(right|left|up|down)/);
    if (match) direction = match[1] as ParseResult["direction"];
  }

  const body = lines.join("\n");
  const { elements, pos } = parseBlock(body, 0);

  const connections: ParsedConnection[] = [];
  const remainder = body.slice(pos).trim();
  if (remainder) {
    for (const line of remainder.split("\n")) {
      if (isConnectionLine(line)) {
        connections.push(...parseConnectionLine(line));
      }
    }
  }

  return { title, direction, elements, connections };
}

function createDiagramNode(
  name: string,
  properties: EraserProperties,
  isGroup: boolean,
  parentId?: string,
): DiagramNode {
  const id = generateId();
  const label = properties.label ?? name;
  const color = resolveEraserColor(properties.color, NODE_DEFAULTS.group.color);

  if (isGroup) {
    return {
      id,
      type: "group",
      position: { x: 0, y: 0 },
      parentId,
      data: {
        nodeType: "group",
        label,
        color,
        description: "",
        borderStyle: "solid",
        eraserName: name,
        ...(properties.icon ? { icon: properties.icon } : {}),
      },
      style: { width: 240, height: 180 },
    };
  }

  return {
    id,
    type: "service",
    position: { x: 0, y: 0 },
    parentId,
    extent: parentId ? "parent" : undefined,
    data: {
      nodeType: "service",
      label,
      color,
      description: "",
      borderStyle: "none",
      eraserName: name,
      ...(properties.icon ? { icon: properties.icon } : {}),
    },
  };
}

function flattenElements(
  elements: ParsedElement[],
  parentId?: string,
  nodes: DiagramNode[] = [],
): Map<string, string> {
  const nameToId = new Map<string, string>();

  for (const element of elements) {
    const node = createDiagramNode(
      element.name,
      element.properties,
      element.isGroup,
      parentId,
    );
    nodes.push(node);
    nameToId.set(element.name, node.id);

    if (element.isGroup && element.children.length > 0) {
      const childMap = flattenElements(element.children, node.id, nodes);
      for (const [name, id] of childMap) {
        nameToId.set(name, id);
      }
    }
  }

  return nameToId;
}

export function dslToDiagram(
  source: string,
  options?: {
    applyLayout?: boolean;
    existingNodes?: DiagramNode[];
    layoutDirection?: LayoutDirection;
  },
): DiagramSnapshot {
  const parsed = parseEraserDsl(source);
  const nodes: DiagramNode[] = [];
  const nameToId = flattenElements(parsed.elements, undefined, nodes);

  const edges: DiagramEdge[] = [];

  for (const connection of parsed.connections) {
    let sourceId = nameToId.get(connection.source);
    let targetId = nameToId.get(connection.target);

    if (!sourceId) {
      const placeholder = createDiagramNode(connection.source, {}, false);
      nodes.push(placeholder);
      nameToId.set(connection.source, placeholder.id);
      sourceId = placeholder.id;
    }

    if (!targetId) {
      const placeholder = createDiagramNode(connection.target, {}, false);
      nodes.push(placeholder);
      nameToId.set(connection.target, placeholder.id);
      targetId = placeholder.id;
    }

    const arrowDirection = connection.arrowDirection ?? "forward";
    const color = resolveEraserColor(connection.color, "#64748b");
    const edge = createEdge(
      {
        source: sourceId,
        target: targetId,
        sourceHandle: null,
        targetHandle: null,
      },
      DEFAULT_EDGE_TYPE,
      color,
    );
    edge.data = {
      label: connection.label ?? "",
      color,
      arrowDirection,
    };
    const markers = getEdgeMarkers(arrowDirection, color);
    if (markers.markerEnd) edge.markerEnd = markers.markerEnd;
    else delete edge.markerEnd;
    if (markers.markerStart) edge.markerStart = markers.markerStart;
    else delete edge.markerStart;
    edges.push(edge);
  }

  if (options?.existingNodes && !options.applyLayout) {
    const positionByName = new Map<string, { x: number; y: number }>();
    for (const node of options.existingNodes) {
      const key = node.data.eraserName ?? node.data.label;
      positionByName.set(key, { ...node.position });
    }
    for (const node of nodes) {
      const key = node.data.eraserName ?? node.data.label;
      const pos = positionByName.get(key);
      if (pos) node.position = pos;
    }
  }

  const layoutDir =
    options?.layoutDirection ?? eraserDirectionToLayout(parsed.direction);
  const laidOut = options?.applyLayout
    ? applyDiagramLayout(nodes, edges, layoutDir)
    : nodes;

  return { nodes: laidOut, edges };
}
