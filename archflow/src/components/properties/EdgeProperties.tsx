"use client";

import { COLOR_PRESETS } from "@/constants/nodeDefaults";
import { DEFAULT_EDGE_COLOR, CONNECTION_STYLE_OPTIONS, DEFAULT_EDGE_TYPE } from "@/constants/edgeDefaults";
import { ConnectionDslEditor } from "@/components/properties/ConnectionDslEditor";
import { EdgeLabelEditor } from "@/components/canvas/edges/EdgeLabel";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateEdgeData, updateEdgeType } from "@/store/slices/diagramSlice";
import type { ArrowDirection, EdgeData, EdgeType } from "@/types/diagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EdgePropertiesProps {
  edgeId: string;
}

export function EdgeProperties({ edgeId }: EdgePropertiesProps) {
  const dispatch = useAppDispatch();
  const edge = useAppSelector((state) =>
    state.diagram.edges.find((item) => item.id === edgeId),
  );

  if (!edge) return null;

  const data: EdgeData = edge.data ?? {
    label: "",
    color: DEFAULT_EDGE_COLOR,
    arrowDirection: "forward",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Edge properties</h2>

      <div className="space-y-2">
        <Label>Label</Label>
        <EdgeLabelEditor edgeId={edgeId} label={data.label} />
      </div>

      <div className="space-y-2">
        <Label>Path style</Label>
        <Select
          value={edge.type ?? DEFAULT_EDGE_TYPE}
          onValueChange={(value) =>
            dispatch(updateEdgeType({ id: edgeId, type: value as EdgeType }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONNECTION_STYLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {CONNECTION_STYLE_OPTIONS.find((o) => o.value === edge.type)?.description ??
            "How the connection line is drawn"}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Arrow</Label>
        <Select
          value={data.arrowDirection}
          onValueChange={(value) =>
            dispatch(
              updateEdgeData({
                id: edgeId,
                data: { arrowDirection: value as ArrowDirection },
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="forward">Forward →</SelectItem>
            <SelectItem value="backward">Backward ←</SelectItem>
            <SelectItem value="bidirectional">Bidirectional ↔</SelectItem>
            <SelectItem value="none">Line only —</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ConnectionDslEditor edgeId={edgeId} />

      {data.bendPoint ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() =>
            dispatch(updateEdgeData({ id: edgeId, data: { bendPoint: undefined } }))
          }
        >
          Reset bend point
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Select the edge and drag the dot on the line to adjust the bend.
        </p>
      )}

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Set color ${color}`}
              className="h-8 w-8 rounded-md border border-border"
              style={{ backgroundColor: color }}
              onClick={() => dispatch(updateEdgeData({ id: edgeId, data: { color } }))}
            />
          ))}
        </div>
        <Input
          type="color"
          value={data.color}
          onChange={(event) =>
            dispatch(updateEdgeData({ id: edgeId, data: { color: event.target.value } }))
          }
          aria-label="Custom edge color"
          className="h-10 w-full"
        />
      </div>
    </div>
  );
}
