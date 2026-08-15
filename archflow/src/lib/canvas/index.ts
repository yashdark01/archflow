export * from "@/lib/canvas/schema";
export { parseDocument } from "@/lib/canvas/document/parseDocument";
export { serializeDocument } from "@/lib/canvas/document/serializeDocument";
export {
  validateDocument,
  structuralEqual,
  formatDocumentValidationSummary,
} from "@/lib/canvas/document/validateDocument";
export { documentToDiagram } from "@/lib/canvas/document/toDiagram";
export { diagramToDocument } from "@/lib/canvas/document/fromDiagram";
export * from "@/lib/canvas/layout";
export * from "@/lib/canvas/style";
export { parseConnectionLine } from "@/lib/canvas/connection/parseConnections";

import type { ArchFlowCanvasDocument } from "@/lib/canvas/schema";
import { parseDocument } from "@/lib/canvas/document/parseDocument";

export function createCanvasDocumentFromDsl(source: string): ArchFlowCanvasDocument {
  return {
    document: parseDocument(source),
    layoutOverrides: {},
  };
}
