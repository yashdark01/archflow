import type { NodeType } from "@/types/diagram";

export interface PaletteDragSession {
  nodeType?: NodeType;
  iconId?: string;
}

let session: PaletteDragSession | null = null;

export function startPaletteDrag(data: PaletteDragSession): void {
  session = data;
}

export function getPaletteDragSession(): PaletteDragSession | null {
  return session;
}

export function clearPaletteDragSession(): void {
  session = null;
}

export function isPaletteDragActive(): boolean {
  return session !== null;
}
