import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ArrowDirection,
  DiagramNode,
  EdgeStrokeStyle,
  EdgeType,
  NodeType,
  SaveStatus,
} from "@/types/diagram";
import { DEFAULT_EDGE_COLOR, DEFAULT_EDGE_STROKE_WIDTH } from "@/constants/edgeDefaults";
import { DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";

export type LayoutDirection = "LR" | "TD";

export type PlacementPayload =
  | { kind: "node"; nodeType: NodeType }
  | { kind: "icon"; iconId: string }
  | { kind: "text" };

export type InsertPickerView = "root" | "icons" | "nodes";
export type ColorScheme = "dark" | "light";
export type RightPanelTab = "properties" | "code";

interface UiState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  sidebarOpen: boolean;
  insertPickerOpen: boolean;
  insertPickerFocusSearch: boolean;
  insertPickerView: InsertPickerView;
  placement: PlacementPayload | null;
  rightPanelOpen: boolean;
  rightPanelTab: RightPanelTab;
  rightPanelWidth: number;
  codePanelDirty: boolean;
  eraserCode: string;
  mermaidCode: string;
  layoutManual: boolean;
  layoutDirection: LayoutDirection;
  minimapOpen: boolean;
  snapToGrid: boolean;
  activeEdgeType: EdgeType;
  activeArrowDirection: ArrowDirection;
  activeEdgeColor: string;
  activeStrokeWidth: number;
  activeStrokeStyle: EdgeStrokeStyle;
  edgeLabelEditId: string | null;
  nodeLabelEditId: string | null;
  diagramTitle: string;
  saveStatus: SaveStatus;
  copiedNodes: DiagramNode[];
  mobileEditorAcknowledged: boolean;
  colorScheme: ColorScheme;
}

const initialState: UiState = {
  selectedNodeId: null,
  selectedEdgeId: null,
  sidebarOpen: false,
  insertPickerOpen: false,
  insertPickerFocusSearch: false,
  insertPickerView: "root",
  placement: null,
  rightPanelOpen: false,
  rightPanelTab: "properties",
  rightPanelWidth: 400,
  codePanelDirty: false,
  eraserCode: "",
  mermaidCode: "",
  layoutManual: false,
  layoutDirection: "LR",
  minimapOpen: false,
  snapToGrid: true,
  activeEdgeType: DEFAULT_EDGE_TYPE,
  activeArrowDirection: "forward",
  activeEdgeColor: DEFAULT_EDGE_COLOR,
  activeStrokeWidth: DEFAULT_EDGE_STROKE_WIDTH,
  activeStrokeStyle: "solid",
  edgeLabelEditId: null,
  nodeLabelEditId: null,
  diagramTitle: "Untitled Diagram",
  saveStatus: "saved",
  copiedNodes: [],
  mobileEditorAcknowledged: false,
  colorScheme: "dark",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedNode(state, action: PayloadAction<string | null>) {
      state.selectedNodeId = action.payload;
      if (action.payload) state.selectedEdgeId = null;
    },
    setSelectedEdge(state, action: PayloadAction<string | null>) {
      state.selectedEdgeId = action.payload;
      if (action.payload) state.selectedNodeId = null;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setInsertPickerOpen(
      state,
      action: PayloadAction<boolean | { open: boolean; focusSearch?: boolean }>,
    ) {
      const open =
        typeof action.payload === "boolean" ? action.payload : action.payload.open;
      const focusSearch =
        typeof action.payload === "object" ? action.payload.focusSearch ?? false : false;
      state.insertPickerOpen = open;
      state.insertPickerFocusSearch = open ? focusSearch : false;
      if (!open) state.insertPickerView = "root";
    },
    setInsertPickerView(state, action: PayloadAction<InsertPickerView>) {
      state.insertPickerView = action.payload;
    },
    startPlacement(state, action: PayloadAction<PlacementPayload>) {
      state.placement = action.payload;
      state.insertPickerOpen = false;
      state.insertPickerView = "root";
    },
    clearPlacement(state) {
      state.placement = null;
    },
    toggleRightPanel(state) {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelOpen(state, action: PayloadAction<boolean>) {
      state.rightPanelOpen = action.payload;
    },
    setRightPanelTab(state, action: PayloadAction<RightPanelTab>) {
      state.rightPanelTab = action.payload;
    },
    setRightPanelWidth(state, action: PayloadAction<number>) {
      state.rightPanelWidth = Math.min(720, Math.max(280, action.payload));
    },
    openRightPanelTab(state, action: PayloadAction<RightPanelTab>) {
      if (state.rightPanelOpen && state.rightPanelTab === action.payload) {
        state.rightPanelOpen = false;
        return;
      }
      state.rightPanelOpen = true;
      state.rightPanelTab = action.payload;
    },
    setCodePanelDirty(state, action: PayloadAction<boolean>) {
      state.codePanelDirty = action.payload;
    },
    setEraserCode(state, action: PayloadAction<string>) {
      state.eraserCode = action.payload;
    },
    setMermaidCode(state, action: PayloadAction<string>) {
      state.mermaidCode = action.payload;
    },
    setLayoutManual(state, action: PayloadAction<boolean>) {
      state.layoutManual = action.payload;
    },
    resetLayout(state) {
      state.layoutManual = false;
    },
    setLayoutDirection(state, action: PayloadAction<LayoutDirection>) {
      state.layoutDirection = action.payload;
    },
    toggleMinimap(state) {
      state.minimapOpen = !state.minimapOpen;
    },
    toggleSnapToGrid(state) {
      state.snapToGrid = !state.snapToGrid;
    },
    setActiveEdgeType(state, action: PayloadAction<EdgeType>) {
      state.activeEdgeType = action.payload;
    },
    setActiveArrowDirection(state, action: PayloadAction<ArrowDirection>) {
      state.activeArrowDirection = action.payload;
    },
    setActiveEdgeColor(state, action: PayloadAction<string>) {
      state.activeEdgeColor = action.payload;
    },
    setActiveStrokeWidth(state, action: PayloadAction<number>) {
      state.activeStrokeWidth = action.payload;
    },
    setActiveStrokeStyle(state, action: PayloadAction<EdgeStrokeStyle>) {
      state.activeStrokeStyle = action.payload;
    },
    requestEdgeLabelEdit(state, action: PayloadAction<string | null>) {
      state.edgeLabelEditId = action.payload;
    },
    requestNodeLabelEdit(state, action: PayloadAction<string | null>) {
      state.nodeLabelEditId = action.payload;
    },
    setDiagramTitle(state, action: PayloadAction<string>) {
      state.diagramTitle = action.payload;
    },
    setSaveStatus(state, action: PayloadAction<SaveStatus>) {
      state.saveStatus = action.payload;
    },
    setCopiedNodes(state, action: PayloadAction<DiagramNode[]>) {
      state.copiedNodes = action.payload;
    },
    acknowledgeMobileEditor(state) {
      state.mobileEditorAcknowledged = true;
    },
    setColorScheme(state, action: PayloadAction<ColorScheme>) {
      state.colorScheme = action.payload;
    },
    toggleColorScheme(state) {
      state.colorScheme = state.colorScheme === "dark" ? "light" : "dark";
    },
  },
});

export const {
  setSelectedNode,
  setSelectedEdge,
  toggleSidebar,
  setSidebarOpen,
  setInsertPickerOpen,
  setInsertPickerView,
  startPlacement,
  clearPlacement,
  toggleRightPanel,
  setRightPanelOpen,
  setRightPanelTab,
  setRightPanelWidth,
  openRightPanelTab,
  setCodePanelDirty,
  setEraserCode,
  setMermaidCode,
  setLayoutManual,
  resetLayout,
  setLayoutDirection,
  toggleMinimap,
  toggleSnapToGrid,
  setActiveEdgeType,
  setActiveArrowDirection,
  setActiveEdgeColor,
  setActiveStrokeWidth,
  setActiveStrokeStyle,
  requestEdgeLabelEdit,
  requestNodeLabelEdit,
  setDiagramTitle,
  setSaveStatus,
  setCopiedNodes,
  acknowledgeMobileEditor,
  setColorScheme,
  toggleColorScheme,
} = uiSlice.actions;

export default uiSlice.reducer;
