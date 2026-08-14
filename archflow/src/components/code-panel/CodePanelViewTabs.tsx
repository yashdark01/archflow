"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCodePanelTab, type CodePanelTab } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

export function CodePanelViewTabs() {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.ui.codePanelTab);
  const dialect = useAppSelector((state) => state.ui.codeDialect);

  const tabs: { id: CodePanelTab; label: string }[] =
    dialect === "eraser"
      ? [
          { id: "code", label: "DSL" },
          { id: "preview", label: "Preview" },
        ]
      : [
          { id: "code", label: "Code" },
          { id: "preview", label: "Preview" },
        ];

  return (
    <div
      className="flex items-center rounded-md border border-white/10 bg-black/20 p-0.5"
      role="tablist"
      aria-label="Code panel view"
    >
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => dispatch(setCodePanelTab(id))}
          className={cn(
            "rounded px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors",
            tab === id
              ? "bg-white/15 text-white"
              : "text-white/50 hover:text-white/80",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
