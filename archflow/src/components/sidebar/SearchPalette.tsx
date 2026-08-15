"use client";

import { useMemo, useState } from "react";
import { ALL_PALETTE_ITEMS } from "@/constants/paletteGroups";
import { Input } from "@/components/ui/input";
import { PaletteItem } from "@/components/sidebar/PaletteItem";

export function SearchPalette() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return ALL_PALETTE_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search nodes…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search palette"
        className="bg-background"
      />
      {query.trim() ? (
        <div className="space-y-1.5">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No nodes match your search.</p>
          ) : (
            results.map((item) => (
              <PaletteItem
                key={item.type}
                type={item.type}
                label={item.label}
                description={item.description}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
