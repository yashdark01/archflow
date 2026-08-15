import type { NodeTypes } from "reactflow";
import { CanvasNode } from "@/components/canvas/nodes/CanvasNode";

export const nodeTypes: NodeTypes = {
  service: CanvasNode,
  database: CanvasNode,
  cache: CanvasNode,
  queue: CanvasNode,
  apiGateway: CanvasNode,
  loadBalancer: CanvasNode,
  user: CanvasNode,
  group: CanvasNode,
  cloud: CanvasNode,
  text: CanvasNode,
};
