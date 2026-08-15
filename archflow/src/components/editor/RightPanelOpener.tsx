"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { setRightPanelOpen } from "@/store/slices/uiSlice";
import { PanelRightOpen } from "lucide-react";

export function RightPanelOpener() {
  const dispatch = useAppDispatch();

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 shadow-md"
      aria-label="Open panel"
      onClick={() => dispatch(setRightPanelOpen(true))}
    >
      <PanelRightOpen className="size-4" />
    </Button>
  );
}
