"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseConnectionLine,
  serializeConnectionLine,
} from "@/lib/eraser/connectionDsl";
import { resolveEraserColor } from "@/lib/eraser/colors";
import { getNodeEraserName } from "@/lib/eraser/eraserNames";
import { DEFAULT_EDGE_COLOR, DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateEdgeConnection,
  updateEdgeData,
  updateEdgeType,
} from "@/store/slices/diagramSlice";
import type { EdgeType } from "@/types/diagram";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConnectionDslEditorProps {
  edgeId: string;
}

function findNodeByDslName(
  nodes: import("@/types/diagram").DiagramNode[],
  name: string,
): import("@/types/diagram").DiagramNode | undefined {
  return nodes.find(
    (node) =>
      getNodeEraserName(node) === name ||
      node.data.label === name ||
      node.data.eraserName === name,
  );
}

export function ConnectionDslEditor({ edgeId }: ConnectionDslEditorProps) {
  const dispatch = useAppDispatch();
  const edge = useAppSelector((state) =>
    state.diagram.edges.find((item) => item.id === edgeId),
  );
  const nodes = useAppSelector((state) => state.diagram.nodes);

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const serialized = useCallback(() => {
    if (!edge) return "";
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return "";
    return serializeConnectionLine(
      edge,
      getNodeEraserName(sourceNode),
      getNodeEraserName(targetNode),
    );
  }, [edge, nodes]);

  useEffect(() => {
    setValue(serialized());
    setError(null);
  }, [serialized]);

  if (!edge) return null;

  const apply = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Connection line cannot be empty.");
      return;
    }

    const parsed = parseConnectionLine(trimmed);
    if (parsed.length === 0) {
      setError("Could not parse connection line. Use formats like A > B or A <> B: label");
      return;
    }

    if (parsed.length > 1) {
      setError("Only single connections can be edited here (not chains).");
      return;
    }

    const conn = parsed[0];
    const sourceNode = findNodeByDslName(nodes, conn.source);
    const targetNode = findNodeByDslName(nodes, conn.target);

    if (!sourceNode || !targetNode) {
      setError(
        `Could not find nodes "${conn.source}" and "${conn.target}" on canvas.`,
      );
      return;
    }

    const color = conn.color
      ? resolveEraserColor(conn.color, edge.data?.color ?? DEFAULT_EDGE_COLOR)
      : edge.data?.color ?? DEFAULT_EDGE_COLOR;

    if (sourceNode.id !== edge.source || targetNode.id !== edge.target) {
      dispatch(
        updateEdgeConnection({
          id: edgeId,
          source: sourceNode.id,
          target: targetNode.id,
        }),
      );
    }

    dispatch(
      updateEdgeData({
        id: edgeId,
        data: {
          label: conn.label ?? "",
          color,
          arrowDirection: conn.arrowDirection,
          strokeStyle: conn.strokeStyle,
          connector: conn.connector,
        },
      }),
    );

  // Infer path style from line shape when applying
    let inferredType: EdgeType = (edge.type ?? DEFAULT_EDGE_TYPE) as EdgeType;
    if (trimmed.includes("<>")) inferredType = "step";
    else if (trimmed.includes("-") && !trimmed.includes(">")) inferredType = "straight";
    else if (trimmed.includes("<")) inferredType = "step";
    else if (trimmed.includes(">")) inferredType = "step";

    if (inferredType !== edge.type) {
      dispatch(updateEdgeType({ id: edgeId, type: inferredType }));
    }

    setError(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="connection-dsl">Eraser connection line</Label>
      <Textarea
        id="connection-dsl"
        rows={3}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="font-mono text-xs"
        placeholder="API > Service: request"
      />
      <p className="text-xs text-muted-foreground">
        Examples: <code className="text-foreground">A &gt; B</code>,{" "}
        <code className="text-foreground">A &lt; B</code>,{" "}
        <code className="text-foreground">A &lt;&gt; B</code>,{" "}
        <code className="text-foreground">A - B</code>,{" "}
        <code className="text-foreground">A -- B</code>,{" "}
        <code className="text-foreground">A --&gt; B: label</code>
      </p>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={apply}>
          Apply line
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setValue(serialized());
            setError(null);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
