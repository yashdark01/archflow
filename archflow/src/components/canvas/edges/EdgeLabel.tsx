"use client";

import { useCallback, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateEdgeData } from "@/store/slices/diagramSlice";

interface EdgeLabelEditorProps {
  edgeId: string;
  label: string;
}

export function EdgeLabelEditor({ edgeId, label }: EdgeLabelEditorProps) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);

  const commit = useCallback(() => {
    const trimmed = value.trim();
    dispatch(updateEdgeData({ id: edgeId, data: { label: trimmed } }));
    setEditing(false);
  }, [dispatch, edgeId, value]);

  if (!editing) {
    return (
      <button
        type="button"
        className="text-xs text-muted hover:text-foreground"
        onDoubleClick={() => {
          setValue(label);
          setEditing(true);
        }}
      >
        {label || "Add label"}
      </button>
    );
  }

  return (
    <input
      className="w-full rounded border border-border bg-surface px-2 py-1 text-xs"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") commit();
        if (event.key === "Escape") {
          setValue(label);
          setEditing(false);
        }
      }}
      autoFocus
    />
  );
}
