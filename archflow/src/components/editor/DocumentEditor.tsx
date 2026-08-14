"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDocumentNotes } from "@/store/slices/uiSlice";
import { DocumentEditorContext } from "@/components/editor/document-editor-context";
import { DocumentBubbleMenu } from "@/components/editor/DocumentBubbleMenu";
import { DocumentFloatingMenu } from "@/components/editor/DocumentFloatingMenu";
import {
  isDocumentEmpty,
  normalizeDocumentContent,
} from "@/lib/document/normalizeContent";
import { cn } from "@/lib/utils";

interface DocumentEditorProps {
  diagramId: string;
  compact?: boolean;
}

export function DocumentEditor({ diagramId, compact }: DocumentEditorProps) {
  const dispatch = useAppDispatch();
  const documentNotes = useAppSelector((state) => state.ui.documentNotes);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "archflow-code-block" } },
      }),
    ],
    content: normalizeDocumentContent(documentNotes),
    editorProps: {
      attributes: {
        class: cn(
          "archflow-doc-editor focus:outline-none",
          compact && "archflow-doc-editor-compact",
        ),
        "data-placeholder":
          "Type your notes or document here — style with markdown or shortcuts (⌘ /)",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        dispatch(setDocumentNotes(ed.getHTML()));
      }, 350);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(normalizeDocumentContent(documentNotes), {
      emitUpdate: false,
    });
  }, [diagramId, editor]);

  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const html = normalizeDocumentContent(documentNotes);
    if (html !== editor.getHTML()) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [documentNotes, editor]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (!editor) return null;

  const empty = isDocumentEmpty(editor.getHTML());

  return (
    <DocumentEditorContext.Provider value={editor}>
      <div className="relative min-h-[160px]">
        {empty ? (
          <p
            className="pointer-events-none absolute left-0 top-0 text-sm text-muted-foreground/45"
            aria-hidden
          >
            Type your notes or document here — style with markdown or shortcuts (⌘ /)
          </p>
        ) : null}
        <EditorContent editor={editor} />
        <DocumentBubbleMenu editor={editor} />
        <DocumentFloatingMenu editor={editor} />
      </div>
    </DocumentEditorContext.Provider>
  );
}
