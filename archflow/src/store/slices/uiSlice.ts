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

export type EditorViewMode = "document" | "both" | "canvas";
export type CodeDialect = "eraser" | "mermaid";
export type MermaidSyncStatus = "synced" | "pending" | "error";
export type EraserSyncStatus = "synced" | "pending" | "error";
export type LayoutDirection = "LR" | "TD";
export type CodePanelTab = "code" | "preview";

export type PlacementPayload =
  | { kind: "node"; nodeType: NodeType }
  | { kind: "icon"; iconId: string }
  | { kind: "text" };

export type InsertPickerView = "root" | "icons" | "nodes";
export type ColorScheme = "dark" | "light";

interface UiState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  sidebarOpen: boolean;
  insertPickerOpen: boolean;
  insertPickerFocusSearch: boolean;
  insertPickerView: InsertPickerView;
  placement: PlacementPayload | null;
  propertiesPanelOpen: boolean;
  propertiesPanelWidth: number;
  documentNotes: string;
  codePanelOpen: boolean;
  codeSheetOpen: boolean;
  editorViewMode: EditorViewMode;
  eraserCode: string;
  codeDialect: CodeDialect;
  codePanelTab: CodePanelTab;
  mermaidCode: string;
  mermaidSyncStatus: MermaidSyncStatus;
  mermaidSyncError: string | null;
  eraserSyncStatus: EraserSyncStatus;
  eraserSyncError: string | null;
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
  propertiesPanelOpen: false,
  propertiesPanelWidth: 320,
  codePanelOpen: true,
  codeSheetOpen: false,
  documentNotes: "",
  editorViewMode: "both",
  eraserCode: "",
  codeDialect: "mermaid",
  codePanelTab: "code",
  mermaidCode: "",
  mermaidSyncStatus: "synced",
  mermaidSyncError: null,
  eraserSyncStatus: "synced",
  eraserSyncError: null,
  layoutManual: false,
  layoutDirection: "LR",
  minimapOpen: true,
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
    togglePropertiesPanel(state) {
      state.propertiesPanelOpen = !state.propertiesPanelOpen;
    },
    setPropertiesPanelOpen(state, action: PayloadAction<boolean>) {
      state.propertiesPanelOpen = action.payload;
    },
    setPropertiesPanelWidth(state, action: PayloadAction<number>) {
      state.propertiesPanelWidth = Math.min(480, Math.max(240, action.payload));
    },
    toggleCodePanel(state) {
      state.codePanelOpen = !state.codePanelOpen;
    },
    toggleCodeSheet(state) {
      state.codeSheetOpen = !state.codeSheetOpen;
    },
    setCodeSheetOpen(state, action: PayloadAction<boolean>) {
      state.codeSheetOpen = action.payload;
    },
    setEditorViewMode(state, action: PayloadAction<EditorViewMode>) {
      state.editorViewMode = action.payload;
      if (action.payload === "document") {
        state.codePanelOpen = true;
      } else if (action.payload === "canvas") {
        state.codePanelOpen = false;
      } else {
        state.codePanelOpen = true;
      }
    },
    setEraserCode(state, action: PayloadAction<string>) {
      state.eraserCode = action.payload;
    },
    setCodeDialect(state, action: PayloadAction<CodeDialect>) {
      state.codeDialect = action.payload;
      state.codePanelTab = "code";
    },
    setCodePanelTab(state, action: PayloadAction<CodePanelTab>) {
      state.codePanelTab = action.payload;
    },
    setMermaidCode(state, action: PayloadAction<string>) {
      state.mermaidCode = action.payload;
    },
    setMermaidSyncStatus(state, action: PayloadAction<MermaidSyncStatus>) {
      state.mermaidSyncStatus = action.payload;
    },
    setMermaidSyncError(state, action: PayloadAction<string | null>) {
      state.mermaidSyncError = action.payload;
    },
    setEraserSyncStatus(state, action: PayloadAction<EraserSyncStatus>) {
      state.eraserSyncStatus = action.payload;
    },
    setEraserSyncError(state, action: PayloadAction<string | null>) {
      state.eraserSyncError = action.payload;
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
    setDocumentNotes(state, action: PayloadAction<string>) {
      state.documentNotes = action.payload;
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
  togglePropertiesPanel,
  setPropertiesPanelOpen,
  setPropertiesPanelWidth,
  toggleCodePanel,
  toggleCodeSheet,
  setCodeSheetOpen,
  setEditorViewMode,
  setEraserCode,
  setCodeDialect,
  setCodePanelTab,
  setMermaidCode,
  setMermaidSyncStatus,
  setMermaidSyncError,
  setEraserSyncStatus,
  setEraserSyncError,
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
  setDocumentNotes,
  setSaveStatus,
  setCopiedNodes,
  acknowledgeMobileEditor,
  setColorScheme,
  toggleColorScheme,
} = uiSlice.actions;

export default uiSlice.reducer;
