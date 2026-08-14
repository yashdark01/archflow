import { ALL_PALETTE_ITEMS } from "@/constants/paletteGroups";
import type { EraserIconCatalog } from "@/types/eraserIcons";
import type { NodeType } from "@/types/diagram";

export type InsertItemKind = "node" | "icon";

export interface InsertSearchItem {
  kind: InsertItemKind;
  id: string;
  label: string;
  group: string;
  nodeType?: NodeType;
  iconId?: string;
}

const MAX_ICON_RESULTS = 48;
const MAX_NODE_RESULTS = 12;

export function searchInsertItems(
  query: string,
  catalog: EraserIconCatalog | null,
): InsertSearchItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const items: InsertSearchItem[] = [];

  for (const node of ALL_PALETTE_ITEMS) {
    if (
      node.label.toLowerCase().includes(normalized) ||
      node.description.toLowerCase().includes(normalized) ||
      node.type.toLowerCase().includes(normalized)
    ) {
      items.push({
        kind: "node",
        id: `node-${node.type}`,
        label: node.label,
        group: "Nodes",
        nodeType: node.type,
      });
    }
  }

  if (catalog) {
    let iconCount = 0;
    for (const category of catalog.categories) {
      for (const icon of category.icons) {
        if (!icon.id.includes(normalized)) continue;
        if (iconCount >= MAX_ICON_RESULTS) break;
        items.push({
          kind: "icon",
          id: `icon-${icon.id}`,
          label: icon.id.replace(/^(aws|gcp|azure|k8s)-/, ""),
          group: category.label,
          iconId: icon.id,
        });
        iconCount += 1;
      }
      if (iconCount >= MAX_ICON_RESULTS) break;
    }
  }

  return items.slice(0, MAX_ICON_RESULTS + MAX_NODE_RESULTS);
}

export function groupInsertItems(items: InsertSearchItem[]): Map<string, InsertSearchItem[]> {
  const groups = new Map<string, InsertSearchItem[]>();
  for (const item of items) {
    const list = groups.get(item.group) ?? [];
    list.push(item);
    groups.set(item.group, list);
  }
  return groups;
}
