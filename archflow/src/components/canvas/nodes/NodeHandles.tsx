import { Handle } from "reactflow";
import { NODE_HANDLES } from "@/components/canvas/nodes/constants";
import { HANDLE_DESIGN } from "@/lib/canvas/style/nodeDesign";
import { cn } from "@/lib/utils";

interface NodeHandlesProps {
  color: string;
  size: "boxed" | "icon";
  visible: boolean;
}

export function NodeHandles({ color, size, visible }: NodeHandlesProps) {
  const handleClass = HANDLE_DESIGN[size].className;

  return (
    <>
      {NODE_HANDLES.map(({ position, id: handleId, className: posClass }) => (
        <Handle
          key={handleId}
          type="source"
          position={position}
          id={handleId}
          isConnectableStart
          isConnectableEnd
          className={cn(
            handleClass,
            posClass,
            visible ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
          style={{ background: color }}
        />
      ))}
    </>
  );
}
