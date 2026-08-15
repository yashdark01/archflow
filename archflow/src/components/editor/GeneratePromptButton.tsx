"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratePromptButtonProps {
  label: string;
  className?: string;
}

export function GeneratePromptButton({ label, className }: GeneratePromptButtonProps) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <Sparkles className="size-4 text-primary" />
      <span>{label}</span>
      <span className="text-[10px] text-muted-foreground/70">⌘ J</span>
      <Sparkles className="size-4 text-primary" />
    </button>
  );
}
