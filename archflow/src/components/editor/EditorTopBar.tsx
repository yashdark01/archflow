"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/toolbar/ExportButton";
import { UndoRedoButtons } from "@/components/toolbar/UndoRedoButtons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDiagramTitle, toggleColorScheme, type RightPanelTab } from "@/store/slices/uiSlice";
import { updateDocumentTitle } from "@/store/slices/diagramSlice";
import { MessageSquare, Moon, Sun, Code2, PanelRightClose } from "lucide-react";

interface EditorTopBarProps {
  onPropertiesClick?: () => void;
  onCodeClick?: () => void;
  onClosePanel?: () => void;
  rightPanelOpen?: boolean;
  rightPanelTab?: RightPanelTab;
}

export function EditorTopBar({
  onPropertiesClick,
  onCodeClick,
  onClosePanel,
  rightPanelOpen = false,
  rightPanelTab = "properties",
}: EditorTopBarProps) {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.ui.diagramTitle);
  const saveStatus = useAppSelector((state) => state.ui.saveStatus);
  const colorScheme = useAppSelector((state) => state.ui.colorScheme);

  return (
    <header className="editor-top-bar flex h-11 shrink-0 items-center gap-2 border-b border-border bg-card px-2 sm:px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          href="/dashboard"
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary"
          aria-label="Back to dashboard"
        >
          AF
        </Link>
        <input
          type="text"
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            dispatch(setDiagramTitle(value));
            dispatch(updateDocumentTitle(value));
          }}
          className="min-w-0 max-w-[140px] truncate bg-transparent text-sm font-medium outline-none sm:max-w-[240px]"
          aria-label="File name"
        />
        {saveStatus === "saving" ? (
          <span className="hidden text-[10px] text-muted-foreground sm:inline">Saving…</span>
        ) : null}
        {saveStatus === "saved" ? (
          <span className="hidden text-[10px] text-muted-foreground sm:inline">Saved</span>
        ) : null}
        {saveStatus === "unsaved" ? (
          <span className="hidden text-[10px] text-amber-600 dark:text-amber-400 sm:inline">
            Unsaved
          </span>
        ) : null}
        {saveStatus === "error" ? (
          <span className="hidden text-[10px] text-destructive sm:inline">Save error</span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={colorScheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => dispatch(toggleColorScheme())}
        >
          {colorScheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <UndoRedoButtons />
        {onCodeClick ? (
          <Button
            type="button"
            variant={
              rightPanelOpen && rightPanelTab === "code" ? "secondary" : "ghost"
            }
            size="icon-sm"
            aria-label="Diagram as code"
            aria-pressed={rightPanelOpen && rightPanelTab === "code"}
            onClick={onCodeClick}
          >
            <Code2 className="size-4" />
          </Button>
        ) : null}
        <ExportButton />
        {onPropertiesClick ? (
          <Button
            type="button"
            variant={
              rightPanelOpen && rightPanelTab === "properties" ? "secondary" : "ghost"
            }
            size="icon-sm"
            aria-label="Properties"
            aria-pressed={rightPanelOpen && rightPanelTab === "properties"}
            onClick={onPropertiesClick}
          >
            <MessageSquare className="size-4" />
          </Button>
        ) : null}
        {rightPanelOpen && onClosePanel ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close panel"
            onClick={onClosePanel}
          >
            <PanelRightClose className="size-4" />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
