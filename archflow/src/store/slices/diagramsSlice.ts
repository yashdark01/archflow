import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DiagramListItem } from "@/types/api";

export type DiagramSortBy = "updated" | "created" | "title";

interface DiagramsState {
  items: DiagramListItem[];
  loading: boolean;
  error: string | null;
  sortBy: DiagramSortBy;
}

const initialState: DiagramsState = {
  items: [],
  loading: false,
  error: null,
  sortBy: "updated",
};

const diagramsSlice = createSlice({
  name: "diagrams",
  initialState,
  reducers: {
    setDiagramsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDiagrams(state, action: PayloadAction<DiagramListItem[]>) {
      state.items = action.payload;
      state.error = null;
    },
    setDiagramsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setSortBy(state, action: PayloadAction<DiagramSortBy>) {
      state.sortBy = action.payload;
    },
    removeDiagram(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateDiagramTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const item = state.items.find((diagram) => diagram.id === action.payload.id);
      if (item) {
        item.title = action.payload.title;
      }
    },
  },
});

export const {
  setDiagramsLoading,
  setDiagrams,
  setDiagramsError,
  setSortBy,
  removeDiagram,
  updateDiagramTitle,
} = diagramsSlice.actions;

export default diagramsSlice.reducer;
