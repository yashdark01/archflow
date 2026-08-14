"use client";

import type { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import {
  Code2,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Text,
} from "lucide-react";

interface DocumentFloatingMenuProps {
  editor: Editor;
}

const BLOCK_ITEMS = [
  {
    label: "Text",
    icon: Text,
    run: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    label: "Heading 1",
    icon: Heading1,
    run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    icon: Heading2,
    run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Bullet list",
    icon: List,
    run: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered list",
    icon: ListOrdered,
    run: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Quote",
    icon: Quote,
    run: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Code block",
    icon: Code2,
    run: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
];

export function DocumentFloatingMenu({ editor }: DocumentFloatingMenuProps) {
  return (
    <FloatingMenu
      editor={editor}
      className="flex flex-col gap-0.5 rounded-lg border border-border bg-card p-1 shadow-lg"
    >
      {BLOCK_ITEMS.map(({ label, icon: Icon, run }) => (
        <button
          key={label}
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted"
          onClick={() => run(editor)}
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          {label}
        </button>
      ))}
    </FloatingMenu>
  );
}
