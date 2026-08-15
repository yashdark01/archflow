/**
 * Verify Eraser icon IDs against the public CDN (https://docs.eraser.io/icons).
 *
 * Usage:
 *   node scripts/verify-eraser-icons.mjs          # report only
 *   node scripts/verify-eraser-icons.mjs --fix      # rewrite catalog (remove 404s, fix ids)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "public/icons/eraser-catalog.json");
const ERASER_ICONS_TS = path.join(ROOT, "src/constants/eraserIcons.ts");
const DEFAULT_CODE_TS = path.join(ROOT, "src/lib/eraser/defaultCode.ts");

const CDN = "https://storage.googleapis.com/eraser-public-assets/canvas-icons";
const CONCURRENCY = 12;
const FIX = process.argv.includes("--fix");

function decodeHtmlEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function getEraserIconUrl(iconId) {
  return `${CDN}/${encodeURIComponent(iconId)}.svg`;
}

async function headStatus(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(15000),
      });
      return res.status;
    } catch {
      if (attempt === 2) return 0;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return 0;
}

function extractIconIdsFromSource(source, pattern) {
  const ids = new Set();
  for (const match of source.matchAll(pattern)) {
    ids.add(match[1]);
  }
  return [...ids];
}

async function verifyIconIds(ids) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < ids.length) {
      const iconId = ids[index++];
      const url = getEraserIconUrl(iconId);
      const status = await headStatus(url);
      results.push({ iconId, status, ok: status === 200 });
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return results;
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const catalogIds = new Set();
  const brokenCatalog = [];

  for (const category of catalog.categories) {
    const seenInCategory = new Set();
    const kept = [];

    for (const icon of category.icons) {
      const decodedId = decodeHtmlEntities(icon.id);
      const normalized = {
        id: decodedId,
        url: getEraserIconUrl(decodedId),
      };

      if (seenInCategory.has(normalized.id)) continue;
      seenInCategory.add(normalized.id);

      const status = await headStatus(normalized.url);
      if (status === 200) {
        kept.push(normalized);
        catalogIds.add(normalized.id);
      } else {
        brokenCatalog.push({
          id: normalized.id,
          category: category.id,
          status,
        });
      }
    }

    if (FIX) category.icons = kept;
  }

  const nodeTypeIds = extractIconIdsFromSource(
    fs.readFileSync(ERASER_ICONS_TS, "utf8"),
    /:\s*"([^"]+)"/g,
  );
  const defaultCodeIds = extractIconIdsFromSource(
    fs.readFileSync(DEFAULT_CODE_TS, "utf8"),
    /\[icon:\s*([^\]]+)\]/g,
  );

  const hardcodedIds = [...new Set([...nodeTypeIds, ...defaultCodeIds])];
  const hardcodedResults = await verifyIconIds(hardcodedIds);
  const brokenHardcoded = hardcodedResults.filter((r) => !r.ok);

  const missingFromCatalog = hardcodedIds.filter((id) => !catalogIds.has(id));

  console.log("Eraser icon verification (https://docs.eraser.io/icons)");
  console.log(`Catalog: ${catalogIds.size} valid icons`);
  if (brokenCatalog.length) {
    console.log(`Broken catalog entries: ${brokenCatalog.length}`);
    for (const entry of brokenCatalog) {
      console.log(`  - ${entry.id} (${entry.category}) HTTP ${entry.status}`);
    }
  } else {
    console.log("All catalog entries resolve on CDN");
  }

  if (brokenHardcoded.length) {
    console.log(`Broken hardcoded icon IDs: ${brokenHardcoded.length}`);
    for (const entry of brokenHardcoded) {
      console.log(`  - ${entry.iconId} HTTP ${entry.status}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`All ${hardcodedIds.length} hardcoded icon IDs valid on CDN`);
  }

  if (missingFromCatalog.length) {
    console.log(`Hardcoded IDs missing from catalog: ${missingFromCatalog.join(", ")}`);
  }

  if (FIX) {
    catalog.verifiedAt = new Date().toISOString();
    catalog.iconCount = catalog.categories.reduce(
      (n, c) => n + c.icons.length,
      0,
    );
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog));
    console.log(`Updated ${CATALOG_PATH} (${catalog.iconCount} icons)`);
  } else if (brokenCatalog.length) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
