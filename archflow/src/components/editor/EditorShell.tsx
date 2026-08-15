"use client";

import { useEffect, useRef } from "react";
import { CodePanel } from "@/components/code-panel/CodePanel";
import { LayoutContextBanner } from "@/components/editor/LayoutContextBanner";
import { MobileEditorBanner } from "@/components/editor/MobileEditorBanner";
import { CanvasEmptyState } from "@/components/editor/CanvasEmptyState";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import { CanvasWrapper } from "@/components/canvas/CanvasWrapper";
import { CanvasInsertLayer } from "@/components/editor/CanvasInsertLayer";
import { CodeSheet } from "@/components/editor/CodeSheet";
import { DocumentPanel } from "@/components/editor/DocumentPanel";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { PropertiesSheet } from "@/components/editor/PropertiesSheet";
import { PropertiesPanel } from "@/components/properties/PropertiesPanel";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useEraserSync } from "@/hooks/useEraserSync";
import { useLayoutControl } from "@/hooks/useLayoutControl";
import { useMermaidSync } from "@/hooks/useMermaidSync";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deselectAll, pasteNodes, selectAll } from "@/store/slices/diagramSlice";
import {
  setCodeSheetOpen,
  setInsertPickerOpen,
  setPropertiesPanelOpen,
  setPropertiesPanelWidth,
  setSidebarOpen,
} from "@/store/slices/uiSlice";

interface EditorShellProps {
  diagramId: string;
}

function CanvasArea({
  copiedNodes,
  onAutoLayout,
  onResetLayout,
  onCode,
  onProperties,
}: {
  copiedNodes: Parameters<typeof pasteNodes>[0]["nodes"];
  onAutoLayout: (direction?: import("@/store/slices/uiSlice").LayoutDirection) => void;
  onResetLayout: () => void;
  onCode: () => void;
  onProperties: () => void;
}) {
  const dispatch = useAppDispatch();
  const propertiesPanelOpen = useAppSelector((state) => state.ui.propertiesPanelOpen);
  const propertiesPanelWidth = useAppSelector((state) => state.ui.propertiesPanelWidth);
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const hasSelection = Boolean(selectedNodeId || selectedEdgeId);

  return (
    <div className="flex h-full min-h-0 w-full flex-1">
      <main className="editor-canvas-area relative h-full min-h-0 min-w-0 flex-1 bg-[#141416]">
        <CanvasInsertLayer onCode={onCode} onProperties={onProperties} />
        <ContextMenu>
          <ContextMenuTrigger className="block h-full w-full">
            <CanvasErrorBoundary>
              <CanvasWrapper />
            </CanvasErrorBoundary>
            <CanvasEmptyState />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => dispatch(setInsertPickerOpen(true))}>
              Insert item…
            </ContextMenuItem>
            <ContextMenuItem onClick={() => dispatch(setSidebarOpen(true))}>
              Open drag palette
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              disabled={copiedNodes.length === 0}
              onClick={() => dispatch(pasteNodes({ nodes: copiedNodes }))}
            >
              Paste
            </ContextMenuItem>
            <ContextMenuItem onClick={() => dispatch(selectAll())}>
              Select all
            </ContextMenuItem>
            <ContextMenuItem onClick={() => dispatch(deselectAll())}>
              Deselect all
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <LayoutContextBanner onAutoLayout={onAutoLayout} onResetLayout={onResetLayout} />
      </main>

      {isLg ? (
        <PropertiesPanel
          open={propertiesPanelOpen && hasSelection}
          width={propertiesPanelWidth}
          onClose={() => dispatch(setPropertiesPanelOpen(false))}
          onResize={(width) => dispatch(setPropertiesPanelWidth(width))}
        />
      ) : null}
    </div>
  );
}

export function EditorShell({ diagramId }: EditorShellProps) {
  const dispatch = useAppDispatch();
  const propertiesPanelOpen = useAppSelector((state) => state.ui.propertiesPanelOpen);
  const codeSheetOpen = useAppSelector((state) => state.ui.codeSheetOpen);
  const editorViewMode = useAppSelector((state) => state.ui.editorViewMode);
  const codeDialect = useAppSelector((state) => state.ui.codeDialect);
  const mermaidCode = useAppSelector((state) => state.ui.mermaidCode);
  const copiedNodes = useAppSelector((state) => state.ui.copiedNodes);
  const isLg = useMediaQuery("(min-width: 1024px)");

  const { applyCodeFromEditor } = useEraserSync();
  const { runAutoLayout, resetFromCode, selectDiagram } = useLayoutControl();
  const { applyMermaidFromEditor, seedMermaidFromCanvas } = useMermaidSync();

  const prevDialect = useRef(codeDialect);

  useAutoSave(diagramId);
  useUndoRedo();

  useEffect(() => {
    if (prevDialect.current === codeDialect) return;
    prevDialect.current = codeDialect;
    if (codeDialect === "mermaid" && !mermaidCode.trim()) {
      seedMermaidFromCanvas();
    }
  }, [codeDialect, mermaidCode, seedMermaidFromCanvas]);

  const codePanel = (
    <CodePanel
      onEraserApply={applyCodeFromEditor}
      onMermaidApply={applyMermaidFromEditor}
      onSelectDiagram={selectDiagram}
    />
  );

  const openCode = () => dispatch(setCodeSheetOpen(true));
  const openProperties = () => dispatch(setPropertiesPanelOpen(true));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-background">
      <EditorTopBar onPropertiesClick={openProperties} onCodeClick={openCode} />
      <MobileEditorBanner />

      <div className="flex min-h-0 flex-1 overflow-hidden w-full">
        {editorViewMode === "document" ? (
          <div className="h-full min-h-0 w-full flex-1">
            <DocumentPanel diagramId={diagramId} />
          </div>
        ) : null}

        {editorViewMode === "both" ? (
          <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 lg:grid-cols-2">
            <div className="h-full min-h-[min(50vh,400px)] min-w-0 border-b border-border lg:min-h-0 lg:border-b-0 lg:border-r">
              <DocumentPanel diagramId={diagramId} compact />
            </div>
            <div className="relative flex h-full min-h-[min(50vh,400px)] min-w-0 flex-col lg:min-h-0">
              <CanvasArea
                copiedNodes={copiedNodes}
                onAutoLayout={runAutoLayout}
                onResetLayout={resetFromCode}
                onCode={openCode}
                onProperties={openProperties}
              />
            </div>
          </div>
        ) : null}

        {editorViewMode === "canvas" ? (
          <CanvasArea
            copiedNodes={copiedNodes}
            onAutoLayout={runAutoLayout}
            onResetLayout={resetFromCode}
            onCode={openCode}
            onProperties={openProperties}
          />
        ) : null}
      </div>

      {!isLg ? (
        <PropertiesSheet
          open={propertiesPanelOpen}
          onOpenChange={(open) => dispatch(setPropertiesPanelOpen(open))}
        />
      ) : null}

      <CodeSheet
        open={codeSheetOpen}
        onOpenChange={(open) => dispatch(setCodeSheetOpen(open))}
      >
        {codePanel}
      </CodeSheet>
    </div>
  );
}
