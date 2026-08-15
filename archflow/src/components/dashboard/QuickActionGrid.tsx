"use client";

import { cn } from "@/lib/utils";
import { Code2, Layers, Plus, Sparkles, SwatchBook } from "lucide-react";

interface QuickActionGridProps {
  onBlankFile: () => void;
  onSampleDiagram: () => void;
}

const ACTIONS = [
  {
    id: "blank",
    title: "Create a Blank File",
    icon: Plus,
    handler: "blank" as const,
  },
  {
    id: "ai",
    title: "Generate an AI Diagram",
    icon: Sparkles,
    handler: "ai" as const,
    disabled: true,
  },
  {
    id: "mcp",
    title: "Connect ArchFlow MCP",
    icon: Code2,
    handler: "mcp" as const,
    disabled: true,
  },
  {
    id: "template",
    title: "Create from Template",
    icon: Layers,
    handler: "sample" as const,
  },
  {
    id: "style",
    title: "Create a Custom Style",
    icon: SwatchBook,
    handler: "style" as const,
    disabled: true,
  },
];

export function QuickActionGrid({ onBlankFile, onSampleDiagram }: QuickActionGridProps) {
  const handleClick = (handler: string, disabled?: boolean) => {
    if (disabled) return;
    if (handler === "blank") onBlankFile();
    if (handler === "sample") onSampleDiagram();
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {ACTIONS.map(({ id, title, icon: Icon, handler, disabled }) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          onClick={() => handleClick(handler, disabled)}
          className={cn(
            "flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4 text-center transition-colors",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:border-border-strong hover:bg-muted/40",
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-muted/50">
            <Icon className="size-5 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium leading-snug text-foreground">{title}</span>
        </button>
      ))}
    </div>
  );
}
