"use client";

import { cn } from "@/lib/utils";
import { Layers, Plus } from "lucide-react";

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
    id: "template",
    title: "Create from Template",
    icon: Layers,
    handler: "sample" as const,
  },
];

export function QuickActionGrid({ onBlankFile, onSampleDiagram }: QuickActionGridProps) {
  const handleClick = (handler: string) => {
    if (handler === "blank") onBlankFile();
    if (handler === "sample") onSampleDiagram();
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2">
      {ACTIONS.map(({ id, title, icon: Icon, handler }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleClick(handler)}
          className={cn(
            "flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4 text-center transition-colors",
            "hover:border-border-strong hover:bg-muted/40",
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
