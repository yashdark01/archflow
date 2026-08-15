"use client";

import { useState } from "react";
import { IconPalette } from "@/components/sidebar/IconPalette";
import { NodePalette } from "@/components/sidebar/NodePalette";
import { cn } from "@/lib/utils";

type SidebarTab = "nodes" | "icons";

export function SidebarPalette() {
  const [tab, setTab] = useState<SidebarTab>("nodes");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 gap-1 border-b border-border p-2">
        <button
          type="button"
          onClick={() => setTab("nodes")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
            tab === "nodes"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          Nodes
        </button>
        <button
          type="button"
          onClick={() => setTab("icons")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
            tab === "icons"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          Icons
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === "nodes" ? <NodePalette /> : <IconPalette />}
      </div>
    </div>
  );
}
