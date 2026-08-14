"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiagramTitle } from "@/components/toolbar/DiagramTitle";
import { CodeDialectSelect } from "@/components/toolbar/CodeDialectSelect";
import { EditorViewTabs } from "@/components/editor/EditorViewTabs";
import { ExportButton } from "@/components/toolbar/ExportButton";
import { UndoRedoButtons } from "@/components/toolbar/UndoRedoButtons";
import { Plus, Settings2 } from "lucide-react";

interface ToolbarProps {
  onInsertClick?: () => void;
  onPropertiesClick?: () => void;
}

export function Toolbar({ onInsertClick, onPropertiesClick }: ToolbarProps) {
  return (
    <header className="editor-toolbar flex h-12 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <Link
        href="/dashboard"
        className="hidden text-xs font-semibold tracking-tight text-muted-foreground hover:text-primary sm:inline"
      >
        ArchFlow
      </Link>
      <DiagramTitle />

      <div className="hidden md:flex md:flex-1 md:justify-center">
        <EditorViewTabs />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {onInsertClick ? (
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={onInsertClick}
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Insert</span>
          </Button>
        ) : null}

        <CodeDialectSelect />
        <UndoRedoButtons />
        <ExportButton />

        {onPropertiesClick ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open properties"
            onClick={onPropertiesClick}
          >
            <Settings2 className="size-4" />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
