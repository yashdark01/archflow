"use client";

import { useAppSelector } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";

export function DiagramTitle() {
  const title = useAppSelector((state) => state.ui.diagramTitle);
  const saveStatus = useAppSelector((state) => state.ui.saveStatus);

  const statusLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "unsaved"
        ? "Unsaved"
        : saveStatus === "error"
          ? "Save error"
          : "Saved";

  const statusVariant =
    saveStatus === "error" || saveStatus === "unsaved"
      ? "destructive"
      : saveStatus === "saving"
        ? "secondary"
        : "default";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <h1 className="truncate text-sm font-semibold">{title}</h1>
      <Badge variant={statusVariant} className="shrink-0">
        {statusLabel}
      </Badge>
    </div>
  );
}
