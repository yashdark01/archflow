import type { DiagramEdge, DiagramNode, StoredDiagram } from "@/types/diagram";

export interface DiagramListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagramListResponse {
  diagrams: DiagramListItem[];
}

export interface DiagramDetailResponse extends StoredDiagram {
  createdAt: string;
}

export interface CreateDiagramRequest {
  title?: string;
  duplicateFromId?: string;
}

export interface UpdateDiagramRequest {
  title?: string;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  eraserCode?: string;
  mermaidCode?: string;
}

export interface ApiErrorResponse {
  error: string;
}
