"use client";

import { EditorRightPanel } from "@/components/editor/EditorRightPanel";
import { RightPanelOpener } from "@/components/editor/RightPanelOpener";
import { RightPanelSheet } from "@/components/editor/RightPanelSheet";
import { LayoutContextBanner } from "@/components/editor/LayoutContextBanner";
import { MobileEditorBanner } from "@/components/editor/MobileEditorBanner";
import { CanvasEmptyState } from "@/components/editor/CanvasEmptyState";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import { CanvasWrapper } from "@/components/canvas/CanvasWrapper";
import { CanvasInsertLayer } from "@/components/editor/CanvasInsertLayer";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useCanvasStructureSync } from "@/hooks/useCanvasStructureSync";
import { useEraserCodeSync } from "@/hooks/useEraserCodeSync";
import { useCanvasFullViewFit } from "@/hooks/useCanvasFullViewFit";
import { useEditorKeyboard } from "@/hooks/useEditorKeyboard";
import { useLayoutControl } from "@/hooks/useLayoutControl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deselectAll, pasteNodes, selectAll } from "@/store/slices/diagramSlice";
import {
  openRightPanelTab,
  setInsertPickerOpen,
  setRightPanelOpen,
  setRightPanelWidth,
  setSidebarOpen,
} from "@/store/slices/uiSlice";

interface EditorShellProps {
  diagramId: string;
}

function CanvasArea({
  copiedNodes,
  onAutoLayout,
  onResetLayout,
  onOpenPanel,
}: {
  copiedNodes: Parameters<typeof pasteNodes>[0]["nodes"];
  onAutoLayout: (direction?: import("@/store/slices/uiSlice").LayoutDirection) => void;
  onResetLayout: () => void;
  onOpenPanel: (tab: import("@/store/slices/uiSlice").RightPanelTab) => void;
}) {
  const dispatch = useAppDispatch();
  const rightPanelOpen = useAppSelector((state) => state.ui.rightPanelOpen);
  const isLg = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex min-h-0 flex-1 h-full w-full">
      <main className="editor-canvas-area relative h-full min-h-0 min-w-0 flex-1 bg-[#141416]">
        <CanvasInsertLayer onProperties={() => onOpenPanel("properties")} />
        {!rightPanelOpen && isLg ? <RightPanelOpener /> : null}
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
            <ContextMenuItem onClick={() => onOpenPanel("code")}>
              Diagram as code…
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

      {isLg && rightPanelOpen ? (
        <EditorRightPanel
          onClose={() => dispatch(setRightPanelOpen(false))}
          onResize={(width) => dispatch(setRightPanelWidth(width))}
        />
      ) : null}
    </div>
  );
}

export function EditorShell({ diagramId }: EditorShellProps) {
  const dispatch = useAppDispatch();
  const rightPanelOpen = useAppSelector((state) => state.ui.rightPanelOpen);
  const rightPanelTab = useAppSelector((state) => state.ui.rightPanelTab);
  const copiedNodes = useAppSelector((state) => state.ui.copiedNodes);
  const isLg = useMediaQuery("(min-width: 1024px)");

  const { runAutoLayout, resetFromCode } = useLayoutControl();

  useAutoSave(diagramId);
  useCanvasStructureSync();
  useEraserCodeSync();
  useEditorKeyboard();
  useCanvasFullViewFit();
  useUndoRedo();

  const openPanelTab = (tab: import("@/store/slices/uiSlice").RightPanelTab) => {
    dispatch(openRightPanelTab(tab));
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-background">
      <EditorTopBar
        onPropertiesClick={() => openPanelTab("properties")}
        onCodeClick={() => openPanelTab("code")}
        onClosePanel={() => dispatch(setRightPanelOpen(false))}
        rightPanelOpen={rightPanelOpen}
        rightPanelTab={rightPanelTab}
      />
      <MobileEditorBanner />

      <div className="flex min-h-0 flex-1 overflow-hidden w-full">
        <CanvasArea
          copiedNodes={copiedNodes}
          onAutoLayout={runAutoLayout}
          onResetLayout={resetFromCode}
          onOpenPanel={openPanelTab}
        />
      </div>

      {!isLg ? (
        <RightPanelSheet
          open={rightPanelOpen}
          onOpenChange={(open) => dispatch(setRightPanelOpen(open))}
        />
      ) : null}
    </div>
  );
}
