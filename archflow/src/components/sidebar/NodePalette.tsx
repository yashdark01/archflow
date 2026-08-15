"use client";

import { PALETTE_GROUPS } from "@/constants/paletteGroups";
import { PaletteGroup } from "@/components/sidebar/PaletteGroup";
import { SearchPalette } from "@/components/sidebar/SearchPalette";

export function NodePalette() {
  return (
    <div className="flex flex-col gap-4 p-3">
      <SearchPalette />
      {PALETTE_GROUPS.map((group) => (
        <PaletteGroup key={group.id} group={group} />
      ))}
    </div>
  );
}
