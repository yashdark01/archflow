"use client";

import {
  AlignLeft,
  Code2,
  LayoutTemplate,
  List,
  ListOrdered,
  Plus,
  Type,
} from "lucide-react";
import { useDocumentEditor } from "@/components/editor/document-editor-context";
import { cn } from "@/lib/utils";

export function DocumentFormatToolbar() {
  const editor = useDocumentEditor();

  if (!editor) {
    return (
      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-border bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-lg"
      >
        Select text in the document to format
      </div>
    );
  }

  return (
    <div
      className="pointer-events-auto absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-border bg-card/95 px-1 py-1 shadow-lg backdrop-blur-sm"
      role="toolbar"
      aria-label="Document formatting"
    >
      <ToolbarIcon
        icon={Plus}
        label="New line"
        onClick={() => editor.chain().focus().insertContent("<p></p>").run()}
      />
      <div className="mx-0.5 h-5 w-px bg-border" />
      <ToolbarIcon
        icon={Type}
        label="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      />
      <ToolbarIcon
        icon={List}
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarIcon
        icon={ListOrdered}
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <div className="mx-0.5 h-5 w-px bg-border" />
      <ToolbarIcon
        icon={Code2}
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <ToolbarIcon
        icon={LayoutTemplate}
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarIcon
        icon={AlignLeft}
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <div className="mx-0.5 h-5 w-px bg-border" />
      <ToolbarIcon
        icon={Plus}
        label="AI (soon)"
        sparkle
        disabled
      />
    </div>
  );
}

function ToolbarIcon({
  icon: Icon,
  label,
  active,
  sparkle,
  disabled,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  active?: boolean;
  sparkle?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={label}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50",
        active && "bg-muted text-foreground",
      )}
    >
      {sparkle ? (
        <span className="text-xs text-primary">✦</span>
      ) : (
        <Icon className="size-4" />
      )}
    </button>
  );
}
