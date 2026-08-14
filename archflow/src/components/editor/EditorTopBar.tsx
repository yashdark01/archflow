"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditorViewTabs } from "@/components/editor/EditorViewTabs";
import { ExportButton } from "@/components/toolbar/ExportButton";
import { UndoRedoButtons } from "@/components/toolbar/UndoRedoButtons";
import { CodeDialectSelect } from "@/components/toolbar/CodeDialectSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDiagramTitle, toggleColorScheme } from "@/store/slices/uiSlice";
import {
  Link2,
  MessageSquare,
  Moon,
  MoreHorizontal,
  PanelRight,
  Sparkles,
  Sun,
} from "lucide-react";

interface EditorTopBarProps {
  onPropertiesClick?: () => void;
  onCodeClick?: () => void;
}

export function EditorTopBar({ onPropertiesClick, onCodeClick }: EditorTopBarProps) {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.ui.diagramTitle);
  const saveStatus = useAppSelector((state) => state.ui.saveStatus);
  const colorScheme = useAppSelector((state) => state.ui.colorScheme);

  return (
    <header className="editor-top-bar flex h-11 shrink-0 items-center gap-2 border-b border-border bg-card px-2 sm:px-3">
      <div className="flex min-w-0 items-center gap-2">
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
          onChange={(event) => dispatch(setDiagramTitle(event.target.value))}
          className="min-w-0 max-w-[140px] truncate bg-transparent text-sm font-medium outline-none sm:max-w-[200px]"
          aria-label="File name"
        />
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="File menu"
        >
          <MoreHorizontal className="size-4" />
        </button>
        {saveStatus === "saving" ? (
          <span className="hidden text-[10px] text-muted-foreground sm:inline">Saving…</span>
        ) : null}
      </div>

      <div className="flex flex-1 justify-center px-2">
        <EditorViewTabs />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="hidden h-7 px-2 text-xs text-muted-foreground lg:inline-flex"
          disabled
        >
          ⌘ K
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-7 gap-1.5 text-xs" disabled>
          <Link2 className="size-3.5" />
          Share
        </Button>
        <Button type="button" size="sm" className="h-7 gap-1.5 text-xs" disabled>
          <Sparkles className="size-3.5" />
          <span className="hidden sm:inline">ArchFlow AI</span>
        </Button>
        <CodeDialectSelect />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={colorScheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => dispatch(toggleColorScheme())}
        >
          {colorScheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
        <UndoRedoButtons />
        <ExportButton />
        {onCodeClick ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Diagram as code"
            onClick={onCodeClick}
          >
            <PanelRight className="size-4" />
          </Button>
        ) : null}
        {onPropertiesClick ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Comments and properties"
            onClick={onPropertiesClick}
          >
            <MessageSquare className="size-4" />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
