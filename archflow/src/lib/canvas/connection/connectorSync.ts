import type { EraserConnector } from "@/lib/canvas/schema";
import type { ArrowDirection, EdgeData, EdgeStrokeStyle } from "@/types/diagram";
import {
  connectorFromEdgeData,
  edgeDataFromConnector,
} from "@/lib/canvas/style/edgeDesign";

/** Merge edge data patch with consistent connector / arrow / stroke fields. */
export function normalizeEdgeDataPatch(
  patch: Partial<EdgeData>,
  current: EdgeData,
): Partial<EdgeData> {
  const merged = { ...current, ...patch };

  if (patch.connector !== undefined) {
    const fromConnector = edgeDataFromConnector(patch.connector);
    return {
      ...patch,
      arrowDirection: fromConnector.arrowDirection,
      strokeStyle: fromConnector.strokeStyle,
      connector: fromConnector.connector,
    };
  }

  if (
    patch.arrowDirection !== undefined ||
    patch.strokeStyle !== undefined
  ) {
    const arrow = (patch.arrowDirection ?? merged.arrowDirection) as ArrowDirection;
    const stroke = (patch.strokeStyle ?? merged.strokeStyle) as
      | EdgeStrokeStyle
      | undefined;
    // Dashed is canvas-only; Eraser connectors only distinguish solid vs dotted.
    const strokeForConnector =
      stroke === "dashed" ? "solid" : (stroke ?? "solid");
    const connector = connectorFromEdgeData(arrow, strokeForConnector);
    const fromConnector = edgeDataFromConnector(connector);
    const strokeStyle =
      stroke === "dashed" ? "dashed" : fromConnector.strokeStyle;

    return {
      ...patch,
      arrowDirection: fromConnector.arrowDirection,
      strokeStyle,
      connector,
    };
  }

  if (!merged.connector) {
    const connector = connectorFromEdgeData(
      merged.arrowDirection,
      merged.strokeStyle,
    );
    return { ...patch, connector };
  }

  return patch;
}

export function createEdgeDataFromConnector(
  connector: EraserConnector,
  base?: Partial<EdgeData>,
): EdgeData {
  const attrs = edgeDataFromConnector(connector);
  return {
    label: base?.label ?? "",
    color: base?.color ?? "#64748b",
    arrowDirection: attrs.arrowDirection,
    strokeStyle: attrs.strokeStyle,
    connector: attrs.connector,
    ...(base?.strokeWidth != null ? { strokeWidth: base.strokeWidth } : {}),
  };
}
