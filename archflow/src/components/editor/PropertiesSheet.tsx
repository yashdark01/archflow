"use client";

import { DiagramProperties } from "@/components/properties/DiagramProperties";
import { EdgeProperties } from "@/components/properties/EdgeProperties";
import { NodeProperties } from "@/components/properties/NodeProperties";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/store/hooks";

interface PropertiesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertiesSheet({ open, onOpenChange }: PropertiesSheetProps) {
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);

  let title = "Diagram";
  let description = "Diagram defaults and legend.";
  let content = <DiagramProperties />;

  if (selectedNodeId) {
    title = "Node";
    description = "Edit the selected node.";
    content = <NodeProperties nodeId={selectedNodeId} />;
  } else if (selectedEdgeId) {
    title = "Edge";
    description = "Edit the selected connection.";
    content = <EdgeProperties edgeId={selectedEdgeId} />;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-4">{content}</div>
      </SheetContent>
    </Sheet>
  );
}
