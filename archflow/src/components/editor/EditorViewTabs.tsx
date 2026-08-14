"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setEditorViewMode, type EditorViewMode } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

const MODES: { id: EditorViewMode; label: string }[] = [
  { id: "document", label: "Document" },
  { id: "both", label: "Both" },
  { id: "canvas", label: "Canvas" },
];

export function EditorViewTabs() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.ui.editorViewMode);

  return (
    <div
      className="flex items-center rounded-md border border-border bg-muted/50 p-0.5"
      role="tablist"
      aria-label="Editor view"
    >
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={mode === id}
          onClick={() => dispatch(setEditorViewMode(id))}
          className={cn(
            "rounded-[5px] px-3 py-1 text-xs font-medium transition-colors",
            mode === id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
