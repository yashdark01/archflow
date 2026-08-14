"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setEraserCode } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

interface CodeEditorPanelProps {
  onCodeApply: (code: string) => void;
  embedded?: boolean;
}

export function CodeEditorPanel({ onCodeApply, embedded = false }: CodeEditorPanelProps) {
  const dispatch = useAppDispatch();
  const eraserCode = useAppSelector((state) => state.ui.eraserCode);
  const diagramTitle = useAppSelector((state) => state.ui.diagramTitle);
  const applyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (applyTimerRef.current) clearTimeout(applyTimerRef.current);
    };
  }, []);

  const scheduleApply = (code: string) => {
    if (applyTimerRef.current) clearTimeout(applyTimerRef.current);
    applyTimerRef.current = setTimeout(() => {
      onCodeApply(code);
    }, 800);
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col",
        !embedded && "border-l border-border bg-[#1e1e1e]",
        embedded && "bg-transparent",
      )}
    >
      {!embedded ? (
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
          <span className="text-sm font-medium text-white/90">
            {diagramTitle || "Cloud Architecture"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            Eraser DSL
          </span>
        </div>
      ) : null}
      <textarea
        value={eraserCode}
        onChange={(event) => {
          const value = event.target.value;
          dispatch(setEraserCode(value));
          scheduleApply(value);
        }}
        spellCheck={false}
        className={cn(
          "min-h-0 flex-1 resize-none border-0 bg-transparent px-4 py-3",
          "font-mono text-[13px] leading-relaxed text-[#d4d4d4]",
          "outline-none focus-visible:ring-0",
          "selection:bg-emerald-500/30",
        )}
        aria-label="Eraser diagram as code editor"
      />
    </div>
  );
}
