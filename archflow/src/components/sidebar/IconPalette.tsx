"use client";

import { useMemo, useState, type DragEvent } from "react";
import { EraserIcon } from "@/components/icons/EraserIcon";
import { useEraserCatalog } from "@/hooks/useEraserCatalog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { startPaletteDrag, clearPaletteDragSession } from "@/lib/canvas/paletteDragSession";
import { cn } from "@/lib/utils";

export function IconPalette() {
  const { catalog, loading, error } = useEraserCatalog();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("aws-icons");

  const categories = useMemo(() => catalog?.categories ?? [], [catalog]);

  const filteredIcons = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const pool = normalized
      ? categories.flatMap((cat) => cat.icons)
      : categories.find((c) => c.id === activeCategory)?.icons ?? [];

    if (!normalized) return pool;

    return pool.filter((icon) => icon.id.includes(normalized));
  }, [activeCategory, categories, query]);

  const onDragStart = (event: DragEvent<HTMLButtonElement>, iconId: string) => {
    event.dataTransfer.setData("application/archflow-icon", iconId);
    event.dataTransfer.effectAllowed = "copy";
    startPaletteDrag({ iconId });
  };

  const onDragEnd = () => {
    clearPaletteDragSession();
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading Eraser icons…</div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="p-4 text-sm text-destructive">
        Could not load icon catalog. {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="space-y-1">
        <p className="section-label">Eraser icons</p>
        <p className="text-xs text-muted-foreground">
          {catalog.categories.reduce((n, c) => n + c.icons.length, 0).toLocaleString()}{" "}
          SVGs from{" "}
          <a
            href="https://docs.eraser.io/icons"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eraser docs
          </a>
        </p>
      </div>

      <Input
        placeholder="Filter icons (e.g. aws-ec2, redis)…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Filter Eraser icons"
        className="bg-background"
      />

      {!query.trim() ? (
        <ScrollArea className="h-8 w-full">
          <div className="flex gap-1 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {cat.label}
                <span className="ml-1 opacity-70">{cat.icons.length}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-xs text-muted-foreground">
          {filteredIcons.length} match{filteredIcons.length === 1 ? "" : "es"}
        </p>
      )}

      <ScrollArea className="h-[calc(100vh-280px)] min-h-[200px]">
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
          {filteredIcons.map((icon) => (
            <button
              key={icon.id}
              type="button"
              draggable
              title={icon.id}
              onDragStart={(e) => onDragStart(e, icon.id)}
              onDragEnd={onDragEnd}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border border-border bg-background/50 p-2",
                "hover:border-primary/40 hover:bg-muted/50 active:cursor-grabbing",
                "min-h-[52px]",
              )}
            >
              <EraserIcon iconId={icon.id} size={24} />
              <span className="w-full truncate text-center text-[9px] text-muted-foreground">
                {icon.id.replace(/^(aws|gcp|azure|k8s)-/, "").slice(0, 12)}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
