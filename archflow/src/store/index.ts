import { configureStore } from "@reduxjs/toolkit";
import diagramReducer from "@/store/slices/diagramSlice";
import uiReducer from "@/store/slices/uiSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      diagram: diagramReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
