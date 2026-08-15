"use client";

import { useCallback, useEffect, useState } from "react";
import { EraserMonacoEditor } from "@/components/code-panel/EraserMonacoEditor";
import { Button } from "@/components/ui/button";
import { useApplyEraserCode } from "@/hooks/useApplyEraserCode";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCodePanelDirty, setEraserCode } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import { Check, Copy, RotateCcw } from "lucide-react";

export function CodePanelEditor() {
  const dispatch = useAppDispatch();
  const eraserCode = useAppSelector((state) => state.ui.eraserCode);
  const codePanelDirty = useAppSelector((state) => state.ui.codePanelDirty);
  const applyEraserCode = useApplyEraserCode();

  const [value, setValue] = useState(eraserCode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!codePanelDirty) {
      setValue(eraserCode);
      setError(null);
    }
  }, [eraserCode, codePanelDirty]);

  const onEditorChange = useCallback(
    (next: string) => {
      setValue(next);
      setError(null);
      dispatch(setCodePanelDirty(true));
      dispatch(setEraserCode(next));
    },
    [dispatch],
  );

  const apply = useCallback(() => {
    const result = applyEraserCode(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
  }, [applyEraserCode, value]);

  const reset = useCallback(() => {
    setValue(eraserCode);
    setError(null);
    dispatch(setCodePanelDirty(false));
  }, [dispatch, eraserCode]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard may be unavailable
    }
  }, [value]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            error
              ? "bg-destructive/15 text-destructive"
              : codePanelDirty
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {error ? "Error" : codePanelDirty ? "Modified" : "Synced"}
        </span>
        <Button type="button" size="sm" variant="secondary" className="h-7 gap-1" onClick={apply}>
          <Check className="size-3.5" />
          Apply
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Reset code"
          onClick={reset}
          disabled={!codePanelDirty}
        >
          <RotateCcw className="size-3.5" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Copy code"
          onClick={copyCode}
        >
          <Copy className="size-3.5" />
        </Button>
      </div>

      {error ? (
        <div className="shrink-0 border-b border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <EraserMonacoEditor value={value} onChange={onEditorChange} />
      </div>
    </div>
  );
}
