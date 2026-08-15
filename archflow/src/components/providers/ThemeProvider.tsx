"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setColorScheme, type ColorScheme } from "@/store/slices/uiSlice";

const STORAGE_KEY = "archflow-color-scheme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const colorScheme = useAppSelector((state) => state.ui.colorScheme);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorScheme | null;
    if (stored === "light" || stored === "dark") {
      dispatch(setColorScheme(stored));
    }
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", colorScheme === "dark");
    root.classList.toggle("light", colorScheme === "light");
    localStorage.setItem(STORAGE_KEY, colorScheme);
  }, [colorScheme]);

  return children;
}
