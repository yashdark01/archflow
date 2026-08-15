"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { useReactFlow } from "reactflow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addNode } from "@/store/slices/diagramSlice";
import { clearPlacement, requestNodeLabelEdit, setSelectedNode } from "@/store/slices/uiSlice";
import { createNode, createNodeFromIcon, createTextLabel } from "@/utils/nodeFactory";

/** Places picked nodes on a single pointer down on the canvas pane. */
export function usePlacementPointer(
  canvasRef: RefObject<HTMLDivElement | null>,
  readOnly = false,
) {
  const dispatch = useAppDispatch();
  const placement = useAppSelector((state) => state.ui.placement);
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    if (!placement || readOnly) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const root = canvasRef.current;
      if (!root) return;

      const pane = root.querySelector(".react-flow__pane");
      if (!pane?.contains(event.target as Node)) return;

      // Ignore clicks on nodes, edges, handles — pane background only
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

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (placement.kind === "icon") {
        dispatch(addNode(createNodeFromIcon(placement.iconId, position)));
      } else if (placement.kind === "text") {
        const node = createTextLabel(position);
        dispatch(addNode(node));
        dispatch(setSelectedNode(node.id));
        dispatch(requestNodeLabelEdit(node.id));
      } else {
        dispatch(addNode(createNode(placement.nodeType, position)));
      }
      dispatch(clearPlacement());
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [canvasRef, dispatch, placement, readOnly, screenToFlowPosition]);
}
