"use client";

import { EraserIcon } from "@/components/icons/EraserIcon";
import type { EraserConnector } from "@/lib/canvas/schema";
import type { EraserLegendItem, LegendShape } from "@/lib/canvas/schema";
import {
  connectorShowsEndArrow,
  connectorShowsStartArrow,
  getConnectorPreviewDasharray,
} from "@/lib/canvas/style/edgeDesign";
import { resolveEraserColor } from "@/lib/eraser/colors";
import { cn } from "@/lib/utils";

function LegendShapePreview({
  shape,
  color,
}: {
  shape: LegendShape;
  color?: string;
}) {
  const fill = resolveEraserColor(color, "#64748b");

  if (shape === "diamond") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
        <polygon points="10,2 18,10 10,18 2,10" fill={fill} />
      </svg>
    );
  }

  if (shape === "oval") {
    return (
      <svg width="24" height="16" viewBox="0 0 24 16" aria-hidden>
        <ellipse cx="12" cy="8" rx="10" ry="6" fill={fill} />
      </svg>
    );
  }

  return (
    <span
      className="size-4 rounded-sm border border-border/60"
      style={{ backgroundColor: fill }}
      aria-hidden
    />
  );
}

function LegendConnectionPreview({
  connector,
  color,
}: {
  connector: EraserConnector;
  color?: string;
}) {
  const stroke = resolveEraserColor(color, "#64748b");
  const dash = getConnectorPreviewDasharray(connector);
  const showEnd = connectorShowsEndArrow(connector);
  const showStart = connectorShowsStartArrow(connector);

  return (
    <svg width="52" height="16" viewBox="0 0 52 16" aria-hidden className="shrink-0">
      <defs>
        <marker
          id="legend-arrow-end"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={stroke} />
        </marker>
        <marker
          id="legend-arrow-start"
          markerWidth="6"
          markerHeight="6"
          refX="1"
          refY="3"
          orient="auto"
        >
          <path d="M6,0 L0,3 L6,6 Z" fill={stroke} />
        </marker>
      </defs>
      <line
        x1="6"
        y1="8"
        x2="46"
        y2="8"
        stroke={stroke}
        strokeWidth="2"
        strokeDasharray={dash}
        strokeLinecap={dash ? "round" : "butt"}
        markerEnd={showEnd ? "url(#legend-arrow-end)" : undefined}
        markerStart={showStart ? "url(#legend-arrow-start)" : undefined}
      />
    </svg>
  );
}

export function LegendItemPreview({ item }: { item: EraserLegendItem }) {
  if (item.connection) {
    return (
      <LegendConnectionPreview connector={item.connection} color={item.color} />
    );
  }

  if (item.icon) {
    return <EraserIcon iconId={item.icon} size={20} className="shrink-0" />;
  }

  if (item.shape) {
    return <LegendShapePreview shape={item.shape} color={item.color} />;
  }

  if (item.color) {
    return (
      <span
        className="size-4 shrink-0 rounded-full border border-border/60"
        style={{ backgroundColor: resolveEraserColor(item.color) }}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={cn("size-4 shrink-0 rounded-sm border border-border/50 bg-muted")}
      aria-hidden
    />
  );
}
