/** Eraser-compatible icon CDN — https://docs.eraser.io/icons */
export const ERASER_ICON_CDN =
  "https://storage.googleapis.com/eraser-public-assets/canvas-icons";

export const ERASER_CATALOG_PATH = "/icons/eraser-catalog.json";

/** Decode HTML entities sometimes scraped into catalog ids (e.g. `&#38;` → `&`). */
export function normalizeEraserIconId(iconId: string): string {
  return iconId
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    )
    .replace(/&amp;/g, "&");
}

export function getEraserIconUrl(iconId: string): string {
  const normalized = normalizeEraserIconId(iconId);
  return `${ERASER_ICON_CDN}/${encodeURIComponent(normalized)}.svg`;
}

/** Default Eraser icon slugs per ArchFlow node type (Eraser diagram-as-code names). */
export const NODE_TYPE_ERASER_ICONS: Record<string, string> = {
  service: "aws-ec2",
  database: "aws-rds",
  cache: "redis",
  queue: "aws-simple-queue-service",
  apiGateway: "aws-api-gateway",
  loadBalancer: "aws-elastic-load-balancing",
  user: "user",
  group: "box",
  cloud: "aws",
};

export function humanizeIconId(iconId: string): string {
  return iconId
    .replace(/^(aws|gcp|azure|k8s)-/, "")
    .split("-")
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
