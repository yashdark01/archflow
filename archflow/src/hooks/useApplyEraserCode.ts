"use client";

import { useCallback } from "react";
import { parseDocument } from "@/lib/canvas/document/parseDocument";
import {
  formatDocumentValidationSummary,
  validateDocument,
} from "@/lib/canvas/document/validateDocument";
import {
  eraserDirectionToRankDir,
  rankDirToLayoutDirection,
} from "@/lib/canvas/layout/direction";
import { useAppDispatch } from "@/store/hooks";
import { loadCanvasDocument, updateDocumentTitle } from "@/store/slices/diagramSlice";
import {
  setCodePanelDirty,
  setDiagramTitle,
  setLayoutDirection,
  setLayoutManual,
} from "@/store/slices/uiSlice";

export type ApplyEraserCodeResult =
  | { ok: true }
  | { ok: false; error: string };

export function useApplyEraserCode() {
  const dispatch = useAppDispatch();

  return useCallback(
    (source: string): ApplyEraserCodeResult => {
      try {
        const document = parseDocument(source);
        const issues = validateDocument(document);
        if (issues.length > 0) {
          return {
            ok: false,
            error: formatDocumentValidationSummary(issues),
          };
        }

        dispatch(
          loadCanvasDocument({
            document,
            layoutOverrides: {},
          }),
        );
        dispatch(setLayoutManual(false));
        const title = document.title ?? "Untitled Diagram";
        dispatch(setDiagramTitle(title));
        dispatch(updateDocumentTitle(title));
        dispatch(setCodePanelDirty(false));
        dispatch(
          setLayoutDirection(
            rankDirToLayoutDirection(eraserDirectionToRankDir(document.style.direction)),
          ),
        );

        window.setTimeout(() => {
          window.dispatchEvent(new Event("archflow:fit-view"));
        }, 120);

        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error ? error.message : "Could not parse diagram code.",
        };
      }
    },
    [dispatch],
  );
}
