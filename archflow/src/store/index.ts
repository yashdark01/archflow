import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import diagramReducer from "@/store/slices/diagramSlice";
import diagramsReducer from "@/store/slices/diagramsSlice";
import uiReducer from "@/store/slices/uiSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      diagram: diagramReducer,
      diagrams: diagramsReducer,
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
