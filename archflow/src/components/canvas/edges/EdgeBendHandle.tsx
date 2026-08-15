"use client";

import { memo, useCallback, useRef, useState } from "react";
import { EdgeLabelRenderer, useReactFlow } from "reactflow";
import { useAppDispatch } from "@/store/hooks";
import { updateEdgeData } from "@/store/slices/diagramSlice";
import { cn } from "@/lib/utils";

interface EdgeBendHandleProps {
  edgeId: string;
  x: number;
  y: number;
  selected?: boolean;
  customBend?: boolean;
}

function EdgeBendHandleComponent({
  edgeId,
  x,
  y,
  selected = false,
  customBend = false,
}: EdgeBendHandleProps) {
  const dispatch = useAppDispatch();
  const { screenToFlowPosition } = useReactFlow();
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    dragging.current = true;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!dragging.current) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      dispatch(
        updateEdgeData({
          id: edgeId,
          data: { bendPoint: { x: position.x, y: position.y } },
        }),
      );
    },
    [dispatch, edgeId, screenToFlowPosition],
  );

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    dragging.current = false;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      dispatch(updateEdgeData({ id: edgeId, data: { bendPoint: undefined } }));
    },
    [dispatch, edgeId],
  );

  if (!selected) return null;

  return (
    <EdgeLabelRenderer>
      <div
        className={cn(
          "nodrag nopan pointer-events-auto absolute",
          "flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
        )}
        style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={onDoubleClick}
        title="Drag to adjust bend · double-click to reset"
      >
        <span
          className={cn(
            "size-2.5 rounded-full border-2 border-background shadow-md transition-transform",
            customBend ? "bg-primary" : "bg-muted-foreground",
            isDragging && "scale-125",
          )}
        />
      </div>
    </EdgeLabelRenderer>
  );
}

export const EdgeBendHandle = memo(EdgeBendHandleComponent);
