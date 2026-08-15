/**
 * Maps Eraser DSL concepts to ArchFlow canvas types (`types/diagram.ts`).
 */

import type {
  ArrowDirection,
  BorderStyle,
  DiagramEdge,
  DiagramNode,
  EdgeStrokeStyle,
  NodeData,
  NodeType,
} from "@/types/diagram";
import { NODE_TYPE_ERASER_ICONS } from "@/constants/eraserIcons";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { resolveEraserColor } from "@/lib/eraser/colors";
import type { EraserElement, EraserConnection } from "@/lib/canvas/schema";
import { CONNECTOR_TO_ARROW, CONNECTOR_TO_STROKE } from "@/lib/canvas/schema";
import { inferCanvasNodeVariant } from "@/lib/canvas/style/nodeDesign";

export interface ArchflowCanvasSnapshot {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/** ArchFlow `NodeData` fields driven by Eraser DSL today. */
export const ARCHFLOW_NODE_DATA_FIELDS: (keyof NodeData)[] = [
  "nodeType",
  "label",
  "color",
  "description",
  "borderStyle",
  "icon",
  "eraserName",
];

/** ArchFlow edge data fields driven by Eraser connections today. */
export const ARCHFLOW_EDGE_DATA_FIELDS = [
  "label",
  "color",
  "arrowDirection",
  "strokeWidth",
  "strokeStyle",
  "bendPoint",
] as const;

/**
 * Map parsed Eraser element → ArchFlow node type + border style for canvas.
 */
export function mapEraserElementToNodeType(element: EraserElement): {
  nodeType: NodeType;
  borderStyle: BorderStyle;
} {
  if (element.isGroup) {
    return { nodeType: "group", borderStyle: "solid" };
  }
  if (element.properties.icon) {
    return { nodeType: "service", borderStyle: "none" };
  }
  return { nodeType: "service", borderStyle: "solid" };
}

/**
 * Build `NodeData` defaults from a parsed Eraser element (before layout position).
 */
export function mapEraserElementToNodeData(element: EraserElement): NodeData {
  const { nodeType, borderStyle } = mapEraserElementToNodeType(element);
  const defaults = NODE_DEFAULTS[nodeType];
  const color = resolveEraserColor(
    element.properties.color,
    defaults.color,
  );
  const label =
    element.properties.label?.trim() || element.name.trim() || defaults.label;
  const icon =
    element.properties.icon ??
    (nodeType !== "text" && nodeType !== "group"
      ? NODE_TYPE_ERASER_ICONS[nodeType]
      : undefined);

  return {
    nodeType,
    label,
    color,
    description: defaults.description,
    borderStyle,
    icon: icon ?? undefined,
    eraserName: element.name,
  };
}

export function mapEraserConnectionToEdgeData(
  connection: EraserConnection,
): {
  label: string;
  color: string;
  arrowDirection: ArrowDirection;
  strokeStyle: EdgeStrokeStyle;
  connector: EraserConnection["connector"];
} {
  const arrowDirection: ArrowDirection =
    CONNECTOR_TO_ARROW[connection.connector] ?? "forward";
  const strokeStyle: EdgeStrokeStyle =
    CONNECTOR_TO_STROKE[connection.connector] ?? "solid";

  return {
    label: connection.label ?? "",
    color: resolveEraserColor(connection.color, "#94a3b8"),
    arrowDirection,
    strokeStyle,
    connector: connection.connector,
  };
}

/** Describe how a placed node should look on canvas. */
export function describeCanvasNode(node: DiagramNode) {
  const data = node.data;
  const variant = inferCanvasNodeVariant({
    nodeType: data.nodeType,
    icon: data.icon,
    borderStyle: data.borderStyle,
  });

  return {
    id: node.id,
    eraserName: data.eraserName,
    variant,
    label: data.label,
    color: data.color,
    icon: data.icon,
    parentId: node.parentNode,
  };
}

/**
 * Layout edit behavior (Eraser draggable-edits-beta parity).
 */
export const LAYOUT_EDIT_RULES = {
  /** Manual positions preserved until structure key changes or reset. */
  preserveManualPositions: true,
  /** Significant DSL structure change triggers auto relayout (like Eraser code edit). */
  autoResetOnStructureChange: true,
  /** Group nodes support resize via React Flow NodeResizer. */
  resizableGroups: true,
  /** Edges support bend handle for manual routing. */
  manualEdgeBends: true,
} as const;
