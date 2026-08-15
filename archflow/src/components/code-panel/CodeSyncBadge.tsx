"use client";

import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function CodeSyncBadge() {
  const dialect = useAppSelector((state) => state.ui.codeDialect);
  const mermaidStatus = useAppSelector((state) => state.ui.mermaidSyncStatus);
  const mermaidError = useAppSelector((state) => state.ui.mermaidSyncError);
  const eraserStatus = useAppSelector((state) => state.ui.eraserSyncStatus);
  const eraserError = useAppSelector((state) => state.ui.eraserSyncError);

  const status = dialect === "eraser" ? eraserStatus : mermaidStatus;
  const error = dialect === "eraser" ? eraserError : mermaidError;

  const label =
    status === "synced"
      ? "Synced"
      : status === "error"
        ? "Validation error"
        : "Syncing…";

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        status === "synced" && "bg-emerald-500/15 text-emerald-400",
        status === "pending" && "bg-amber-500/15 text-amber-400",
        status === "error" && "bg-red-500/15 text-red-400",
      )}
      title={error ?? undefined}
    >
      {label}
    </span>
  );
}
