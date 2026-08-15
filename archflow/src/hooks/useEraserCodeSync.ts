"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { syncDocumentContent } from "@/store/slices/diagramSlice";
import { setEraserCode } from "@/store/slices/uiSlice";
import { getDiagramStructureKey } from "@/lib/canvas/layout/structureKey";
import { diagramToDsl } from "@/lib/eraser/serialize";

/**
 * Keeps eraserCode and document elements/connections aligned with canvas edits.
 */
export function useEraserCodeSync() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const document = useAppSelector((state) => state.diagram.document);
  const title = useAppSelector((state) => state.ui.diagramTitle);

  const canvasStructureKey = useMemo(
    () => getDiagramStructureKey(nodes, edges),
    [nodes, edges],
  );
  const codePanelDirty = useAppSelector((state) => state.ui.codePanelDirty);

  useEffect(() => {
    dispatch(syncDocumentContent());
  }, [dispatch, canvasStructureKey]);

  useEffect(() => {
    if (codePanelDirty) return;

    const code = diagramToDsl(nodes, edges, {
      title: document.title ?? title,
      style: document.style,
      legend: document.legend,
    });
    dispatch(setEraserCode(code));
  }, [
    dispatch,
    canvasStructureKey,
    codePanelDirty,
    document.legend,
    document.style,
    document.title,
    edges,
    nodes,
    title,
  ]);
}
