import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type NodeChange,
} from "reactflow";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  DiagramEdge,
  DiagramNode,
  DiagramSnapshot,
  EdgeData,
  EdgeType,
} from "@/types/diagram";
import { DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";
import { generateId } from "@/utils/generateId";
import { getEdgeMarkers } from "@/utils/edgeMarkers";
import {
  assignEraserName,
  ensureUniqueEraserName,
  slugifyEraserName,
} from "@/lib/eraser/eraserNames";

const HISTORY_LIMIT = 50;

interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  past: DiagramSnapshot[];
  future: DiagramSnapshot[];
}

const initialState: DiagramState = {
  nodes: [],
  edges: [],
  past: [],
  future: [],
};

function cloneNode(node: DiagramNode): DiagramNode {
  return {
    id: node.id,
    type: node.type,
    position: { x: node.position.x, y: node.position.y },
    data: {
      nodeType: node.data.nodeType,
      label: node.data.label,
      color: node.data.color,
      description: node.data.description,
      borderStyle: node.data.borderStyle,
      ...(node.data.icon ? { icon: node.data.icon } : {}),
      ...(node.data.eraserName ? { eraserName: node.data.eraserName } : {}),
    },
    selected: node.selected,
    ...(node.style ? { style: { ...node.style } } : {}),
    ...(node.width != null ? { width: node.width } : {}),
    ...(node.height != null ? { height: node.height } : {}),
    ...(node.parentId ? { parentId: node.parentId } : {}),
  };
}

function cloneEdge(edge: DiagramEdge): DiagramEdge {
  const cloned: DiagramEdge = {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type,
    data: {
      label: edge.data?.label ?? "",
      color: edge.data?.color ?? "#64748b",
      arrowDirection: edge.data?.arrowDirection ?? "forward",
      ...(edge.data?.strokeWidth != null
        ? { strokeWidth: edge.data.strokeWidth }
        : {}),
      ...(edge.data?.strokeStyle ? { strokeStyle: edge.data.strokeStyle } : {}),
      ...(edge.data?.bendPoint ? { bendPoint: { ...edge.data.bendPoint } } : {}),
    },
    selected: edge.selected,
  };

  if (edge.sourceHandle) cloned.sourceHandle = edge.sourceHandle;
  if (edge.targetHandle) cloned.targetHandle = edge.targetHandle;
  if (edge.markerEnd) {
    cloned.markerEnd =
      typeof edge.markerEnd === "string" ? edge.markerEnd : { ...edge.markerEnd };
  }
  if (edge.markerStart) {
    cloned.markerStart =
      typeof edge.markerStart === "string" ? edge.markerStart : { ...edge.markerStart };
  }
  if (edge.style) cloned.style = { ...edge.style };

  return cloned;
}

function snapshot(state: DiagramState): DiagramSnapshot {
  return {
    nodes: state.nodes.map(cloneNode),
    edges: state.edges.map(cloneEdge),
  };
}

function pushHistory(state: DiagramState): void {
  state.past.push(snapshot(state));
  if (state.past.length > HISTORY_LIMIT) {
    state.past.shift();
  }
  state.future = [];
}

const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    loadDiagram(state, action: PayloadAction<DiagramSnapshot>) {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges.map((edge) => ({
        ...edge,
        type: edge.type ?? DEFAULT_EDGE_TYPE,
      }));
      state.past = [];
      state.future = [];
    },
    onNodesChange(state, action: PayloadAction<NodeChange[]>) {
      const shouldSkipHistory = action.payload.every(
        (change) =>
          change.type === "select" ||
          change.type === "dimensions" ||
          (change.type === "position" && change.dragging),
      );

      if (!shouldSkipHistory) {
        pushHistory(state);
      }

      state.nodes = applyNodeChanges(action.payload, state.nodes) as DiagramNode[];
    },
    onEdgesChange(state, action: PayloadAction<EdgeChange[]>) {
      const shouldSkipHistory = action.payload.every((change) => change.type === "select");

      if (!shouldSkipHistory) {
        pushHistory(state);
      }

      state.edges = applyEdgeChanges(action.payload, state.edges) as DiagramEdge[];
    },
    addNode(state, action: PayloadAction<DiagramNode>) {
      pushHistory(state);
      const node = { ...action.payload, data: { ...action.payload.data } };
      if (node.data.eraserName) {
        node.data.eraserName = ensureUniqueEraserName(
          state.nodes,
          node.data.eraserName,
          node.id,
        );
      } else {
        node.data.eraserName = assignEraserName(state.nodes, node.data.label, node.id);
      }
      state.nodes.push(node);
    },
    updateNodeData(
      state,
      action: PayloadAction<{ id: string; data: Partial<DiagramNode["data"]> }>,
    ) {
      pushHistory(state);
      const node = state.nodes.find((item) => item.id === action.payload.id);
      if (node) {
        const patch = { ...action.payload.data };
        if (patch.eraserName !== undefined) {
          const base = slugifyEraserName(patch.eraserName || node.data.label);
          patch.eraserName = ensureUniqueEraserName(state.nodes, base, node.id);
        }
        node.data = { ...node.data, ...patch };
      }
    },
    updateNodePosition(
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>,
    ) {
      const node = state.nodes.find((item) => item.id === action.payload.id);
      if (node) {
        node.position = action.payload.position;
      }
    },
    removeNode(state, action: PayloadAction<string>) {
      pushHistory(state);
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
      state.edges = state.edges.filter(
        (edge) => edge.source !== action.payload && edge.target !== action.payload,
      );
    },
    removeSelected(state, action: PayloadAction<{ nodeIds: string[]; edgeIds: string[] }>) {
      if (action.payload.nodeIds.length === 0 && action.payload.edgeIds.length === 0) {
        return;
      }
      pushHistory(state);
      state.nodes = state.nodes.filter(
        (node) => !action.payload.nodeIds.includes(node.id),
      );
      state.edges = state.edges.filter((edge) => {
        if (action.payload.edgeIds.includes(edge.id)) return false;
        return (
          !action.payload.nodeIds.includes(edge.source) &&
          !action.payload.nodeIds.includes(edge.target)
        );
      });
    },
    addEdge(state, action: PayloadAction<DiagramEdge>) {
      pushHistory(state);
      state.edges.push(action.payload);
    },
    updateEdgeData(
      state,
      action: PayloadAction<{ id: string; data: Partial<EdgeData> }>,
    ) {
      pushHistory(state);
      const edge = state.edges.find((item) => item.id === action.payload.id);
      const patch = action.payload.data;
      if (edge?.data && patch) {
        const next: EdgeData = { ...edge.data, ...patch };
        if ("bendPoint" in patch && patch.bendPoint === undefined) {
          delete next.bendPoint;
        }
        edge.data = next;
        const markers = getEdgeMarkers(next.arrowDirection, next.color);
        if (markers.markerEnd) edge.markerEnd = markers.markerEnd;
        else delete edge.markerEnd;
        if (markers.markerStart) edge.markerStart = markers.markerStart;
        else delete edge.markerStart;
      }
    },
    updateEdgeType(state, action: PayloadAction<{ id: string; type: EdgeType }>) {
      pushHistory(state);
      const edge = state.edges.find((item) => item.id === action.payload.id);
      if (edge) {
        edge.type = action.payload.type;
      }
    },
    updateEdgeConnection(
      state,
      action: PayloadAction<{
        id: string;
        source: string;
        target: string;
        sourceHandle?: string | null;
        targetHandle?: string | null;
      }>,
    ) {
      pushHistory(state);
      const edge = state.edges.find((item) => item.id === action.payload.id);
      if (!edge) return;

      edge.source = action.payload.source;
      edge.target = action.payload.target;

      if (action.payload.sourceHandle) {
        edge.sourceHandle = action.payload.sourceHandle;
      } else {
        delete edge.sourceHandle;
      }

      if (action.payload.targetHandle) {
        edge.targetHandle = action.payload.targetHandle;
      } else {
        delete edge.targetHandle;
      }
    },
    setNodes(state, action: PayloadAction<DiagramNode[]>) {
      pushHistory(state);
      state.nodes = action.payload;
    },
    pasteNodes(
      state,
      action: PayloadAction<{ nodes: DiagramNode[]; offset?: number }>,
    ) {
      if (action.payload.nodes.length === 0) return;
      pushHistory(state);
      const offset = action.payload.offset ?? 40;
      const takenNodes = [...state.nodes];
      const newNodes = action.payload.nodes.map((node) => {
        const id = generateId();
        const eraserName = node.data.eraserName
          ? ensureUniqueEraserName(takenNodes, node.data.eraserName, id)
          : assignEraserName(takenNodes, node.data.label, id);
        const newNode: DiagramNode = {
          ...node,
          id,
          data: { ...node.data, eraserName },
          position: {
            x: node.position.x + offset,
            y: node.position.y + offset,
          },
          selected: true,
        };
        takenNodes.push(newNode);
        return newNode;
      });
      state.nodes = [
        ...state.nodes.map((node) => ({ ...node, selected: false })),
        ...newNodes,
      ];
    },
    selectAll(state) {
      state.nodes = state.nodes.map((node) => ({ ...node, selected: true }));
      state.edges = state.edges.map((edge) => ({ ...edge, selected: true }));
    },
    deselectAll(state) {
      state.nodes = state.nodes.map((node) => ({ ...node, selected: false }));
      state.edges = state.edges.map((edge) => ({ ...edge, selected: false }));
    },
    undo(state) {
      const previous = state.past.pop();
      if (!previous) return;
      state.future.push(snapshot(state));
      state.nodes = previous.nodes;
      state.edges = previous.edges;
    },
    redo(state) {
      const next = state.future.pop();
      if (!next) return;
      state.past.push(snapshot(state));
      state.nodes = next.nodes;
      state.edges = next.edges;
    },
    commitDragHistory(state) {
      pushHistory(state);
    },
  },
});

export const {
  loadDiagram,
  onNodesChange,
  onEdgesChange,
  addNode,
  updateNodeData,
  updateNodePosition,
  removeNode,
  removeSelected,
  addEdge,
  updateEdgeData,
  updateEdgeType,
  updateEdgeConnection,
  setNodes,
  pasteNodes,
  selectAll,
  deselectAll,
  undo,
  redo,
  commitDragHistory,
} = diagramSlice.actions;

export default diagramSlice.reducer;

export function createEmptyDiagram(): DiagramSnapshot {
  return { nodes: [], edges: [] };
}

export { DEFAULT_EDGE_TYPE };
