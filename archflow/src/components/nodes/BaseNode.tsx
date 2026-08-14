"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Handle, NodeResizer, Position, type NodeProps } from "reactflow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeNode, updateNodeData } from "@/store/slices/diagramSlice";
import { requestNodeLabelEdit } from "@/store/slices/uiSlice";
import type { NodeData } from "@/types/diagram";
import { EraserIcon } from "@/components/icons/EraserIcon";
import { humanizeIconId } from "@/constants/eraserIcons";
import { cn } from "@/lib/utils";

const HANDLES: { position: Position; id: string; className: string }[] = [
  { position: Position.Top, id: "top", className: "!top-0 !-translate-y-1/2" },
  { position: Position.Right, id: "right", className: "!right-0 !translate-x-1/2" },
  { position: Position.Bottom, id: "bottom", className: "!bottom-0 !translate-y-1/2" },
  { position: Position.Left, id: "left", className: "!left-0 !-translate-x-1/2" },
];

function ArchflowNodeComponent({ id, data, selected }: NodeProps<NodeData>) {
  const dispatch = useAppDispatch();
  const labelEditRequest = useAppSelector((state) => state.ui.nodeLabelEditId);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const [hovered, setHovered] = useState(false);

  const isGroup = data.nodeType === "group";
  const isTextLabel = data.nodeType === "text";
  const isIconNode = !isGroup && !isTextLabel && Boolean(data.icon);
  const isIconOnly = isIconNode && data.borderStyle === "none";
  const iconDefaultLabel = data.icon ? humanizeIconId(data.icon) : "";
  const showIconCanvasLabel =
    !isIconOnly ||
    (data.label.trim().length > 0 && data.label.trim() !== iconDefaultLabel);
  const showHandles = hovered || selected;

  useEffect(() => {
    if (labelEditRequest === id) {
      setEditValue(data.label);
      setEditing(true);
      dispatch(requestNodeLabelEdit(null));
    }
  }, [data.label, dispatch, id, labelEditRequest]);

  const commitLabel = useCallback(() => {
    const trimmed = editValue.trim();

    if (isTextLabel) {
      if (!trimmed) {
        dispatch(removeNode(id));
        setEditing(false);
        return;
      }
      if (trimmed !== data.label) {
        dispatch(updateNodeData({ id, data: { label: trimmed } }));
      }
      setEditing(false);
      return;
    }

    if (trimmed && trimmed !== data.label) {
      dispatch(updateNodeData({ id, data: { label: trimmed } }));
    } else {
      setEditValue(data.label);
    }
    setEditing(false);
  }, [data.label, dispatch, editValue, id, isTextLabel]);

  if (isTextLabel) {
    return (
      <div
        className={cn(
          "archflow-text-label max-w-[240px] px-1 py-0.5",
          selected && "rounded ring-2 ring-primary/40 ring-offset-1 ring-offset-background",
        )}
      >
        {editing ? (
          <input
            className="nodrag nopan min-w-[5rem] max-w-[240px] bg-transparent text-sm font-medium text-foreground outline-none"
            value={editValue}
            placeholder="Label"
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={commitLabel}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitLabel();
              if (event.key === "Escape") {
                if (!data.label.trim()) {
                  dispatch(removeNode(id));
                } else {
                  setEditValue(data.label);
                  setEditing(false);
                }
              }
            }}
            autoFocus
          />
        ) : (
          <span
            className="text-sm font-medium text-foreground"
            onDoubleClick={() => {
              setEditValue(data.label);
              setEditing(true);
            }}
          >
            {data.label}
          </span>
        )}
      </div>
    );
  }

  if (isGroup) {
    return (
      <div
        className={cn(
          "archflow-group relative h-full w-full rounded-lg border-2 bg-transparent",
          selected && "ring-2 ring-primary/60 ring-offset-2 ring-offset-background",
        )}
        style={{ borderColor: data.color }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <NodeResizer
          isVisible={selected}
          minWidth={200}
          minHeight={120}
          lineClassName="!border-primary"
          handleClassName="!h-2.5 !w-2.5 !rounded-sm !border-2 !border-background !bg-primary"
        />
        <div
          className="absolute left-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          style={{ color: data.color }}
        >
          {data.label}
        </div>

        {HANDLES.flatMap(({ position, id: handleId, className: posClass }) => [
          <Handle
            key={`source-${handleId}`}
            type="source"
            position={position}
            id={handleId}
            isConnectableStart
            className={cn(
              "archflow-handle !h-3 !w-3 !border-2 !border-background !shadow-sm transition-all",
              posClass,
              showHandles ? "opacity-100 scale-100" : "opacity-0 scale-75",
            )}
            style={{ background: data.color }}
          />,
          <Handle
            key={`target-${handleId}`}
            type="target"
            position={position}
            id={handleId}
            isConnectableEnd
            className={cn(
              "archflow-handle !h-3 !w-3 !border-2 !border-background !shadow-sm transition-all",
              posClass,
              showHandles ? "opacity-100 scale-100" : "opacity-0 scale-75",
            )}
            style={{ background: data.color }}
          />,
        ])}
      </div>
    );
  }

  if (isIconNode) {
    return (
      <div
        className={cn(
          "archflow-icon-node group/node relative flex flex-col items-center px-1 py-1",
          !isIconOnly && "gap-1.5",
          selected &&
            "rounded-lg ring-2 ring-primary/80 ring-offset-2 ring-offset-background",
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {HANDLES.flatMap(({ position, id: handleId, className: posClass }) => [
          <Handle
            key={`source-${handleId}`}
            type="source"
            position={position}
            id={handleId}
            isConnectableStart
            className={cn(
              "archflow-handle !h-2.5 !w-2.5 !border-2 !border-background !shadow-sm transition-all",
              posClass,
              showHandles ? "opacity-100 scale-100" : "opacity-0 scale-75",
            )}
            style={{ background: data.color }}
          />,
          <Handle
            key={`target-${handleId}`}
            type="target"
            position={position}
            id={handleId}
            isConnectableEnd
            className={cn(
              "archflow-handle !h-2.5 !w-2.5 !border-2 !border-background !shadow-sm transition-all",
              posClass,
              showHandles ? "opacity-100 scale-100" : "opacity-0 scale-75",
            )}
            style={{ background: data.color }}
          />,
        ])}

        <div
          className="flex flex-col items-center"
          onDoubleClick={() => {
            setEditValue(data.label);
            setEditing(true);
          }}
        >
          <EraserIcon
            iconId={data.icon!}
            size={44}
            className="drop-shadow-sm transition-transform duration-200 group-hover/node:scale-105"
          />
        </div>

        {editing ? (
          <input
            className="nodrag nopan z-10 w-full max-w-[120px] bg-transparent text-center text-[11px] font-medium outline-none"
            value={editValue}
            placeholder={isIconOnly ? "Optional label" : undefined}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={commitLabel}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitLabel();
              if (event.key === "Escape") {
                setEditValue(data.label);
                setEditing(false);
              }
            }}
            autoFocus
          />
        ) : showIconCanvasLabel ? (
          <span
            className="z-10 max-w-[120px] truncate text-center text-[11px] font-medium text-foreground"
            onDoubleClick={() => {
              setEditValue(data.label);
              setEditing(true);
            }}
          >
            {data.label}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "archflow-node group/node relative flex flex-col items-center justify-center rounded-lg border bg-card px-3 py-2 shadow-sm",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      style={{ borderColor: data.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {HANDLES.flatMap(({ position, id: handleId, className: posClass }) => [
        <Handle
          key={`source-${handleId}`}
          type="source"
          position={position}
          id={handleId}
          isConnectableStart
          className={cn(
            "archflow-handle !h-3 !w-3 !border-2 !border-background !shadow-sm transition-all",
            posClass,
            showHandles ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
          style={{ background: data.color }}
        />,
        <Handle
          key={`target-${handleId}`}
          type="target"
          position={position}
          id={handleId}
          isConnectableEnd
          className={cn(
            "archflow-handle !h-3 !w-3 !border-2 !border-background !shadow-sm transition-all",
            posClass,
            showHandles ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
          style={{ background: data.color }}
        />,
      ])}

      {data.icon ? <EraserIcon iconId={data.icon} size={24} className="mb-1" /> : null}

      {editing ? (
        <input
          className="z-10 w-full min-w-0 bg-transparent text-center text-sm font-medium outline-none"
          value={editValue}
          onChange={(event) => setEditValue(event.target.value)}
          onBlur={commitLabel}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitLabel();
            if (event.key === "Escape") {
              setEditValue(data.label);
              setEditing(false);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className="z-10 text-sm font-medium text-foreground"
          onDoubleClick={() => {
            setEditValue(data.label);
            setEditing(true);
          }}
        >
          {data.label}
        </span>
      )}
    </div>
  );
}

export const ArchflowNode = memo(ArchflowNodeComponent);
