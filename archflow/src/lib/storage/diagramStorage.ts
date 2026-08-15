import { DEFAULT_ERASER_CODE } from "@/lib/eraser/defaultCode";
import { DEFAULT_MERMAID_CODE } from "@/lib/mermaid/defaultCode";
import type { StoredDiagram } from "@/types/diagram";
import { generateId } from "@/utils/generateId";

export const DIAGRAM_STORAGE_PREFIX = "archflow-diagram-";

export function getDiagramStorageKey(diagramId: string): string {
  return `${DIAGRAM_STORAGE_PREFIX}${diagramId}`;
}

export function listStoredDiagrams(): StoredDiagram[] {
  if (typeof window === "undefined") return [];

  const diagrams: StoredDiagram[] = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(DIAGRAM_STORAGE_PREFIX)) continue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const stored = JSON.parse(raw) as StoredDiagram;
      if (stored.id) diagrams.push(stored);
    } catch {
      // skip corrupt entries
    }
  }

  return diagrams.sort((a, b) => {
    const aTime = a.updatedAt ?? "";
    const bTime = b.updatedAt ?? "";
    return bTime.localeCompare(aTime);
  });
}

export function createNewDiagramId(): string {
  return generateId();
}

export function seedBlankDiagram(diagramId: string, title = "Untitled Diagram"): StoredDiagram {
  const payload: StoredDiagram = {
    id: diagramId,
    title,
    nodes: [],
    edges: [],
    eraserCode: DEFAULT_ERASER_CODE,
    mermaidCode: DEFAULT_MERMAID_CODE,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(getDiagramStorageKey(diagramId), JSON.stringify(payload));
  return payload;
}

export function deleteStoredDiagram(diagramId: string): void {
  localStorage.removeItem(getDiagramStorageKey(diagramId));
}

export function formatDiagramDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}
