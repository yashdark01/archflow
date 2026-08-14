"use client";

import { useCallback, useEffect, useRef } from "react";
import type { DragEvent } from "react";
import { useReactFlow } from "reactflow";
import { useAppDispatch } from "@/store/hooks";
import { addNode } from "@/store/slices/diagramSlice";
import {
  clearPaletteDragSession,
  getPaletteDragSession,
  isPaletteDragActive,
} from "@/lib/canvas/paletteDragSession";
import type { NodeType } from "@/types/diagram";
import { createNode, createNodeFromIcon } from "@/utils/nodeFactory";

function isPaletteDragEvent(event: DragEvent | globalThis.DragEvent): boolean {
  if (isPaletteDragActive()) return true;
  const transfer = event.dataTransfer;
  if (!transfer) return false;
  return (
    transfer.types.includes("application/archflow-node") ||
    transfer.types.includes("application/archflow-icon")
  );
}

export function useCanvasDrop(readOnly = false) {
  const dispatch = useAppDispatch();
  const { screenToFlowPosition } = useReactFlow();
  const canvasRef = useRef<HTMLDivElement>(null);

  const placeNodeAt = useCallback(
    (clientX: number, clientY: number, nodeType?: NodeType, iconId?: string) => {
      const el = canvasRef.current;
      if (!el) return false;

      const rect = el.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return false;
      }

      const position = screenToFlowPosition({ x: clientX, y: clientY });

      if (iconId) {
        dispatch(addNode(createNodeFromIcon(iconId, position)));
        return true;
      }

      if (nodeType) {
        dispatch(addNode(createNode(nodeType, position)));
        return true;
      }

      return false;
    },
    [dispatch, screenToFlowPosition],
  );

  const readDropPayload = useCallback((event: DragEvent<HTMLDivElement>) => {
    const iconId = event.dataTransfer.getData("application/archflow-icon");
    const nodeType = event.dataTransfer.getData(
      "application/archflow-node",
    ) as NodeType;
    const session = getPaletteDragSession();

    return {
      iconId: iconId || session?.iconId,
      nodeType: (nodeType || session?.nodeType) as NodeType | undefined,
    };
  }, []);

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (readOnly || !isPaletteDragEvent(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    [readOnly],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (readOnly) return;
      event.preventDefault();

      const { iconId, nodeType } = readDropPayload(event);
      clearPaletteDragSession();

      if (!iconId && !nodeType) return;

      placeNodeAt(event.clientX, event.clientY, nodeType, iconId || undefined);
    },
    [readOnly, readDropPayload, placeNodeAt],
  );

  useEffect(() => {
    if (readOnly) return;

    const onWindowDragOver = (event: globalThis.DragEvent) => {
      if (!isPaletteDragActive()) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    };

    const onWindowDrop = (event: globalThis.DragEvent) => {
      if (!isPaletteDragActive()) return;
      event.preventDefault();

      const session = getPaletteDragSession();
      clearPaletteDragSession();
      if (!session) return;

      placeNodeAt(
        event.clientX,
        event.clientY,
        session.nodeType,
        session.iconId,
      );
    };

    const onWindowDragEnd = () => {
      clearPaletteDragSession();
    };

    window.addEventListener("dragover", onWindowDragOver);
    window.addEventListener("drop", onWindowDrop);
    window.addEventListener("dragend", onWindowDragEnd);

    return () => {
      window.removeEventListener("dragover", onWindowDragOver);
      window.removeEventListener("drop", onWindowDrop);
      window.removeEventListener("dragend", onWindowDragEnd);
    };
  }, [readOnly, placeNodeAt]);

  return { canvasRef, onDragOver, onDrop };
}
