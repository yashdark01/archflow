import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthStatus(
      state,
      action: PayloadAction<{ status: AuthState["status"]; user?: AuthUser | null }>,
    ) {
      state.status = action.payload.status;
      state.isAuthenticated = action.payload.status === "authenticated";
      state.user = action.payload.user ?? null;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setAuthStatus, clearAuth } = authSlice.actions;
export default authSlice.reducer;
