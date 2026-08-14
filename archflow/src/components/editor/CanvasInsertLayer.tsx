"use client";

import { useEffect } from "react";
import { CanvasToolRail } from "@/components/editor/CanvasToolRail";
import { InsertPicker } from "@/components/editor/InsertPicker";
import { PlacementGhost } from "@/components/editor/PlacementGhost";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearPlacement, setInsertPickerOpen, startPlacement } from "@/store/slices/uiSlice";

interface CanvasInsertLayerProps {
  onCode?: () => void;
  onProperties?: () => void;
}

export function CanvasInsertLayer({ onCode, onProperties }: CanvasInsertLayerProps) {
  const dispatch = useAppDispatch();
  const placement = useAppSelector((state) => state.ui.placement);
  const focusSearch = useAppSelector((state) => state.ui.insertPickerFocusSearch);

  useEffect(() => {
    if (!placement) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(clearPlacement());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, placement]);

  return (
    <>
      <CanvasToolRail
        onInsert={() => dispatch(setInsertPickerOpen(true))}
        onSearchInsert={() =>
          dispatch(setInsertPickerOpen({ open: true, focusSearch: true }))
        }
        onCode={onCode}
        onProperties={onProperties}
        onText={() => dispatch(startPlacement({ kind: "text" }))}
        placementActive={Boolean(placement)}
      />
      <InsertPicker focusSearch={focusSearch} onOpenCode={onCode} />
      <PlacementGhost />
    </>
  );
}
