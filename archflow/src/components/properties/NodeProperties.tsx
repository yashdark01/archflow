"use client";

import { COLOR_PRESETS } from "@/constants/nodeDefaults";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateNodeData } from "@/store/slices/diagramSlice";
import type { BorderStyle, NodeData } from "@/types/diagram";
import { EraserIcon } from "@/components/icons/EraserIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NodePropertiesProps {
  nodeId: string;
}

export function NodeProperties({ nodeId }: NodePropertiesProps) {
  const dispatch = useAppDispatch();
  const node = useAppSelector((state) =>
    state.diagram.nodes.find((item) => item.id === nodeId),
  );

  if (!node) return null;

  const data = node.data;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Node properties</h2>

      <div className="space-y-2">
        <Label htmlFor="node-icon">Eraser icon</Label>
        <div className="flex items-center gap-2">
          {data.icon ? (
            <EraserIcon iconId={data.icon} size={28} className="rounded border border-border bg-background p-1" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-dashed border-border text-[10px] text-muted-foreground">
              —
            </div>
          )}
          <Input
            id="node-icon"
            placeholder="e.g. aws-ec2, redis"
            value={data.icon ?? ""}
            onChange={(event) => {
              const value = event.target.value.trim();
              dispatch(
                updateNodeData({
                  id: nodeId,
                  data: { icon: value || undefined },
                }),
              );
            }}
            className="flex-1"
          />
        </div>
        {data.icon ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              dispatch(updateNodeData({ id: nodeId, data: { icon: undefined } }))
            }
          >
            Remove icon
          </Button>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Eraser icon ID from{" "}
          <a
            href="https://docs.eraser.io/icons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            docs.eraser.io/icons
          </a>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="node-eraser-name">DSL name</Label>
        <Input
          id="node-eraser-name"
          value={data.eraserName ?? data.label}
          onChange={(event) =>
            dispatch(
              updateNodeData({
                id: nodeId,
                data: { eraserName: event.target.value },
              }),
            )
          }
        />
        <p className="text-xs text-muted-foreground">
          Identifier used in Eraser connection lines. Label changes do not update this
          automatically.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="node-label">Label</Label>
        <Input
          id="node-label"
          value={data.label}
          onChange={(event) =>
            dispatch(updateNodeData({ id: nodeId, data: { label: event.target.value } }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Set color ${color}`}
              className="h-8 w-8 rounded-md border border-border ring-offset-background transition hover:ring-2 hover:ring-primary"
              style={{ backgroundColor: color }}
              onClick={() => dispatch(updateNodeData({ id: nodeId, data: { color } }))}
            />
          ))}
        </div>
        <Input
          type="color"
          value={data.color}
          onChange={(event) =>
            dispatch(updateNodeData({ id: nodeId, data: { color: event.target.value } }))
          }
          aria-label="Custom node color"
          className="h-10 w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Border</Label>
        <Select
          value={data.borderStyle}
          onValueChange={(value) =>
            dispatch(
              updateNodeData({
                id: nodeId,
                data: { borderStyle: value as BorderStyle },
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="none">None (icon-only)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fill mode</Label>
        <Select
          value={data.colorMode ?? "inherit"}
          onValueChange={(value) =>
            dispatch(
              updateNodeData({
                id: nodeId,
                data: {
                  colorMode:
                    value === "inherit"
                      ? undefined
                      : (value as NodeData["colorMode"]),
                },
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Diagram default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inherit">Diagram default</SelectItem>
            <SelectItem value="pastel">Pastel</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Style mode</Label>
        <Select
          value={data.styleMode ?? "inherit"}
          onValueChange={(value) =>
            dispatch(
              updateNodeData({
                id: nodeId,
                data: {
                  styleMode:
                    value === "inherit"
                      ? undefined
                      : (value as NodeData["styleMode"]),
                },
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Diagram default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inherit">Diagram default</SelectItem>
            <SelectItem value="shadow">Shadow</SelectItem>
            <SelectItem value="plain">Plain</SelectItem>
            <SelectItem value="watercolor">Watercolor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Typeface</Label>
        <Select
          value={data.typeface ?? "inherit"}
          onValueChange={(value) =>
            dispatch(
              updateNodeData({
                id: nodeId,
                data: {
                  typeface:
                    value === "inherit"
                      ? undefined
                      : (value as NodeData["typeface"]),
                },
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Diagram default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inherit">Diagram default</SelectItem>
            <SelectItem value="rough">Rough</SelectItem>
            <SelectItem value="clean">Clean</SelectItem>
            <SelectItem value="mono">Mono</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="node-link">Link</Label>
        <Input
          id="node-link"
          placeholder="https://..."
          value={data.link ?? ""}
          onChange={(event) =>
            dispatch(
              updateNodeData({
                id: nodeId,
                data: { link: event.target.value.trim() || undefined },
              }),
            )
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="node-description">Description</Label>
        <Textarea
          id="node-description"
          rows={4}
          value={data.description}
          onChange={(event) =>
            dispatch(
              updateNodeData({ id: nodeId, data: { description: event.target.value } }),
            )
          }
        />
      </div>
    </div>
  );
}
