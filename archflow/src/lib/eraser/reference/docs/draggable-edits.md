# Drag-Drop Editing (beta)

> Source: https://docs.eraser.io/draggable-edits-beta

## How to make layout edits on the canvas

1. Click on diagram-as-code. The entire diagram will be selected.
2. Click on a specific node, group, or arrow. The specific element will be selected and a draggable edit banner will appear on the bottom.
3. Move or resize the selected element.

## Resetting diagram layout

Resetting reverts to Eraser's default diagram-as-code layout engine and removes manual canvas edits.

1. **Manual reset:** Click `Reset Layout` in the bottom banner.
2. **Automatic reset:** A significant edit to the code editor resets layout automatically.

## ArchFlow parity notes

| Eraser behavior | ArchFlow implementation |
| --- | --- |
| Select whole diagram from code panel | N/A (canvas-only editor) |
| Select node / group / arrow on canvas | React Flow selection in `CanvasBoard` |
| Move / resize on canvas | Node drag + `NodeResizer` on groups |
| Bottom layout banner | `LayoutEditBanner`, `LayoutContextBanner` |
| Reset layout | `useLayoutControl` + dagre relayout |
| Code edit resets manual layout | `useDiagramStructureKey` triggers relayout on DSL structure change |
