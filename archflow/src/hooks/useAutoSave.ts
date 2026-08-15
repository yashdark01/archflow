"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadDiagram, loadCanvasDocument } from "@/store/slices/diagramSlice";
import {
  setActiveArrowDirection,
  setActiveEdgeColor,
  setActiveEdgeType,
  setActiveStrokeStyle,
  setActiveStrokeWidth,
  setDiagramTitle,
  setEraserCode,
  setLayoutManual,
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
import { createCanvasDocumentFromDsl } from "@/lib/canvas";
import { captureLayoutOverrides } from "@/lib/canvas/layout/overrides";
import { flowToMermaid } from "@/lib/mermaid/flowToMermaid";
import type { DiagramDetailResponse } from "@/types/api";
import type { StoredDiagram } from "@/types/diagram";

import { getDiagramStorageKey, DIAGRAM_STORAGE_PREFIX } from "@/lib/storage/diagramStorage";

const MAX_STORED_DIAGRAMS = 12;
const GUEST_SAVE_DEBOUNCE_MS = 1000;
const AUTH_SAVE_DEBOUNCE_MS = 2000;

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

function applyStoredDiagram(
  dispatch: ReturnType<typeof useAppDispatch>,
  stored: StoredDiagram,
) {
  if (stored.eraserCode) {
    const canvasDoc = createCanvasDocumentFromDsl(stored.eraserCode);
    const overrides = captureLayoutOverrides(stored.nodes);
    dispatch(
      loadCanvasDocument({
        document: canvasDoc.document,
        layoutOverrides: overrides,
      }),
    );
    dispatch(
      setDiagramTitle(
        canvasDoc.document.title ?? stored.title ?? "Untitled Diagram",
      ),
    );
    dispatch(setLayoutManual(Object.keys(overrides).length > 0));
    dispatch(setEraserCode(stored.eraserCode));
  } else {
    dispatch(loadDiagram({ nodes: stored.nodes, edges: stored.edges }));
    if (stored.nodes.length > 0) {
      dispatch(setEraserCode(diagramToDsl(stored.nodes, stored.edges, { title: stored.title })));
    }
  }

  resetLineDefaults(dispatch);
  dispatch(setDiagramTitle(stored.title));

  if (stored.mermaidCode) {
    dispatch(setMermaidCode(stored.mermaidCode));
  } else if (stored.nodes.length > 0) {
    dispatch(setMermaidCode(flowToMermaid(stored.nodes, stored.edges, "LR")));
  }
}

function applyDefaultDiagram(dispatch: ReturnType<typeof useAppDispatch>) {
  const canvasDoc = createCanvasDocumentFromDsl(DEFAULT_ERASER_CODE);
  dispatch(loadCanvasDocument(canvasDoc));
  dispatch(setDiagramTitle(canvasDoc.document.title ?? "Untitled Diagram"));
  resetLineDefaults(dispatch);
  dispatch(setMermaidCode(DEFAULT_MERMAID_CODE));
  dispatch(setEraserCode(DEFAULT_ERASER_CODE));
}

export function useAutoSave(diagramId: string) {
  const dispatch = useAppDispatch();
  const { status: authStatus } = useSession();
  const isAuthenticated = authStatus === "authenticated";

  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const title = useAppSelector((state) => state.ui.diagramTitle);
  const eraserCode = useAppSelector((state) => state.ui.eraserCode);
  const mermaidCode = useAppSelector((state) => state.ui.mermaidCode);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!diagramId || diagramId === "new") return;
    if (authStatus === "loading") return;

    let cancelled = false;

    const load = async () => {
      try {
        if (isAuthenticated) {
          const response = await fetch(`/api/diagrams/${diagramId}`);

          if (response.ok) {
            const stored = (await response.json()) as DiagramDetailResponse;
            if (!cancelled) {
              applyStoredDiagram(dispatch, stored);
            }
            return;
          }

          if (response.status === 404) {
            if (!cancelled) {
              applyDefaultDiagram(dispatch);
            }
            return;
          }

          if (!cancelled) {
            dispatch(setSaveStatus("error"));
          }
          return;
        }

        const raw = localStorage.getItem(getStorageKey(diagramId));
        if (raw) {
          const stored = JSON.parse(raw) as StoredDiagram;
          if (!cancelled) {
            applyStoredDiagram(dispatch, stored);
          }
        } else if (!cancelled) {
          applyDefaultDiagram(dispatch);
        }
      } catch {
        if (!cancelled) {
          dispatch(setSaveStatus("error"));
        }
      } finally {
        if (!cancelled) {
          requestAnimationFrame(() => {
            isFirstLoad.current = false;
          });
        }
      }
    };

    isFirstLoad.current = true;
    load();

    return () => {
      cancelled = true;
    };
  }, [diagramId, dispatch, isAuthenticated, authStatus]);

  useEffect(() => {
    if (!diagramId || diagramId === "new" || isFirstLoad.current) return;
    if (authStatus === "loading") return;

    dispatch(setSaveStatus("unsaved"));

    if (timerRef.current) clearTimeout(timerRef.current);

    const debounceMs = isAuthenticated ? AUTH_SAVE_DEBOUNCE_MS : GUEST_SAVE_DEBOUNCE_MS;

    timerRef.current = setTimeout(() => {
      dispatch(setSaveStatus("saving"));

      const payload: StoredDiagram = {
        id: diagramId,
        title,
        nodes,
        edges,
        eraserCode,
        mermaidCode,
        updatedAt: new Date().toISOString(),
      };

      if (isAuthenticated) {
        fetch(`/api/diagrams/${diagramId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: payload.title,
            nodes: payload.nodes,
            edges: payload.edges,
            eraserCode: payload.eraserCode,
            mermaidCode: payload.mermaidCode,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Save failed");
            }
            dispatch(setSaveStatus("saved"));
          })
          .catch(() => {
            dispatch(setSaveStatus("error"));
          });
        return;
      }

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
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    diagramId,
    dispatch,
    edges,
    eraserCode,
    isAuthenticated,
    authStatus,
    mermaidCode,
    nodes,
    title,
  ]);
}
