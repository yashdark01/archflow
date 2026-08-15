"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loadDiagram,
  selectAll,
  setNodes,
} from "@/store/slices/diagramSlice";
import {
  resetLayout,
  setLayoutManual,
  type LayoutDirection,
} from "@/store/slices/uiSlice";
import { applyDiagramLayout } from "@/lib/layout/diagramLayout";
import { dslToDiagram } from "@/lib/eraser/parse";
import { parseMermaid } from "@/lib/mermaid/mermaidToFlow";

export function useLayoutControl() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);
  const layoutManual = useAppSelector((state) => state.ui.layoutManual);
  const codeDialect = useAppSelector((state) => state.ui.codeDialect);
  const eraserCode = useAppSelector((state) => state.ui.eraserCode);
  const mermaidCode = useAppSelector((state) => state.ui.mermaidCode);

  const runAutoLayout = useCallback(
    (direction?: LayoutDirection) => {
      const dir = direction ?? layoutDirection;
      dispatch(setLayoutManual(false));
      const laidOut = applyDiagramLayout(nodes, edges, dir);
      dispatch(setNodes(laidOut));
      window.setTimeout(() => {
        window.dispatchEvent(new Event("archflow:fit-view"));
      }, 100);
    },
    [dispatch, edges, layoutDirection, nodes],
  );

  const resetFromCode = useCallback(() => {
    dispatch(resetLayout());
    dispatch(setLayoutManual(false));

    if (codeDialect === "mermaid") {
      const result = parseMermaid(mermaidCode);
      if ("snapshot" in result) {
        const laidOut = applyDiagramLayout(
          result.snapshot.nodes,
          result.snapshot.edges,
          layoutDirection,
        );
        dispatch(loadDiagram({ nodes: laidOut, edges: result.snapshot.edges }));
      }
    } else {
      const snapshot = dslToDiagram(eraserCode, { applyLayout: false });
      const laidOut = applyDiagramLayout(
        snapshot.nodes,
        snapshot.edges,
        layoutDirection,
      );
      dispatch(loadDiagram({ nodes: laidOut, edges: snapshot.edges }));
    }

    window.setTimeout(() => {
      window.dispatchEvent(new Event("archflow:fit-view"));
    }, 150);
  }, [codeDialect, dispatch, eraserCode, layoutDirection, mermaidCode]);

  const selectDiagram = useCallback(() => {
    dispatch(selectAll());
  }, [dispatch]);

  return {
    runAutoLayout,
    resetFromCode,
    selectDiagram,
    layoutManual,
    layoutDirection,
  };
}
