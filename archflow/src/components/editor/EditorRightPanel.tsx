"use client";

import { useCallback, useState, type PointerEvent as ReactPointerEvent } from "react";
import { CodePanelEditor } from "@/components/code-panel/CodePanelEditor";
import { PropertiesPanelContent } from "@/components/properties/PropertiesPanelContent";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setRightPanelTab,
  type RightPanelTab,
} from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import { Code2, MessageSquare, X } from "lucide-react";

interface EditorRightPanelProps {
  onClose?: () => void;
  onResize?: (width: number) => void;
}

const TABS: { id: RightPanelTab; label: string; icon: typeof MessageSquare }[] = [
  { id: "properties", label: "Properties", icon: MessageSquare },
  { id: "code", label: "Code", icon: Code2 },
];

export function EditorRightPanel({ onClose, onResize }: EditorRightPanelProps) {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.ui.rightPanelTab);
  const width = useAppSelector((state) => state.ui.rightPanelWidth);
  const [resizing, setResizing] = useState(false);

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!onResize) return;
      event.preventDefault();
      setResizing(true);
      const startX = event.clientX;
      const startWidth = width;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const delta = startX - moveEvent.clientX;
        onResize(startWidth + delta);
      };

      const onPointerUp = () => {
        setResizing(false);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [onResize, width],
  );

  return (
    <aside
      data-right-panel
      className={cn(
        "relative z-30 flex min-h-0 shrink-0 flex-col border-l border-border bg-card",
        resizing && "transition-none",
      )}
      style={{ width }}
      aria-label="Editor panel"
    >
      {onResize ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
          className="absolute left-0 top-0 z-10 h-full w-2 -translate-x-1/2 cursor-col-resize touch-none hover:bg-primary/20 active:bg-primary/30"
          onPointerDown={onResizePointerDown}
        />
      ) : null}

      <header className="flex shrink-0 items-center gap-1 border-b border-border px-2 py-2">
        <div className="flex min-w-0 flex-1 gap-0.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={tab === id ? "secondary" : "ghost"}
              className="h-7 gap-1.5 px-2.5 text-xs"
              aria-pressed={tab === id}
              onClick={() => dispatch(setRightPanelTab(id))}
            >
              <Icon className="size-3.5" />
              {label}
            </Button>
          ))}
        </div>
        {onClose ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Close panel"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === "properties" ? (
          <PropertiesPanelContent />
        ) : (
          <CodePanelEditor />
        )}
      </div>
    </aside>
  );
}
