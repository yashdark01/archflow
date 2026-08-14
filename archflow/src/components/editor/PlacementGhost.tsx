"use client";

import { useEffect, useState } from "react";
import { Type } from "lucide-react";
import { EraserIcon } from "@/components/icons/EraserIcon";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { humanizeIconId } from "@/constants/eraserIcons";
import { useAppSelector } from "@/store/hooks";

export function PlacementGhost() {
  const placement = useAppSelector((state) => state.ui.placement);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!placement) return;

    const onMove = (event: MouseEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [placement]);

  if (!placement) return null;

  const label =
    placement.kind === "icon"
      ? humanizeIconId(placement.iconId)
      : placement.kind === "text"
        ? "Text label"
        : NODE_DEFAULTS[placement.nodeType].label;

  return (
    <div
      className="placement-ghost pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.x, top: pos.y }}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-1 rounded-lg border border-primary/50 bg-[#1a1a1c]/95 px-3 py-2 shadow-lg ring-2 ring-primary/30">
        {placement.kind === "icon" ? (
          <EraserIcon iconId={placement.iconId} size={32} />
        ) : placement.kind === "text" ? (
          <Type className="size-8 text-muted-foreground" />
        ) : (
          <span
            className="size-8 rounded-md ring-1 ring-white/20"
            style={{ backgroundColor: NODE_DEFAULTS[placement.nodeType].color }}
          />
        )}
        <span className="text-[10px] font-medium text-foreground">{label}</span>
      </div>
    </div>
  );
}
