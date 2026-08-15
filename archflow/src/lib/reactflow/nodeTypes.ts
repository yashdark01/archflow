import type { NodeTypes } from "reactflow";
import { ArchflowNode } from "@/components/nodes/BaseNode";

export const nodeTypes: NodeTypes = {
  service: ArchflowNode,
  database: ArchflowNode,
  cache: ArchflowNode,
  queue: ArchflowNode,
  apiGateway: ArchflowNode,
  loadBalancer: ArchflowNode,
  user: ArchflowNode,
  group: ArchflowNode,
  cloud: ArchflowNode,
  text: ArchflowNode,
};
