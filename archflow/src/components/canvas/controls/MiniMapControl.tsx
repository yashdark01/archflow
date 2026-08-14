"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMinimap } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Map } from "lucide-react";

export function MiniMapControl() {
  const dispatch = useAppDispatch();
  const minimapOpen = useAppSelector((state) => state.ui.minimapOpen);

  return (
    <div className="absolute bottom-3 right-3 z-10">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="secondary"
              size="icon-sm"
              className="card-surface shadow-md"
              aria-label="Toggle minimap"
              onClick={() => dispatch(toggleMinimap())}
            >
              <Map className="size-4" />
            </Button>
          }
        />
        <TooltipContent>
          {minimapOpen ? "Hide minimap" : "Show minimap"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
