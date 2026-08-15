"use client";

import { useEffect } from "react";
import { isModKey } from "@/constants/shortcuts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openRightPanelTab, setRightPanelOpen } from "@/store/slices/uiSlice";

export function useEditorKeyboard() {
  const dispatch = useAppDispatch();
  const rightPanelOpen = useAppSelector((state) => state.ui.rightPanelOpen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModKey(event) && event.key === "/") {
        event.preventDefault();
        dispatch(openRightPanelTab("code"));
        return;
      }

      if (event.key === "Escape" && rightPanelOpen) {
        const target = event.target as HTMLElement;
        if (target.closest(".monaco-editor") || target.closest("[data-right-panel]")) {
          event.preventDefault();
          dispatch(setRightPanelOpen(false));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, rightPanelOpen]);
}
