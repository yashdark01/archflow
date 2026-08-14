"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Circle,
  Code2,
  Frame,
  MessageSquare,
  MousePointer2,
  MoveRight,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Square,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasToolRailProps {
  onInsert: () => void;
  onSearchInsert?: () => void;
  onCode?: () => void;
  onProperties?: () => void;
  onText?: () => void;
  placementActive?: boolean;
}

const TOOLS: {
  icon: typeof MousePointer2;
  label: string;
  shortcut?: string;
  action?: "insert" | "search" | "code" | "properties" | "text";
}[] = [
  { icon: Plus, label: "Insert item", action: "insert" },
  { icon: Sparkles, label: "Generate AI", shortcut: "⌘J" },
  { icon: MousePointer2, label: "Select", shortcut: "V" },
  { icon: Square, label: "Rectangle", shortcut: "R" },
  { icon: Circle, label: "Circle", shortcut: "O" },
  { icon: MoveRight, label: "Arrow", shortcut: "A" },
  { icon: Pencil, label: "Draw", shortcut: "D" },
  { icon: Type, label: "Text", shortcut: "T", action: "text" },
  { icon: Search, label: "Search & insert", shortcut: "Q", action: "search" },
  { icon: Frame, label: "Frame", shortcut: "F" },
  { icon: MessageSquare, label: "Comment", shortcut: "C", action: "properties" },
  { icon: Code2, label: "Diagram as code", action: "code" },
];

export function CanvasToolRail({
  onInsert,
  onSearchInsert,
  onCode,
  onProperties,
  onText,
  placementActive,
}: CanvasToolRailProps) {
  const handleAction = (action?: string) => {
    if (action === "insert") onInsert();
    if (action === "search") onSearchInsert?.();
    if (action === "code") onCode?.();
    if (action === "properties") onProperties?.();
    if (action === "text") onText?.();
  };

  return (
    <div
      className={cn(
        "canvas-tool-rail absolute left-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-0.5 rounded-lg border border-border bg-card/95 p-1 shadow-lg backdrop-blur-sm",
        placementActive && "ring-2 ring-primary/40",
      )}
      role="toolbar"
      aria-label="Canvas tools"
    >
      {TOOLS.map(({ icon: Icon, label, shortcut, action }, index) => (
        <Tooltip key={`${label}-${index}`}>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "relative size-8 text-muted-foreground",
                  action === "insert" && placementActive && "text-primary",
                )}
                disabled={!action}
                onClick={() => handleAction(action)}
              >
                <Icon className="size-4" />
                {shortcut ? (
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] font-medium text-muted-foreground/60">
                    {shortcut.replace("⌘", "")}
                  </span>
                ) : null}
              </Button>
            }
          />
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
