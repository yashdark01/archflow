"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { relayoutFromDocument } from "@/store/slices/diagramSlice";
import { setLayoutDirection, setLayoutManual } from "@/store/slices/uiSlice";
import {
  getDocumentStructureKey,
  hasLayoutOverrides,
} from "@/lib/canvas/layout/structureKey";
import { rankDirToLayoutDirection } from "@/lib/canvas/layout/direction";
import { eraserDirectionToRankDir } from "@/lib/canvas/layout/direction";

/**
 * When the canonical document structure changes, reset manual layout
 * (Eraser draggable-edits: significant code edit resets layout).
 */
export function useCanvasStructureSync() {
  const dispatch = useAppDispatch();
  const document = useAppSelector((state) => state.diagram.document);
  const layoutManual = useAppSelector((state) => state.ui.layoutManual);
  const layoutOverrides = useAppSelector((state) => state.diagram.layoutOverrides);
  const structureKey = getDocumentStructureKey(document);
  const prevKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevKeyRef.current === null) {
      prevKeyRef.current = structureKey;
      dispatch(
        setLayoutDirection(
          rankDirToLayoutDirection(eraserDirectionToRankDir(document.style.direction)),
        ),
      );
      return;
    }

    if (prevKeyRef.current === structureKey) return;

    prevKeyRef.current = structureKey;

    if (layoutManual || hasLayoutOverrides(layoutOverrides)) {
      dispatch(setLayoutManual(false));
      dispatch(relayoutFromDocument());
    } else {
      dispatch(relayoutFromDocument());
    }

    dispatch(
      setLayoutDirection(
        rankDirToLayoutDirection(eraserDirectionToRankDir(document.style.direction)),
      ),
    );
  }, [dispatch, document.style.direction, layoutManual, layoutOverrides, structureKey]);
}
