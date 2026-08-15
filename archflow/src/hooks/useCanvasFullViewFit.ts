"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";

/** Refit canvas when the right panel closes so the diagram uses the full viewport. */
export function useCanvasFullViewFit() {
  const rightPanelOpen = useAppSelector((state) => state.ui.rightPanelOpen);
  const nodeCount = useAppSelector((state) => state.diagram.nodes.length);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = rightPanelOpen;

    if (nodeCount === 0) return;

    if (wasOpen && !rightPanelOpen) {
      window.setTimeout(() => {
        window.dispatchEvent(new Event("archflow:fit-view"));
      }, 150);
    }
  }, [nodeCount, rightPanelOpen]);
}
