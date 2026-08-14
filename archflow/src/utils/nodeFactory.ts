import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import {
  humanizeIconId,
  NODE_TYPE_ERASER_ICONS,
} from "@/constants/eraserIcons";
import type { DiagramNode, NodeType } from "@/types/diagram";
import { generateId } from "@/utils/generateId";
import { slugifyEraserName } from "@/lib/eraser/eraserNames";

export function createNode(
  nodeType: NodeType,
  position: { x: number; y: number },
  iconId?: string,
): DiagramNode {
  const defaults = NODE_DEFAULTS[nodeType];
  const icon =
    iconId ?? (nodeType === "text" ? undefined : NODE_TYPE_ERASER_ICONS[nodeType]);
  const isGroup = nodeType === "group";

  return {
    id: generateId(),
    type: nodeType,
    position,
    data: {
      nodeType,
      label: iconId ? humanizeIconId(iconId) : defaults.label,
      color: defaults.color,
      description: defaults.description,
      borderStyle: isGroup ? "dashed" : nodeType === "text" ? "none" : "solid",
      ...(icon ? { icon } : {}),
      eraserName: slugifyEraserName(
        iconId ? humanizeIconId(iconId) : defaults.label,
      ),
    },
    style: isGroup ? { width: 280, height: 200 } : undefined,
  };
}

export function createTextLabel(position: { x: number; y: number }): DiagramNode {
  const id = generateId();
  return {
    id,
    type: "text",
    position,
    data: {
      nodeType: "text",
      label: "",
      color: NODE_DEFAULTS.text.color,
      description: "",
      borderStyle: "none",
      eraserName: slugifyEraserName(`label-${id.slice(0, 8)}`),
    },
  };
}

export function createNodeFromIcon(
  iconId: string,
  position: { x: number; y: number },
): DiagramNode {
  const node = createNode("service", position, iconId);
  node.data.borderStyle = "none";
  node.data.eraserName = iconId;
  return node;
}
