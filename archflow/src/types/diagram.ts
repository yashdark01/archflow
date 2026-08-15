import type { Edge, Node } from "reactflow";

export type NodeType =
  | "service"
  | "database"
  | "cache"
  | "queue"
  | "apiGateway"
  | "loadBalancer"
  | "user"
  | "group"
  | "cloud"
  | "text";

export type EdgeType = "default" | "straight" | "step" | "smoothstep";

export type BorderStyle = "solid" | "dashed" | "none";

export type ArrowDirection = "forward" | "backward" | "bidirectional" | "none";

export type EdgeStrokeStyle = "solid" | "dashed" | "dotted";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export interface NodeData extends Record<string, unknown> {
  nodeType: NodeType;
  label: string;
  color: string;
  description: string;
  borderStyle: BorderStyle;
  /** Eraser icon slug — https://docs.eraser.io/icons */
  icon?: string;
  /** Unique Eraser diagram-as-code identifier (used in connections). */
  eraserName?: string;
}

export interface EdgeData extends Record<string, unknown> {
  label: string;
  color: string;
  arrowDirection: ArrowDirection;
  strokeWidth?: number;
  strokeStyle?: EdgeStrokeStyle;
  /** Custom bend vertex in flow coordinates (L-shape / routed paths). */
  bendPoint?: { x: number; y: number };
}

export type DiagramNode = Node<NodeData>;
export type DiagramEdge = Edge<EdgeData>;

export interface DiagramSnapshot {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface StoredDiagram extends DiagramSnapshot {
  id: string;
  title: string;
  updatedAt: string;
  eraserCode?: string;
  mermaidCode?: string;
  documentNotes?: string;
}
