/**
 * Eraser architecture diagram DSL schema.
 * Source: https://docs.eraser.io/architecture-diagram-syntax
 */

export const ERASER_DOC_URLS = {
  diagramAsCode: "https://docs.eraser.io/diagram-as-code",
  syntax: "https://docs.eraser.io/architecture-diagram-syntax",
  examples: "https://docs.eraser.io/architecture-diagram-examples",
  styling: "https://docs.eraser.io/styling",
  draggableEdits: "https://docs.eraser.io/draggable-edits-beta",
  icons: "https://docs.eraser.io/icons",
} as const;

export type EraserDirection = "right" | "left" | "up" | "down";

export type EraserColorMode = "pastel" | "bold" | "outline";
export type EraserStyleMode = "shadow" | "plain" | "watercolor";
export type EraserTypeface = "rough" | "clean" | "mono";

export type EraserConnector = ">" | "<" | "<>" | "-" | "--" | "-->";

export type LegendPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right";

export type LegendShape = "rectangle" | "diamond" | "oval" | string;

export interface EraserElementProperties {
  icon?: string;
  color?: string;
  label?: string;
  link?: string;
  colorMode?: EraserColorMode;
  styleMode?: EraserStyleMode;
  typeface?: EraserTypeface;
}

export interface EraserElement {
  name: string;
  properties: EraserElementProperties;
  isGroup: boolean;
  children: EraserElement[];
}

export interface EraserConnection {
  source: string;
  target: string;
  label?: string;
  color?: string;
  connector: EraserConnector;
}

export interface EraserLegendItem {
  label: string;
  connection?: EraserConnector;
  color?: string;
  icon?: string;
  shape?: LegendShape;
}

export interface EraserLegend {
  position?: LegendPosition;
  items: EraserLegendItem[];
}

export interface EraserDiagramStyle {
  direction: EraserDirection;
  colorMode: EraserColorMode;
  styleMode: EraserStyleMode;
  typeface: EraserTypeface;
}

export const ERASER_DIAGRAM_STYLE_DEFAULTS: EraserDiagramStyle = {
  direction: "right",
  colorMode: "pastel",
  styleMode: "shadow",
  typeface: "rough",
};

export interface EraserArchitectureDocument {
  title?: string;
  style: EraserDiagramStyle;
  elements: EraserElement[];
  connections: EraserConnection[];
  legend?: EraserLegend;
}

export interface LayoutOverride {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

/** ArchFlow canonical canvas document (Phase 0 source of truth). */
export interface ArchFlowCanvasDocument {
  document: EraserArchitectureDocument;
  layoutOverrides: Record<string, LayoutOverride>;
}

export const ERASER_ELEMENT_PROPERTY_KEYS = [
  "icon",
  "color",
  "label",
  "link",
  "colorMode",
  "styleMode",
  "typeface",
] as const;

export const ERASER_DIAGRAM_STATEMENT_PREFIXES = [
  "direction",
  "colorMode",
  "styleMode",
  "typeface",
  "legend",
] as const;

export const CONNECTOR_TO_ARROW: Record<
  EraserConnector,
  "forward" | "backward" | "bidirectional" | "none"
> = {
  ">": "forward",
  "<": "backward",
  "<>": "bidirectional",
  "-": "none",
  "--": "none",
  "-->": "forward",
};

export const CONNECTOR_TO_STROKE: Record<
  EraserConnector,
  "solid" | "dashed" | "dotted"
> = {
  ">": "solid",
  "<": "solid",
  "<>": "solid",
  "-": "solid",
  "--": "dotted",
  "-->": "dotted",
};

export const ARROW_TO_CONNECTOR: Record<
  "forward" | "backward" | "bidirectional" | "none",
  EraserConnector
> = {
  forward: ">",
  backward: "<",
  bidirectional: "<>",
  none: "-",
};

export function createEmptyDocument(): EraserArchitectureDocument {
  return {
    style: { ...ERASER_DIAGRAM_STYLE_DEFAULTS },
    elements: [],
    connections: [],
  };
}

export function createEmptyCanvasDocument(): ArchFlowCanvasDocument {
  return {
    document: createEmptyDocument(),
    layoutOverrides: {},
  };
}
