import type { Diagram } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type {
  CreateDiagramRequest,
  DiagramDetailResponse,
  DiagramListItem,
  UpdateDiagramRequest,
} from "@/types/api";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";

export function toDiagramListItem(diagram: Diagram): DiagramListItem {
  return {
    id: diagram.id,
    title: diagram.title,
    createdAt: diagram.createdAt.toISOString(),
    updatedAt: diagram.updatedAt.toISOString(),
  };
}

export function toDiagramDetail(diagram: Diagram): DiagramDetailResponse {
  const nodes = (diagram.nodes as unknown as DiagramNode[]) ?? [];
  const edges = (diagram.edges as unknown as DiagramEdge[]) ?? [];

  return {
    id: diagram.id,
    title: diagram.title,
    nodes,
    edges,
    eraserCode: diagram.eraserCode ?? undefined,
    mermaidCode: diagram.mermaidCode ?? undefined,
    documentNotes: diagram.documentNotes ?? undefined,
    updatedAt: diagram.updatedAt.toISOString(),
    createdAt: diagram.createdAt.toISOString(),
  };
}

export function toInputJsonArray<T>(value: T[]): Prisma.InputJsonArray {
  return value as Prisma.InputJsonArray;
}

export function parseCreateDiagramBody(body: unknown): CreateDiagramRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const record = body as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title : undefined;
  const duplicateFromId =
    typeof record.duplicateFromId === "string" ? record.duplicateFromId : undefined;

  return { title, duplicateFromId };
}

export function parseUpdateDiagramBody(body: unknown): UpdateDiagramRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const record = body as Record<string, unknown>;
  const result: UpdateDiagramRequest = {};

  if (typeof record.title === "string") {
    result.title = record.title;
  }
  if (Array.isArray(record.nodes)) {
    result.nodes = record.nodes as DiagramNode[];
  }
  if (Array.isArray(record.edges)) {
    result.edges = record.edges as DiagramEdge[];
  }
  if (typeof record.eraserCode === "string") {
    result.eraserCode = record.eraserCode;
  }
  if (typeof record.mermaidCode === "string") {
    result.mermaidCode = record.mermaidCode;
  }

  return result;
}

export function parseGuestDiagramPayload(
  body: unknown,
): {
  title?: string;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  eraserCode?: string;
  mermaidCode?: string;
} | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const record = body as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title : undefined;
  const nodes = Array.isArray(record.nodes) ? (record.nodes as DiagramNode[]) : undefined;
  const edges = Array.isArray(record.edges) ? (record.edges as DiagramEdge[]) : undefined;
  const eraserCode = typeof record.eraserCode === "string" ? record.eraserCode : undefined;
  const mermaidCode = typeof record.mermaidCode === "string" ? record.mermaidCode : undefined;

  if (!title && !nodes && !edges && !eraserCode && !mermaidCode) {
    return null;
  }

  return { title, nodes, edges, eraserCode, mermaidCode };
}
