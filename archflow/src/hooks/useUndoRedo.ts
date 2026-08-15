"use client";

import { useEffect } from "react";
import { isModKey } from "@/constants/shortcuts";
import { useExport } from "@/hooks/useExport";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deselectAll,
  pasteNodes,
  removeSelected,
  selectAll,
  undo,
  redo,
} from "@/store/slices/diagramSlice";
import { setCopiedNodes } from "@/store/slices/uiSlice";

export function useUndoRedo() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const copiedNodes = useAppSelector((state) => state.ui.copiedNodes);
  const { exportPng } = useExport();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (isModKey(event) && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        dispatch(undo());
        return;
      }

      if (isModKey(event) && (event.key === "Z" || (event.key === "z" && event.shiftKey))) {
        event.preventDefault();
        dispatch(redo());
        return;
      }

      if (isModKey(event) && event.key === "a") {
        event.preventDefault();
        dispatch(selectAll());
        return;
      }

      if (event.key === "Escape") {
        dispatch(deselectAll());
        return;
      }

      if (isModKey(event) && event.key === "c") {
        const selected = nodes.filter((node) => node.selected);
        if (selected.length > 0) {
          event.preventDefault();
          dispatch(setCopiedNodes(selected));
        }
        return;
      }

      if (isModKey(event) && event.key === "v") {
        if (copiedNodes.length > 0) {
          event.preventDefault();
          dispatch(pasteNodes({ nodes: copiedNodes }));
        }
        return;
      }

      if (isModKey(event) && event.key === "d") {
        const selected = nodes.filter((node) => node.selected);
        if (selected.length > 0) {
          event.preventDefault();
          dispatch(pasteNodes({ nodes: selected, offset: 24 }));
        }
        return;
      }

      if (isModKey(event) && event.key === "e") {
        event.preventDefault();
        exportPng();
        return;
      }

      if (isModKey(event) && event.key === "0") {
        event.preventDefault();
        window.dispatchEvent(new Event("archflow:fit-view"));
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        const nodeIds = nodes.filter((node) => node.selected).map((node) => node.id);
        const edgeIds = edges.filter((edge) => edge.selected).map((edge) => edge.id);
        if (nodeIds.length > 0 || edgeIds.length > 0) {
          event.preventDefault();
          dispatch(removeSelected({ nodeIds, edgeIds }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copiedNodes, dispatch, edges, exportPng, nodes]);
}
