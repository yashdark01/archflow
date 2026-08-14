"use client";

import type { PaletteGroupConfig } from "@/constants/paletteGroups";
import { PaletteItem } from "@/components/sidebar/PaletteItem";

interface PaletteGroupProps {
  group: PaletteGroupConfig;
}

export function PaletteGroup({ group }: PaletteGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="section-label">{group.label}</h3>
      <div className="space-y-1.5">
        {group.items.map((item) => (
          <PaletteItem
            key={item.type}
            type={item.type}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
