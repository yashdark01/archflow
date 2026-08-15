"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useAppSelector } from "@/store/hooks";

interface EraserMonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  onMount?: OnMount;
  className?: string;
}

export function EraserMonacoEditor({
  value,
  onChange,
  onMount,
  className,
}: EraserMonacoEditorProps) {
  const colorScheme = useAppSelector((state) => state.ui.colorScheme);

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorInstance.updateOptions({
      fontSize: 13,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      lineNumbers: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      padding: { top: 12, bottom: 12 },
      tabSize: 2,
      automaticLayout: true,
    });

    monaco.editor.defineTheme("archflow-eraser-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#111113",
        "editor.lineHighlightBackground": "#1a1a1e",
      },
    });

    monaco.editor.defineTheme("archflow-eraser-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#f8fafc",
        "editor.lineHighlightBackground": "#f1f5f9",
      },
    });

    monaco.editor.setTheme(
      colorScheme === "dark" ? "archflow-eraser-dark" : "archflow-eraser-light",
    );

    onMount?.(editorInstance, monaco);
  };

  return (
    <div className={className ?? "h-full min-h-0 w-full"}>
      <Editor
        height="100%"
        language="plaintext"
        theme={colorScheme === "dark" ? "archflow-eraser-dark" : "archflow-eraser-light"}
        value={value}
        onChange={(next) => onChange(next ?? "")}
        onMount={handleMount}
        options={{
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
