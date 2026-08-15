"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadDiagram } from "@/store/slices/diagramSlice";
import {
  setActiveArrowDirection,
  setActiveEdgeColor,
  setActiveEdgeType,
  setActiveStrokeStyle,
  setActiveStrokeWidth,
  setDiagramTitle,
  setDocumentNotes,
  setEraserCode,
  setMermaidCode,
  setSaveStatus,
} from "@/store/slices/uiSlice";
import {
  DEFAULT_EDGE_COLOR,
  DEFAULT_EDGE_STROKE_WIDTH,
  DEFAULT_EDGE_TYPE,
} from "@/constants/edgeDefaults";
import { DEFAULT_ERASER_CODE } from "@/lib/eraser/defaultCode";
import { DEFAULT_MERMAID_CODE } from "@/lib/mermaid/defaultCode";
import { diagramToDsl } from "@/lib/eraser/serialize";
import { flowToMermaid } from "@/lib/mermaid/flowToMermaid";
import { parseMermaid } from "@/lib/mermaid/mermaidToFlow";
import type { StoredDiagram } from "@/types/diagram";

import { getDiagramStorageKey, DIAGRAM_STORAGE_PREFIX } from "@/lib/storage/diagramStorage";
const MAX_STORED_DIAGRAMS = 12;

function getStorageKey(diagramId: string): string {
  return getDiagramStorageKey(diagramId);
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.code === 22)
  );
}

function pruneOldDiagrams(keepDiagramId: string): number {
  const entries: { key: string; updatedAt: string }[] = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(DIAGRAM_STORAGE_PREFIX) || key === getStorageKey(keepDiagramId)) {
      continue;
    }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const stored = JSON.parse(raw) as StoredDiagram;
      entries.push({ key, updatedAt: stored.updatedAt ?? "" });
    } catch {
      entries.push({ key, updatedAt: "" });
    }
  }

  entries.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  const removeCount = Math.max(0, entries.length - MAX_STORED_DIAGRAMS + 1);

  for (let i = 0; i < removeCount; i += 1) {
    localStorage.removeItem(entries[i].key);
  }

  return removeCount;
}

function saveToStorage(diagramId: string, payload: StoredDiagram): void {
  localStorage.setItem(getStorageKey(diagramId), JSON.stringify(payload));
}

function resetLineDefaults(dispatch: ReturnType<typeof useAppDispatch>) {
  dispatch(setActiveEdgeType(DEFAULT_EDGE_TYPE));
  dispatch(setActiveArrowDirection("forward"));
  dispatch(setActiveEdgeColor(DEFAULT_EDGE_COLOR));
  dispatch(setActiveStrokeWidth(DEFAULT_EDGE_STROKE_WIDTH));
  dispatch(setActiveStrokeStyle("solid"));
}

export function useAutoSave(diagramId: string) {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const title = useAppSelector((state) => state.ui.diagramTitle);
  const eraserCode = useAppSelector((state) => state.ui.eraserCode);
  const mermaidCode = useAppSelector((state) => state.ui.mermaidCode);
  const documentNotes = useAppSelector((state) => state.ui.documentNotes);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!diagramId || diagramId === "new") return;

    try {
      const raw = localStorage.getItem(getStorageKey(diagramId));
      if (raw) {
        const stored = JSON.parse(raw) as StoredDiagram;
        dispatch(loadDiagram({ nodes: stored.nodes, edges: stored.edges }));
        resetLineDefaults(dispatch);
        dispatch(setDiagramTitle(stored.title));
        if (stored.documentNotes) {
          dispatch(setDocumentNotes(stored.documentNotes));
        }
        if (stored.eraserCode) {
          dispatch(setEraserCode(stored.eraserCode));
        } else if (stored.nodes.length > 0) {
          dispatch(
            setEraserCode(
              diagramToDsl(stored.nodes, stored.edges, stored.title),
            ),
          );
        }
        if (stored.mermaidCode) {
          dispatch(setMermaidCode(stored.mermaidCode));
        } else if (stored.nodes.length > 0) {
          dispatch(
            setMermaidCode(flowToMermaid(stored.nodes, stored.edges, "LR")),
          );
        }
      } else {
        const mermaidResult = parseMermaid(DEFAULT_MERMAID_CODE);
        if ("snapshot" in mermaidResult) {
          dispatch(loadDiagram(mermaidResult.snapshot));
        }
        resetLineDefaults(dispatch);
        dispatch(setMermaidCode(DEFAULT_MERMAID_CODE));
        dispatch(setEraserCode(DEFAULT_ERASER_CODE));
      }
    } catch {
      dispatch(setSaveStatus("error"));
    }

    requestAnimationFrame(() => {
      isFirstLoad.current = false;
    });
  }, [diagramId, dispatch]);

  useEffect(() => {
    if (!diagramId || diagramId === "new" || isFirstLoad.current) return;

    dispatch(setSaveStatus("unsaved"));

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      dispatch(setSaveStatus("saving"));

      const payload: StoredDiagram = {
        id: diagramId,
        title,
        nodes,
        edges,
        eraserCode,
        mermaidCode,
        documentNotes,
        updatedAt: new Date().toISOString(),
      };

      try {
        saveToStorage(diagramId, payload);
        dispatch(setSaveStatus("saved"));
      } catch (error) {
        if (isQuotaError(error)) {
          const removed = pruneOldDiagrams(diagramId);
          if (removed > 0) {
            try {
              saveToStorage(diagramId, payload);
              dispatch(setSaveStatus("saved"));
              return;
            } catch {
              // fall through to error state
            }
          }
        }
        dispatch(setSaveStatus("error"));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [diagramId, dispatch, documentNotes, edges, eraserCode, mermaidCode, nodes, title]);
}
