"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  relayoutFromDocument,
  setLayoutOverrides,
  setNodes,
} from "@/store/slices/diagramSlice";
import {
  resetLayout,
  setLayoutDirection,
  setLayoutManual,
  type LayoutDirection,
} from "@/store/slices/uiSlice";
import { applyCanvasLayout } from "@/lib/canvas/layout/applyLayout";
import {
  layoutDirectionToRankDir,
  rankDirToLayoutDirection,
} from "@/lib/canvas/layout/direction";

export function useLayoutControl() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const document = useAppSelector((state) => state.diagram.document);
  const layoutOverrides = useAppSelector((state) => state.diagram.layoutOverrides);
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);
  const layoutManual = useAppSelector((state) => state.ui.layoutManual);

  const runAutoLayout = useCallback(
    (direction?: LayoutDirection) => {
      const rankDir = direction
        ? layoutDirectionToRankDir(direction)
        : undefined;

      dispatch(setLayoutManual(false));
      dispatch(setLayoutOverrides({}));

      const { nodes: laidOut, rankDir: appliedRankDir } = applyCanvasLayout({
        nodes,
        edges,
        rankDir,
        eraserDirection: rankDir ? undefined : document.style.direction,
        layoutDirection: direction,
      });

      dispatch(setNodes(laidOut));
      dispatch(setLayoutDirection(rankDirToLayoutDirection(appliedRankDir)));

      window.setTimeout(() => {
        window.dispatchEvent(new Event("archflow:fit-view"));
      }, 100);
    },
    [dispatch, document.style.direction, edges, nodes],
  );

  const resetFromCode = useCallback(() => {
    dispatch(resetLayout());
    dispatch(setLayoutManual(false));
    dispatch(setLayoutOverrides({}));
    dispatch(relayoutFromDocument());

    window.setTimeout(() => {
      window.dispatchEvent(new Event("archflow:fit-view"));
    }, 150);
  }, [dispatch]);

  const selectDiagram = useCallback(() => {
    // Canvas-only editor: select-all handled via context menu / shortcuts
  }, []);

  return {
    runAutoLayout,
    resetFromCode,
    selectDiagram,
    layoutManual,
    layoutDirection,
    layoutOverrides,
  };
}
