"use client";

import { createContext, useContext } from "react";
import type { Editor } from "@tiptap/react";

export const DocumentEditorContext = createContext<Editor | null>(null);

export function useDocumentEditor(): Editor | null {
  return useContext(DocumentEditorContext);
}
