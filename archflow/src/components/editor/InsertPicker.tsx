"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  Code2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { EraserIcon } from "@/components/icons/EraserIcon";
import { DraggablePaletteItem } from "@/components/sidebar/DraggablePaletteItem";
import { NODE_DEFAULTS } from "@/constants/nodeDefaults";
import { useEraserCatalog } from "@/hooks/useEraserCatalog";
import {
  groupInsertItems,
  searchInsertItems,
  type InsertSearchItem,
} from "@/lib/insert/searchInsertItems";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setInsertPickerOpen,
  setInsertPickerView,
  startPlacement,
  type InsertPickerView,
} from "@/store/slices/uiSlice";
import type { NodeType } from "@/types/diagram";
import { cn } from "@/lib/utils";

interface InsertPickerProps {
  focusSearch?: boolean;
  onOpenCode?: () => void;
}

const ROOT_CATEGORIES: {
  id: InsertPickerView | "code";
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "code",
    label: "Diagram as code",
    description: "Create diagrams using code",
    icon: Code2,
  },
  {
    id: "icons",
    label: "Icon",
    description: "250+ icons available",
    icon: Sparkles,
  },
];

export function InsertPicker({ focusSearch, onOpenCode }: InsertPickerProps) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.insertPickerOpen);
  const view = useAppSelector((state) => state.ui.insertPickerView);
  const { catalog, loading } = useEraserCatalog();

  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);
  const [iconCategory, setIconCategory] = useState("aws-icons");
  const searchRef = useRef<HTMLInputElement>(null);

  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? searchInsertItems(query, catalog) : []),
    [catalog, isSearching, query],
  );
  const groupedResults = useMemo(
    () => groupInsertItems(searchResults),
    [searchResults],
  );

  const flatSearchList = useMemo(() => searchResults, [searchResults]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setFocusIndex(0);
      return;
    }
    if (focusSearch) {
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open, focusSearch]);

  const close = useCallback(() => {
    dispatch(setInsertPickerOpen(false));
  }, [dispatch]);

  const selectItem = useCallback(
    (item: InsertSearchItem) => {
      if (item.kind === "icon" && item.iconId) {
        dispatch(startPlacement({ kind: "icon", iconId: item.iconId }));
      } else if (item.kind === "node" && item.nodeType) {
        dispatch(startPlacement({ kind: "node", nodeType: item.nodeType }));
      }
    },
    [dispatch],
  );

  const selectNodeType = useCallback(
    (nodeType: NodeType) => {
      dispatch(startPlacement({ kind: "node", nodeType }));
    },
    [dispatch],
  );

  const selectIconId = useCallback(
    (iconId: string) => {
      dispatch(startPlacement({ kind: "icon", iconId }));
    },
    [dispatch],
  );

  const handleCategoryClick = (id: InsertPickerView | "code") => {
    if (id === "code") {
      close();
      onOpenCode?.();
      return;
    }
    dispatch(setInsertPickerView(id));
    setFocusIndex(0);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (!isSearching || flatSearchList.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusIndex((i) => Math.min(i + 1, flatSearchList.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = flatSearchList[focusIndex];
      if (item) selectItem(item);
    }
  };

  if (!open) return null;

  const focusedId =
    isSearching && flatSearchList[focusIndex]
      ? flatSearchList[focusIndex].kind === "icon"
        ? flatSearchList[focusIndex].iconId
        : flatSearchList[focusIndex].nodeType
      : null;

  const breadcrumb =
    isSearching
      ? "All Categories / Search"
      : view === "icons"
        ? "All Categories / Icon"
        : view === "nodes"
          ? "All Categories / Nodes"
          : "All Categories";

  const iconPool =
    view === "icons" && catalog && !isSearching
      ? (catalog.categories.find((c) => c.id === iconCategory)?.icons ?? [])
      : [];

  return (
    <div
      className="insert-picker panel-chrome absolute left-[52px] top-4 z-30 flex w-[min(360px,calc(100vw-5rem))] flex-col overflow-hidden rounded-xl shadow-2xl"
      role="dialog"
      aria-label="Insert item"
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusIndex(0);
          }}
          onKeyDown={handleSearchKeyDown}
          placeholder="Insert item"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search insert items"
        />
        <button
          type="button"
          onClick={close}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close insert panel"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="px-3 py-1.5 text-[11px] text-muted-foreground">{breadcrumb}</p>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 max-h-[min(420px,55vh)]">
        {isSearching ? (
          <div className="space-y-3">
            {flatSearchList.length === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">No matches.</p>
            ) : (
              Array.from(groupedResults.entries()).map(([group, items]) => (
                <div key={group}>
                  <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {group}
                  </p>
                  <div className="grid grid-cols-4 gap-1 sm:grid-cols-5">
                    {items.map((item) => {
                      const globalIdx = flatSearchList.indexOf(item);
                      const isFocused = globalIdx === focusIndex;
                      return (
                        <DraggablePaletteItem
                          key={item.id}
                          iconId={item.kind === "icon" ? item.iconId : undefined}
                          nodeType={item.kind === "node" ? item.nodeType : undefined}
                          onClick={() => selectItem(item)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors",
                            isFocused
                              ? "border-primary/60 bg-primary/15"
                              : "border-transparent hover:border-white/15 hover:bg-white/5",
                          )}
                        >
                          {item.kind === "icon" && item.iconId ? (
                            <EraserIcon iconId={item.iconId} size={24} />
                          ) : (
                            <span
                              className="size-6 rounded-md ring-1 ring-white/20"
                              style={{
                                backgroundColor:
                                  NODE_DEFAULTS[item.nodeType ?? "service"].color,
                              }}
                            />
                          )}
                          <span className="w-full truncate text-center text-[9px] text-muted-foreground">
                            {item.label}
                          </span>
                        </DraggablePaletteItem>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : view === "root" ? (
          <div className="space-y-1">
            {ROOT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-white/5"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/5">
                    <Icon className="size-4 text-muted-foreground" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{cat.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {cat.description}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              );
            })}

            <p className="mt-3 px-1 text-xs text-muted-foreground">
              Double-click the canvas to add a text label, or search above for icons.
            </p>
          </div>
        ) : view === "icons" ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => dispatch(setInsertPickerView("root"))}
              className="text-xs text-primary hover:underline"
            >
              ← Back
            </button>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading icons…</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-1">
                  {catalog?.categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setIconCategory(cat.id)}
                      className={cn(
                        "rounded-md px-2 py-1 text-[10px] font-medium",
                        iconCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/10 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
                  {iconPool.slice(0, 40).map((icon) => (
                    <DraggablePaletteItem
                      key={icon.id}
                      iconId={icon.id}
                      onClick={() => selectIconId(icon.id)}
                      title={icon.id}
                      className="flex flex-col items-center gap-1 rounded-lg border border-transparent p-2 hover:border-white/15 hover:bg-white/5"
                    >
                      <EraserIcon iconId={icon.id} size={24} />
                      <span className="w-full truncate text-center text-[9px] text-muted-foreground">
                        {icon.id.replace(/^(aws|gcp|azure|k8s)-/, "").slice(0, 10)}
                      </span>
                    </DraggablePaletteItem>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-[10px] text-muted-foreground">
        <span className="truncate font-mono">{focusedId ?? "—"}</span>
        <span className="shrink-0">
          {isSearching ? "↑↓ navigate · enter to place · drag to canvas" : "Click or drag onto canvas"}
        </span>
      </div>
    </div>
  );
}
