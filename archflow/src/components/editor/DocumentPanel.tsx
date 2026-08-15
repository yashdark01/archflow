"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { DocumentFormatToolbar } from "@/components/editor/DocumentFormatToolbar";
import { GeneratePromptButton } from "@/components/editor/GeneratePromptButton";
import { isDocumentEmpty } from "@/lib/document/normalizeContent";
import { cn } from "@/lib/utils";

interface DocumentPanelProps {
  diagramId: string;
  /** When true, embeds diagram-as-code below notes (legacy; prefer Code sheet) */
  showCode?: boolean;
  codeSlot?: ReactNode;
  compact?: boolean;
}

export function DocumentPanel({
  diagramId,
  showCode,
  codeSlot,
  compact,
}: DocumentPanelProps) {
  const title = useAppSelector((state) => state.ui.diagramTitle);
  const documentNotes = useAppSelector((state) => state.ui.documentNotes);
  const showGenerate = isDocumentEmpty(documentNotes);

  return (
    <div className="editor-document relative flex h-full min-h-0 flex-col bg-[#141416]">
      <div className={cn("shrink-0 px-6 pt-6 sm:px-10 sm:pt-8", compact && "px-4 pt-4")}>
        <h1
          className={cn(
            "font-semibold tracking-tight text-foreground",
            compact ? "text-xl" : "text-2xl sm:text-3xl",
          )}
        >
          {title || "Untitled File"}
        </h1>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-6 sm:px-10",
            compact ? "pb-16 px-4" : "pb-20",
          )}
        >
          {showGenerate ? (
            <div className="flex justify-center py-4">
              <GeneratePromptButton label="Generate document" />
            </div>
          ) : null}
          <DocumentEditor diagramId={diagramId} compact={compact} />
        </div>

        {showCode && codeSlot ? (
          <div className="shrink-0 min-h-[220px] max-h-[42%] border-t border-white/10">
            {codeSlot}
          </div>
        ) : null}
      </div>

      <DocumentFormatToolbar />
    </div>
  );
}
