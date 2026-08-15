"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { EdgeLabelRenderer } from "reactflow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateEdgeData } from "@/store/slices/diagramSlice";
import { requestEdgeLabelEdit } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

interface EdgeCanvasLabelProps {
  edgeId: string;
  label: string;
  x: number;
  y: number;
  selected?: boolean;
}

function EdgeCanvasLabelComponent({
  edgeId,
  label,
  x,
  y,
  selected = false,
}: EdgeCanvasLabelProps) {
  const dispatch = useAppDispatch();
  const labelEditRequest = useAppSelector((state) => state.ui.edgeLabelEditId);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);

  useEffect(() => {
    if (!editing) setValue(label);
  }, [label, editing]);

  useEffect(() => {
    if (labelEditRequest === edgeId) {
      setValue(label);
      setEditing(true);
      dispatch(requestEdgeLabelEdit(null));
    }
  }, [dispatch, edgeId, label, labelEditRequest]);

  const commit = useCallback(() => {
    const trimmed = value.trim();
    dispatch(updateEdgeData({ id: edgeId, data: { label: trimmed } }));
    setEditing(false);
  }, [dispatch, edgeId, value]);

  const showPlaceholder = !label && !editing;

  if (!selected && !label && !editing) return null;

  return (
    <EdgeLabelRenderer>
      <div
        className={cn(
          "nodrag nopan absolute max-w-[160px]",
          editing ? "pointer-events-auto" : "pointer-events-auto",
        )}
        style={{
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        }}
        onDoubleClick={(event) => {
          event.stopPropagation();
          setValue(label);
          setEditing(true);
        }}
      >
        {editing ? (
          <input
            className="w-full min-w-[80px] rounded border border-primary bg-card px-2 py-0.5 text-xs text-foreground shadow-md outline-none ring-2 ring-primary/30"
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
        ) : (
          <div
            className={cn(
              "rounded border px-1.5 py-0.5 text-xs shadow-sm transition-colors",
              selected
                ? "border-primary/50 bg-card text-foreground"
                : "border-border bg-card/95 text-foreground",
              showPlaceholder && "text-muted-foreground italic",
            )}
          >
            {label || "Double-click to label"}
          </div>
        )}
      </div>
    </EdgeLabelRenderer>
  );
}

export const EdgeCanvasLabel = memo(EdgeCanvasLabelComponent);
