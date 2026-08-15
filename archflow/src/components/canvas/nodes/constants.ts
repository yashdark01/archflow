import { Position } from "reactflow";

export const NODE_HANDLES: {
  position: Position;
  id: string;
  className: string;
}[] = [
  { position: Position.Top, id: "top", className: "!top-0 !-translate-y-1/2" },
  { position: Position.Right, id: "right", className: "!right-0 !translate-x-1/2" },
  { position: Position.Bottom, id: "bottom", className: "!bottom-0 !translate-y-1/2" },
  { position: Position.Left, id: "left", className: "!left-0 !-translate-x-1/2" },
];
