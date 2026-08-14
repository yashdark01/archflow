"use client";

import { useAppSelector } from "@/store/hooks";
import { GeneratePromptButton } from "@/components/editor/GeneratePromptButton";

export function CanvasEmptyState() {
  const nodeCount = useAppSelector((state) => state.diagram.nodes.length);
  const editorViewMode = useAppSelector((state) => state.ui.editorViewMode);

  if (nodeCount > 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
      <div className="pointer-events-auto flex flex-col items-center gap-4 text-center">
        <GeneratePromptButton label="Generate AI Diagram" />
        {editorViewMode === "canvas" ? (
          <p className="text-xs text-muted-foreground">
            Or open diagram-as-code from the toolbar
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Or edit diagram-as-code in the document panel
          </p>
        )}
      </div>
    </div>
  );
}
