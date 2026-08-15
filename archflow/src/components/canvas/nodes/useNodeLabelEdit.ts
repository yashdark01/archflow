"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeNode, updateNodeData } from "@/store/slices/diagramSlice";
import { requestNodeLabelEdit } from "@/store/slices/uiSlice";

export function useNodeLabelEdit(
  id: string,
  label: string,
  options?: { isTextLabel?: boolean },
) {
  const dispatch = useAppDispatch();
  const labelEditRequest = useAppSelector((state) => state.ui.nodeLabelEditId);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const isTextLabel = options?.isTextLabel ?? false;

  useEffect(() => {
    if (labelEditRequest === id) {
      setEditValue(label);
      setEditing(true);
      dispatch(requestNodeLabelEdit(null));
    }
  }, [dispatch, id, label, labelEditRequest]);

  const startEditing = useCallback(() => {
    setEditValue(label);
    setEditing(true);
  }, [label]);

  const commitLabel = useCallback(() => {
    const trimmed = editValue.trim();

    if (isTextLabel) {
      if (!trimmed) {
        dispatch(removeNode(id));
        setEditing(false);
        return;
      }
      if (trimmed !== label) {
        dispatch(updateNodeData({ id, data: { label: trimmed } }));
      }
      setEditing(false);
      return;
    }

    if (trimmed && trimmed !== label) {
      dispatch(updateNodeData({ id, data: { label: trimmed } }));
    } else {
      setEditValue(label);
    }
    setEditing(false);
  }, [dispatch, editValue, id, isTextLabel, label]);

  const cancelEditing = useCallback(() => {
    if (isTextLabel && !label.trim()) {
      dispatch(removeNode(id));
      return;
    }
    setEditValue(label);
    setEditing(false);
  }, [dispatch, id, isTextLabel, label]);

  return {
    editing,
    editValue,
    setEditValue,
    startEditing,
    commitLabel,
    cancelEditing,
  };
}
