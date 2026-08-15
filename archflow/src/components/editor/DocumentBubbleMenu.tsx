"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bold, Code, Italic, Strikethrough } from "lucide-react";

interface DocumentBubbleMenuProps {
  editor: Editor;
}

export function DocumentBubbleMenu({ editor }: DocumentBubbleMenuProps) {
  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-lg"
    >
      <MenuButton
        active={editor.isActive("bold")}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-3.5" />
      </MenuButton>
      <MenuButton
        active={editor.isActive("italic")}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-3.5" />
      </MenuButton>
      <MenuButton
        active={editor.isActive("strike")}
        label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-3.5" />
      </MenuButton>
      <MenuButton
        active={editor.isActive("code")}
        label="Inline code"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="size-3.5" />
      </MenuButton>
    </BubbleMenu>
  );
}

function MenuButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      className={cn("size-7", active && "bg-muted")}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
