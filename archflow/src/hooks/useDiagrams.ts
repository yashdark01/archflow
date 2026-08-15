"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeDiagram,
  setDiagrams,
  setDiagramsError,
  setDiagramsLoading,
  setSortBy,
  updateDiagramTitle,
} from "@/store/slices/diagramsSlice";
import type { DiagramListItem } from "@/types/api";
import type { DiagramSortBy } from "@/store/slices/diagramsSlice";
import type { StoredDiagram } from "@/types/diagram";

async function fetchDiagrams(): Promise<DiagramListItem[]> {
  const response = await fetch("/api/diagrams");
  if (!response.ok) {
    throw new Error("Failed to load diagrams");
  }
  const data = (await response.json()) as { diagrams: DiagramListItem[] };
  return data.diagrams;
}

function sortDiagrams(items: DiagramListItem[], sortBy: DiagramSortBy): DiagramListItem[] {
  const sorted = [...items];

  switch (sortBy) {
    case "created":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "updated":
    default:
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export function useDiagrams() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const items = useAppSelector((state) => state.diagrams.items);
  const loading = useAppSelector((state) => state.diagrams.loading);
  const error = useAppSelector((state) => state.diagrams.error);
  const sortBy = useAppSelector((state) => state.diagrams.sortBy);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;

    dispatch(setDiagramsLoading(true));
    try {
      const diagrams = await fetchDiagrams();
      dispatch(setDiagrams(diagrams));
    } catch {
      dispatch(setDiagramsError("Failed to load diagrams"));
    } finally {
      dispatch(setDiagramsLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, refresh]);

  const createDiagram = useCallback(async (title?: string): Promise<string> => {
    const response = await fetch("/api/diagrams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Failed to create diagram");
    }

    const diagram = (await response.json()) as { id: string };
    await refresh();
    return diagram.id;
  }, [refresh]);

  const deleteDiagram = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/diagrams/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete diagram");
      }
      dispatch(removeDiagram(id));
    },
    [dispatch],
  );

  const renameDiagram = useCallback(
    async (id: string, title: string) => {
      const response = await fetch(`/api/diagrams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename diagram");
      }

      dispatch(updateDiagramTitle({ id, title }));
    },
    [dispatch],
  );

  const duplicateDiagram = useCallback(
    async (id: string) => {
      const response = await fetch("/api/diagrams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duplicateFromId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate diagram");
      }

      const diagram = (await response.json()) as { id: string };
      await refresh();
      return diagram.id;
    },
    [refresh],
  );

  const migrateGuestDiagram = useCallback(
    async (guest: StoredDiagram) => {
      const response = await fetch("/api/diagrams/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest),
      });

      if (!response.ok) {
        throw new Error("Failed to migrate diagram");
      }

      const diagram = (await response.json()) as { id: string };
      await refresh();
      return diagram.id;
    },
    [refresh],
  );

  const changeSortBy = useCallback(
    (value: DiagramSortBy) => {
      dispatch(setSortBy(value));
    },
    [dispatch],
  );

  return {
    diagrams: sortDiagrams(items, sortBy),
    loading,
    error,
    sortBy,
    refresh,
    createDiagram,
    deleteDiagram,
    renameDiagram,
    duplicateDiagram,
    migrateGuestDiagram,
    changeSortBy,
  };
}
