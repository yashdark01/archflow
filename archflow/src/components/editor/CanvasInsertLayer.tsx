"use client";

import { useEffect } from "react";
import { CanvasToolRail } from "@/components/editor/CanvasToolRail";
import { InsertPicker } from "@/components/editor/InsertPicker";
import { PlacementGhost } from "@/components/editor/PlacementGhost";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearPlacement, setInsertPickerOpen, setSidebarOpen, startPlacement } from "@/store/slices/uiSlice";
import { PaletteSheet } from "@/components/editor/PaletteSheet";

interface CanvasInsertLayerProps {
  onCode?: () => void;
  onProperties?: () => void;
}

export function CanvasInsertLayer({ onCode, onProperties }: CanvasInsertLayerProps) {
  const dispatch = useAppDispatch();
  const placement = useAppSelector((state) => state.ui.placement);
  const focusSearch = useAppSelector((state) => state.ui.insertPickerFocusSearch);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

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
      <PaletteSheet
        open={sidebarOpen}
        onOpenChange={(open) => dispatch(setSidebarOpen(open))}
      />
      <PlacementGhost />
    </>
  );
}
