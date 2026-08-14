"use client";

import { useRef } from "react";
import { CodeEditorPanel } from "@/components/editor/CodeEditorPanel";
import { CodeSyncBadge } from "@/components/code-panel/CodeSyncBadge";
import { CodePanelViewTabs } from "@/components/code-panel/CodePanelViewTabs";
import { MermaidEditor } from "@/components/code-panel/MermaidEditor";
import { MermaidPreview } from "@/components/code-panel/MermaidPreview";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMermaidCode,
  setMermaidSyncError,
  setMermaidSyncStatus,
} from "@/store/slices/uiSlice";
import { ClipboardCopy } from "lucide-react";

interface CodePanelProps {
  onEraserApply: (code: string) => void;
  onMermaidApply: (code: string) => void;
  onSelectDiagram?: () => void;
}

export function CodePanel({
  onEraserApply,
  onMermaidApply,
  onSelectDiagram,
}: CodePanelProps) {
  const dispatch = useAppDispatch();
  const dialect = useAppSelector((state) => state.ui.codeDialect);
  const codePanelTab = useAppSelector((state) => state.ui.codePanelTab);
  const mermaidCode = useAppSelector((state) => state.ui.mermaidCode);
  const eraserCode = useAppSelector((state) => state.ui.eraserCode);
  const diagramTitle = useAppSelector((state) => state.ui.diagramTitle);
  const applyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleMermaidApply = (value: string) => {
    dispatch(setMermaidCode(value));
    dispatch(setMermaidSyncStatus("pending"));
    if (applyTimerRef.current) clearTimeout(applyTimerRef.current);
    applyTimerRef.current = setTimeout(() => onMermaidApply(value), 400);
  };

  const copySnippet = async () => {
    const text = dialect === "mermaid" ? mermaidCode : eraserCode;
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  const showCode = codePanelTab === "code";
  const showPreview = codePanelTab === "preview";

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <div
          className="flex min-w-0 items-center gap-2"
          onClick={() => onSelectDiagram?.()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectDiagram?.();
            }
          }}
          title="Click to select entire diagram on canvas"
        >
          <span className="truncate cursor-pointer text-sm font-medium text-white/90 hover:text-white">
            {diagramTitle || "Diagram"}
          </span>
          <CodeSyncBadge />
        </div>
        <div className="flex items-center gap-2">
          <CodePanelViewTabs />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-white/70 hover:text-white"
            aria-label="Copy snippet"
            onClick={() => copySnippet()}
          >
            <ClipboardCopy className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {dialect === "eraser" ? (
          <>
            {showCode ? (
              <div className="absolute inset-0 min-h-0">
                <CodeEditorPanel onCodeApply={onEraserApply} embedded />
              </div>
            ) : null}
            {showPreview ? (
              <div className="absolute inset-0 min-h-0 overflow-auto p-4">
                <pre
                  className="font-mono text-[13px] leading-relaxed text-[#d4d4d4] whitespace-pre-wrap"
                  aria-label="Eraser DSL preview"
                >
                  {eraserCode || "No diagram-as-code yet."}
                </pre>
                <p className="mt-4 text-xs text-white/40">
                  Read-only view · switch to Code to edit · canvas shows the live diagram
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {showCode ? (
              <div className="absolute inset-0 min-h-0">
                <MermaidEditor
                  value={mermaidCode}
                  onChange={scheduleMermaidApply}
                />
              </div>
            ) : null}
            {showPreview ? (
              <div className="absolute inset-0 min-h-0">
                <MermaidPreview
                  code={mermaidCode}
                  onParseError={(message) => {
                    if (message) {
                      dispatch(setMermaidSyncStatus("error"));
                      dispatch(setMermaidSyncError(message));
                    } else {
                      dispatch(setMermaidSyncStatus("synced"));
                      dispatch(setMermaidSyncError(null));
                    }
                  }}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
