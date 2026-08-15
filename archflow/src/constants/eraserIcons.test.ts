import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ERASER_ICON_CDN,
  getEraserIconUrl,
  NODE_TYPE_ERASER_ICONS,
  normalizeEraserIconId,
} from "./eraserIcons";
import type { EraserIconCatalog } from "@/types/eraserIcons";

const catalogPath = path.join(
  process.cwd(),
  "public/icons/eraser-catalog.json",
);
const catalog = JSON.parse(
  readFileSync(catalogPath, "utf8"),
) as EraserIconCatalog;

const catalogIds = new Set(
  catalog.categories.flatMap((category) => category.icons.map((icon) => icon.id)),
);

describe("eraser icon catalog", () => {
  it("lists only unique icon ids", () => {
    const ids = catalog.categories.flatMap((c) => c.icons.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("matches CDN url pattern for every entry", () => {
    for (const category of catalog.categories) {
      for (const icon of category.icons) {
        expect(icon.url).toBe(getEraserIconUrl(icon.id));
      }
    }
  });
});

describe("NODE_TYPE_ERASER_ICONS", () => {
  it("uses ids present in the local catalog", () => {
    for (const iconId of Object.values(NODE_TYPE_ERASER_ICONS)) {
      expect(catalogIds.has(iconId)).toBe(true);
    }
  });

  it("builds encoded CDN urls for special characters", () => {
    const id = "aws-elemental-appliances-&-software";
    expect(getEraserIconUrl(id)).toBe(
      `${ERASER_ICON_CDN}/aws-elemental-appliances-%26-software.svg`,
    );
    expect(normalizeEraserIconId("aws-elemental-appliances-&#38;-software")).toBe(
      id,
    );
  });
});
