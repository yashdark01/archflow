"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { undo, redo } from "@/store/slices/diagramSlice";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Redo2, Undo2 } from "lucide-react";

export function UndoRedoButtons() {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector((state) => state.diagram.past.length > 0);
  const canRedo = useAppSelector((state) => state.diagram.future.length > 0);

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Undo"
              disabled={!canUndo}
              onClick={() => dispatch(undo())}
            >
              <Undo2 className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Redo"
              disabled={!canRedo}
              onClick={() => dispatch(redo())}
            >
              <Redo2 className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
      </Tooltip>
    </div>
  );
}
