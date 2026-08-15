"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadDiagram } from "@/store/slices/diagramSlice";
import {
  setMermaidCode,
  setMermaidSyncError,
  setMermaidSyncStatus,
  setLayoutDirection,
} from "@/store/slices/uiSlice";
import { flowToMermaid } from "@/lib/mermaid/flowToMermaid";
import { parseMermaid } from "@/lib/mermaid/mermaidToFlow";
import { useDiagramStructureKey } from "@/hooks/useDiagramStructureKey";

export function useMermaidSync() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const mermaidCode = useAppSelector((state) => state.ui.mermaidCode);
  const codeDialect = useAppSelector((state) => state.ui.codeDialect);
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
    if (codeDialect !== "mermaid") return;
    if (!initialized.current && nodes.length > 0) {
      initialized.current = true;
    }
  }, [codeDialect, nodes.length]);

  useEffect(() => {
    if (codeDialect !== "mermaid") return;
    if (!initialized.current || suppressCanvasSync.current) return;

    const timer = window.setTimeout(() => {
      suppressCanvasSync.current = true;
      const code = flowToMermaid(nodes, edges, "LR");
      dispatch(setMermaidCode(code));
      dispatch(setMermaidSyncStatus("synced"));
      dispatch(setMermaidSyncError(null));
      window.setTimeout(() => {
        suppressCanvasSync.current = false;
      }, 50);
    }, 300);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- structure only
  }, [codeDialect, dispatch, structureKey]);

  const applyMermaidFromEditor = useCallback(
    (code: string) => {
      if (codeDialect !== "mermaid") return;

      suppressCanvasSync.current = true;
      initialized.current = true;

      const result = parseMermaid(code);
      if (!("snapshot" in result)) {
        dispatch(setMermaidSyncStatus("error"));
        dispatch(setMermaidSyncError(result.message));
        suppressCanvasSync.current = false;
        return;
      }

      const layoutDir = result.direction === "down" ? "TD" : "LR";
      dispatch(setLayoutDirection(layoutDir));
      dispatch(loadDiagram(result.snapshot));
      dispatch(setMermaidSyncStatus("synced"));
      dispatch(setMermaidSyncError(null));
      window.setTimeout(() => {
        suppressCanvasSync.current = false;
        window.dispatchEvent(new Event("archflow:fit-view"));
      }, 150);
    },
    [codeDialect, dispatch],
  );

  const seedMermaidFromCanvas = useCallback(() => {
    const code = flowToMermaid(nodes, edges, "LR");
    dispatch(setMermaidCode(code));
    dispatch(setMermaidSyncStatus("synced"));
    dispatch(setMermaidSyncError(null));
  }, [dispatch, edges, nodes]);

  return { applyMermaidFromEditor, seedMermaidFromCanvas, mermaidCode };
}
