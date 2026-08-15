import type {
  ArrowDirection,
  BorderStyle,
  EdgeStrokeStyle,
  NodeData,
  NodeType,
} from "@/types/diagram";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { resolveEraserColor } from "@/lib/eraser/colors";
import type { EraserConnection, EraserElement } from "@/lib/canvas/schema";
import { CONNECTOR_TO_ARROW, CONNECTOR_TO_STROKE } from "@/lib/canvas/schema";

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

export function mapEraserElementToNodeData(element: EraserElement): NodeData {
  const { nodeType, borderStyle } = mapEraserElementToNodeType(element);
  const defaults = NODE_DEFAULTS[nodeType];
  const color = resolveEraserColor(element.properties.color, defaults.color);
  const label =
    element.properties.label?.trim() || element.name.trim() || defaults.label;
  return {
    nodeType,
    label,
    color,
    description: defaults.description,
    borderStyle,
    icon: element.properties.icon ?? undefined,
    eraserName: element.name,
    ...(element.properties.link ? { link: element.properties.link } : {}),
    ...(element.properties.colorMode
      ? { colorMode: element.properties.colorMode }
      : {}),
    ...(element.properties.styleMode
      ? { styleMode: element.properties.styleMode }
      : {}),
    ...(element.properties.typeface
      ? { typeface: element.properties.typeface }
      : {}),
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
