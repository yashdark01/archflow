"use client";

import { memo } from "react";
import type { NodeProps } from "reactflow";
import type { NodeData } from "@/types/diagram";
import { inferCanvasNodeVariant } from "@/lib/canvas/style/nodeDesign";
import { BoxedNode } from "@/components/canvas/nodes/BoxedNode";
import { GroupNode } from "@/components/canvas/nodes/GroupNode";
import { IconNode } from "@/components/canvas/nodes/IconNode";
import { TextLabelNode } from "@/components/canvas/nodes/TextLabelNode";

function CanvasNodeComponent({ id, data, selected }: NodeProps<NodeData>) {
  const variant = inferCanvasNodeVariant({
    nodeType: data.nodeType,
    icon: data.icon,
    borderStyle: data.borderStyle,
  });

  switch (variant) {
    case "text":
      return <TextLabelNode id={id} data={data} selected={selected} />;
    case "group":
      return <GroupNode data={data} selected={selected} />;
    case "icon":
    case "iconOnly":
      return <IconNode id={id} data={data} selected={selected} />;
    case "boxed":
    default:
      return <BoxedNode id={id} data={data} selected={selected} />;
  }
}

export const CanvasNode = memo(CanvasNodeComponent);
