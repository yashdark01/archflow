import {
  getBezierPath,
  getSmoothStepPath,
  type Position,
} from "reactflow";
import type { EdgeType } from "@/types/diagram";

export interface PathParams {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}

/** Default orthogonal corner when no custom bend is set. */
export function getDefaultBendPoint(params: PathParams): { x: number; y: number } {
  const { sourceX, sourceY, targetX, targetY } = params;
  const dx = Math.abs(targetX - sourceX);
  const dy = Math.abs(targetY - sourceY);

  if (dx >= dy) {
    return { x: targetX, y: sourceY };
  }
  return { x: sourceX, y: targetY };
}

function labelAtBend(
  sx: number,
  sy: number,
  bx: number,
  by: number,
  tx: number,
  ty: number,
): [number, number] {
  const d1 = Math.hypot(bx - sx, by - sy);
  const d2 = Math.hypot(tx - bx, ty - by);
  const t = d1 / (d1 + d2 || 1);
  return [
    sx + (bx - sx) * t + (tx - bx) * t * 0.5,
    sy + (by - sy) * t + (ty - by) * t * 0.5,
  ];
}

function orthogonalPath(
  sx: number,
  sy: number,
  bx: number,
  by: number,
  tx: number,
  ty: number,
  radius: number,
): string {
  if (radius <= 0) {
    return `M ${sx},${sy} L ${bx},${by} L ${tx},${ty}`;
  }

  const r = Math.min(
    radius,
    Math.hypot(bx - sx, by - sy) / 2,
    Math.hypot(tx - bx, ty - by) / 2,
  );

  if (r < 1) {
    return `M ${sx},${sy} L ${bx},${by} L ${tx},${ty}`;
  }

  const in1x = bx - Math.sign(bx - sx) * r;
  const in1y = by - Math.sign(by - sy) * r;
  const out1x = bx + Math.sign(tx - bx) * r;
  const out1y = by + Math.sign(ty - by) * r;

  return [
    `M ${sx},${sy}`,
    `L ${in1x},${in1y}`,
    `Q ${bx},${by} ${out1x},${out1y}`,
    `L ${tx},${ty}`,
  ].join(" ");
}

export function getEdgePathForType(
  edgeType: EdgeType,
  params: PathParams,
  bendPoint?: { x: number; y: number },
): [string, number, number] {
  const { sourceX, sourceY, targetX, targetY } = params;

  if (bendPoint) {
    const { x: bx, y: by } = bendPoint;
    const radius = edgeType === "smoothstep" ? 12 : 0;

    if (edgeType === "default") {
      const path = `M ${sourceX},${sourceY} Q ${bx},${by} ${targetX},${targetY}`;
      return [path, bx, by];
    }

    const path = orthogonalPath(sourceX, sourceY, bx, by, targetX, targetY, radius);
    const [labelX, labelY] = labelAtBend(sourceX, sourceY, bx, by, targetX, targetY);
    return [path, labelX, labelY];
  }

  if (edgeType === "straight") {
    return [
      `M ${sourceX},${sourceY} L ${targetX},${targetY}`,
      (sourceX + targetX) / 2,
      (sourceY + targetY) / 2,
    ];
  }

  if (edgeType === "step") {
    const [path, labelX, labelY] = getSmoothStepPath({ ...params, borderRadius: 0 });
    return [path, labelX, labelY];
  }

  if (edgeType === "smoothstep") {
    const [path, labelX, labelY] = getSmoothStepPath({ ...params, borderRadius: 12 });
    return [path, labelX, labelY];
  }

  const [path, labelX, labelY] = getBezierPath(params);
  return [path, labelX, labelY];
}
