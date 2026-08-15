import type { EdgeTypes } from "reactflow";
import { CustomEdge } from "@/components/canvas/edges/CustomEdge";

export const edgeTypes: EdgeTypes = {
  default: CustomEdge,
  straight: CustomEdge,
  step: CustomEdge,
  smoothstep: CustomEdge,
};
