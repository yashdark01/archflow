/**
 * Eraser styling tokens for canvas rendering.
 * Source: https://docs.eraser.io/styling
 */

import type {
  EraserColorMode,
  EraserDiagramStyle,
  EraserStyleMode,
  EraserTypeface,
} from "@/lib/canvas/schema";
import type { NodeData } from "@/types/diagram";

export const COLOR_MODE_FILL: Record<
  EraserColorMode,
  { fillOpacity: number; description: string }
> = {
  pastel: { fillOpacity: 0.12, description: "Lighter fill (Eraser default)" },
  bold: { fillOpacity: 0.28, description: "Darker fill" },
  outline: { fillOpacity: 0, description: "Transparent fill, stroke only" },
};

export const STYLE_MODE_EFFECTS: Record<
  EraserStyleMode,
  { boxShadow: string; filter?: string; description: string }
> = {
  shadow: {
    boxShadow: "0 2px 8px rgb(0 0 0 / 0.18)",
    description: "Drop shadow behind nodes (Eraser default)",
  },
  plain: {
    boxShadow: "none",
    description: "No shadow or watercolor",
  },
  watercolor: {
    boxShadow: "0 2px 12px rgb(0 0 0 / 0.12)",
    filter: "url(#archflow-watercolor)",
    description: "Soft watercolor edge",
  },
};

export const TYPEFACE_CSS: Record<
  EraserTypeface,
  { fontFamily: string; description: string }
> = {
  rough: {
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    description: "Handwriting-style (Eraser rough)",
  },
  clean: {
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    description: "Clean sans serif",
  },
  mono: {
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
    description: "Monospaced labels",
  },
};

export interface ResolvedNodeStyle {
  color: string;
  backgroundColor: string;
  boxShadow: string;
  fontFamily: string;
  borderColor: string;
  filter?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim();
  if (!normalized.startsWith("#") || normalized.length < 7) return null;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

export function resolveCanvasNodeStyle(input: {
  colorHex: string;
  colorMode?: EraserColorMode;
  styleMode?: EraserStyleMode;
  typeface?: EraserTypeface;
  diagramDefaults?: Pick<EraserDiagramStyle, "colorMode" | "styleMode" | "typeface">;
}): ResolvedNodeStyle {
  const colorMode =
    input.colorMode ?? input.diagramDefaults?.colorMode ?? "pastel";
  const styleMode =
    input.styleMode ?? input.diagramDefaults?.styleMode ?? "shadow";
  const typeface =
    input.typeface ?? input.diagramDefaults?.typeface ?? "rough";

  const fill = COLOR_MODE_FILL[colorMode];
  const effects = STYLE_MODE_EFFECTS[styleMode];
  const typefaceCss = TYPEFACE_CSS[typeface];

  const rgb = hexToRgb(input.colorHex);
  const backgroundColor =
    !rgb || fill.fillOpacity === 0
      ? "transparent"
      : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fill.fillOpacity})`;

  return {
    color: input.colorHex,
    backgroundColor,
    boxShadow: effects.boxShadow,
    fontFamily: typefaceCss.fontFamily,
    borderColor: input.colorHex,
    ...(effects.filter ? { filter: effects.filter } : {}),
  };
}

export function resolveNodeDataStyle(
  data: NodeData,
  diagramStyle: EraserDiagramStyle,
): ResolvedNodeStyle {
  return resolveCanvasNodeStyle({
    colorHex: data.color,
    colorMode: data.colorMode,
    styleMode: data.styleMode,
    typeface: data.typeface,
    diagramDefaults: diagramStyle,
  });
}
