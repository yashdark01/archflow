"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { useReactFlow } from "reactflow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addNode } from "@/store/slices/diagramSlice";
import {
  requestNodeLabelEdit,
  setInsertPickerOpen,
  setSelectedNode,
} from "@/store/slices/uiSlice";
import { createTextLabel } from "@/utils/nodeFactory";

/** Double-click empty canvas to place a free text label and start editing. */
export function useCanvasTextLabel(
  canvasRef: RefObject<HTMLDivElement | null>,
  readOnly = false,
) {
  const dispatch = useAppDispatch();
  const placement = useAppSelector((state) => state.ui.placement);
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    if (readOnly) return;

    const root = canvasRef.current;
    if (!root) return;

    const onDoubleClick = (event: MouseEvent) => {
      if (placement) return;

      const pane = root.querySelector(".react-flow__pane");
      if (!pane?.contains(event.target as Node)) return;

      const target = event.target as HTMLElement;
      if (
        target.closest(".react-flow__node") ||
        target.closest(".react-flow__edge") ||
        target.closest(".react-flow__handle")
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      dispatch(setInsertPickerOpen(false));

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const node = createTextLabel(position);
      dispatch(addNode(node));
      dispatch(setSelectedNode(node.id));
      dispatch(requestNodeLabelEdit(node.id));
    };

    root.addEventListener("dblclick", onDoubleClick, true);
    return () => root.removeEventListener("dblclick", onDoubleClick, true);
  }, [canvasRef, dispatch, placement, readOnly, screenToFlowPosition]);
}
