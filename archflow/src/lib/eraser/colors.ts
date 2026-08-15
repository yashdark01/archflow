/** Map Eraser color names to hex for canvas rendering. */
export const ERASER_COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
  gray: "#64748b",
  grey: "#64748b",
  slate: "#475569",
  black: "#0a0a0b",
  white: "#fafafa",
};

export function resolveEraserColor(value: string | undefined, fallback = "#64748b"): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return ERASER_COLOR_MAP[trimmed.toLowerCase()] ?? fallback;
}
