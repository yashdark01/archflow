# Eraser canvas reference

Reference material scraped from Eraser documentation for building an **as-is** architecture canvas (node design, DSL schema, styling, layout edits). Use this directory when implementing or extending the ArchFlow editor canvas.

## Source documentation

| Topic | Eraser docs | Local copy |
| --- | --- | --- |
| Diagram-as-code overview | https://docs.eraser.io/diagram-as-code | [docs/diagram-as-code.md](./docs/diagram-as-code.md) |
| Architecture DSL syntax | https://docs.eraser.io/architecture-diagram-syntax | [docs/architecture-diagram-syntax.md](./docs/architecture-diagram-syntax.md) |
| Architecture examples | https://docs.eraser.io/architecture-diagram-examples | [docs/architecture-diagram-examples.md](./docs/architecture-diagram-examples.md) |
| Styling | https://docs.eraser.io/styling | [docs/styling.md](./docs/styling.md) |
| Drag-drop layout edits | https://docs.eraser.io/draggable-edits-beta | [docs/draggable-edits.md](./docs/draggable-edits.md) |
| Icons | https://docs.eraser.io/icons | `public/icons/eraser-catalog.json` |

## Implementation modules

| File | Purpose |
| --- | --- |
| [schema.ts](./schema.ts) | Eraser DSL types: nodes, groups, connections, diagram-level statements |
| [nodeDesign.ts](./nodeDesign.ts) | Canvas node visual spec (sizes, classes, handle behavior) |
| [styleTokens.ts](./styleTokens.ts) | `colorMode`, `styleMode`, `typeface`, colors, connectors |
| [canvasMapping.ts](./canvasMapping.ts) | Eraser concepts → ArchFlow `DiagramNode` / `DiagramEdge` |
| [index.ts](./index.ts) | Re-exports |

## Example DSL files

Runnable `.eraser` samples from the official examples page:

- [examples/aws-diagram.eraser](./examples/aws-diagram.eraser)
- [examples/gcp-diagram.eraser](./examples/gcp-diagram.eraser)
- [examples/azure-diagram.eraser](./examples/azure-diagram.eraser)
- [examples/k8s-diagram.eraser](./examples/k8s-diagram.eraser)
- [examples/etl-pipeline.eraser](./examples/etl-pipeline.eraser)

## ArchFlow implementation map

| Eraser concept | ArchFlow location |
| --- | --- |
| Node / group rendering | `src/components/nodes/BaseNode.tsx` |
| Canvas surface + theme | `src/components/canvas/CanvasBoard.tsx`, `src/app/globals.css` |
| DSL parse | `src/lib/eraser/parse.ts` |
| DSL serialize | `src/lib/eraser/serialize.ts` |
| Connections | `src/lib/eraser/connectionDsl.ts` |
| Auto layout | `src/lib/layout/diagramLayout.ts` |
| Icon CDN | `src/constants/eraserIcons.ts` |
| Color resolution | `src/lib/eraser/colors.ts` |
| Layout edit banner | `src/components/editor/LayoutEditBanner.tsx` |

## Gaps vs Eraser (canvas-from-scratch checklist)

- [x] Diagram-level `colorMode`, `styleMode`, `typeface` on canvas (parsed; layout Phase 2 complete)
- [x] Node/group `colorMode`, `styleMode`, `typeface`, `link` properties (Phase 3)
- [x] Legend blocks (Phase 5 — `CanvasLegend`, `DiagramProperties`)
- [x] Dotted connectors (`--`, `-->`) distinct from dashed (Phase 4 — `edgeDesign.ts`, `connectorSync.ts`)
- [x] Full Eraser shadow / watercolor / outline fill modes on nodes (Phase 3)

## Phase 6 polish

- [x] Legend drag reposition (session layout override `__legend`)
- [x] Legend connection + shape color in properties panel
- [x] Diagram title synced with `document.title` and Eraser DSL

## Optional follow-ups

- Persist legend manual position in stored diagrams / API
- Legend item reorder in properties UI
- Update implementation map paths (`src/components/canvas/nodes/`, `src/lib/canvas/`)
