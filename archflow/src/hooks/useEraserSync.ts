"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadDiagram } from "@/store/slices/diagramSlice";
import {
  resetLayout,
  setEraserCode,
  setEraserSyncError,
  setEraserSyncStatus,
  setLayoutDirection,
} from "@/store/slices/uiSlice";
import {
  dslToDiagram,
  eraserDirectionToLayout,
  parseEraserDsl,
} from "@/lib/eraser/parse";
import { diagramToDsl } from "@/lib/eraser/serialize";
import { formatValidationSummary, validateDiagram } from "@/lib/eraser/validate";
import { useDiagramStructureKey } from "@/hooks/useDiagramStructureKey";

export function useEraserSync() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const codeDialect = useAppSelector((state) => state.ui.codeDialect);
  const diagramTitle = useAppSelector((state) => state.ui.diagramTitle);
  const structureKey = useDiagramStructureKey(nodes, edges);

  const initialized = useRef(false);
  const suppressCanvasSync = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      suppressCanvasSync.current = false;
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialized.current && nodes.length > 0) {
      initialized.current = true;
    }
  }, [nodes.length]);

  useEffect(() => {
    if (codeDialect !== "eraser") return;
    if (!initialized.current || suppressCanvasSync.current) return;

    const timer = window.setTimeout(() => {
      suppressCanvasSync.current = true;

      const issues = validateDiagram(nodes, edges);
      if (issues.length > 0) {
        dispatch(setEraserSyncStatus("error"));
        dispatch(setEraserSyncError(formatValidationSummary(issues)));
      } else {
        dispatch(setEraserSyncStatus("synced"));
        dispatch(setEraserSyncError(null));
        const code = diagramToDsl(nodes, edges, diagramTitle);
        dispatch(setEraserCode(code));
      }

      window.setTimeout(() => {
        suppressCanvasSync.current = false;
      }, 50);
    }, 600);

    return () => window.clearTimeout(timer);
    // Sync on structural changes only — positions excluded via structureKey
    // eslint-disable-next-line react-hooks/exhaustive-deps -- structure only
  }, [codeDialect, dispatch, structureKey, diagramTitle]);

  const applyCodeFromEditor = useCallback(
    (code: string) => {
      suppressCanvasSync.current = true;
      initialized.current = true;
      dispatch(resetLayout());
      dispatch(setEraserSyncStatus("pending"));

      const parsed = parseEraserDsl(code);
      const layoutDir = eraserDirectionToLayout(parsed.direction);
      dispatch(setLayoutDirection(layoutDir));

      const snapshot = dslToDiagram(code, {
        applyLayout: true,
        layoutDirection: layoutDir,
      });

      const issues = validateDiagram(snapshot.nodes, snapshot.edges);
      if (issues.length > 0) {
        dispatch(setEraserSyncStatus("error"));
        dispatch(setEraserSyncError(formatValidationSummary(issues)));
      } else {
        dispatch(setEraserSyncStatus("synced"));
        dispatch(setEraserSyncError(null));
      }

      dispatch(loadDiagram(snapshot));
      dispatch(setEraserCode(code));
      window.setTimeout(() => {
        suppressCanvasSync.current = false;
        window.dispatchEvent(new Event("archflow:fit-view"));
      }, 150);
    },
    [dispatch],
  );

  return { applyCodeFromEditor };
}
