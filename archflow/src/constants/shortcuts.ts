export interface ShortcutConfig {
  keys: string;
  label: string;
  action: string;
}

export const KEYBOARD_SHORTCUTS: ShortcutConfig[] = [
  { keys: "Ctrl+Z", label: "Undo", action: "undo" },
  { keys: "Ctrl+Shift+Z", label: "Redo", action: "redo" },
  { keys: "Ctrl+A", label: "Select all", action: "selectAll" },
  { keys: "Delete", label: "Delete selected", action: "delete" },
  { keys: "Escape", label: "Deselect all", action: "deselect" },
  { keys: "Ctrl+C", label: "Copy", action: "copy" },
  { keys: "Ctrl+V", label: "Paste", action: "paste" },
  { keys: "Ctrl+D", label: "Duplicate", action: "duplicate" },
  { keys: "Ctrl+E", label: "Export PNG", action: "export" },
  { keys: "Ctrl+0", label: "Fit view", action: "fitView" },
  { keys: "Ctrl+/", label: "Toggle view mode", action: "toggleView" },
];

export function isModKey(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey;
}
