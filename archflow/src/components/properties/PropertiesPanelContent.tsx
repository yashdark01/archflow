"use client";

import type { ReactNode } from "react";
import { DiagramProperties } from "@/components/properties/DiagramProperties";
import { EdgeProperties } from "@/components/properties/EdgeProperties";
import { NodeProperties } from "@/components/properties/NodeProperties";
import { useAppSelector } from "@/store/hooks";

export function PropertiesPanelContent() {
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);

  let content: ReactNode = <DiagramProperties />;

  if (selectedNodeId) {
    content = <NodeProperties nodeId={selectedNodeId} />;
  } else if (selectedEdgeId) {
    content = <EdgeProperties edgeId={selectedEdgeId} />;
  }

  return <div className="overflow-y-auto p-4">{content}</div>;
}
