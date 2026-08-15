"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { acknowledgeMobileEditor } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";

export function MobileEditorBanner() {
  const dispatch = useAppDispatch();
  const acknowledged = useAppSelector((state) => state.ui.mobileEditorAcknowledged);

  if (acknowledged) return null;

  return (
    <div className="border-b border-border bg-yash-amber/10 px-4 py-3 md:hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Editing works best on desktop or tablet. Continue on mobile with limited layout space.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => dispatch(acknowledgeMobileEditor())}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
