"use client";

import type {
  EraserConnector,
  EraserLegend,
  EraserLegendItem,
  LegendPosition,
  LegendShape,
} from "@/lib/canvas/schema";
import { ERASER_CONNECTOR_OPTIONS } from "@/lib/canvas/style/edgeDesign";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearLegendLayoutOverride,
  updateDocumentLegend,
  updateDocumentStyle,
} from "@/store/slices/diagramSlice";
import { Plus, Trash2 } from "lucide-react";

const LEGEND_POSITIONS: LegendPosition[] = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
  "top",
  "bottom",
  "left",
  "right",
];

const LEGEND_ITEM_TYPES = [
  { value: "connection", label: "Connection line" },
  { value: "color", label: "Color swatch" },
  { value: "icon", label: "Icon" },
  { value: "shape", label: "Shape" },
] as const;

type LegendItemType = (typeof LEGEND_ITEM_TYPES)[number]["value"];

const COLOR_PRESETS = [
  "red",
  "orange",
  "green",
  "blue",
  "purple",
  "gray",
] as const;

const SHAPE_OPTIONS: LegendShape[] = ["rectangle", "diamond", "oval"];

function inferItemType(item: EraserLegendItem): LegendItemType {
  if (item.connection) return "connection";
  if (item.icon) return "icon";
  if (item.shape) return "shape";
  return "color";
}

function buildLegendItem(
  type: LegendItemType,
  label: string,
  value: string,
): EraserLegendItem {
  const item: EraserLegendItem = { label };
  switch (type) {
    case "connection":
      item.connection = value as EraserConnector;
      break;
    case "icon":
      item.icon = value;
      break;
    case "shape":
      item.shape = value as LegendShape;
      item.color = "blue";
      break;
    case "color":
      item.color = value;
      break;
  }
  return item;
}

export function DiagramProperties() {
  const dispatch = useAppDispatch();
  const style = useAppSelector((state) => state.diagram.document.style);
  const legend = useAppSelector((state) => state.diagram.document.legend);
  const items = legend?.items ?? [];

  const updateLegend = (next: EraserLegend | undefined) => {
    dispatch(updateDocumentLegend(next));
  };

  const setItems = (nextItems: EraserLegendItem[]) => {
    if (nextItems.length === 0 && !legend?.position) {
      updateLegend(undefined);
      return;
    }
    updateLegend({
      position: legend?.position,
      items: nextItems,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Diagram</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Defaults apply to all nodes unless overridden per node.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Layout direction</Label>
        <Select
          value={style.direction}
          onValueChange={(value) =>
            dispatch(
              updateDocumentStyle({
                direction: value as typeof style.direction,
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="right">Right (default)</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="down">Down</SelectItem>
            <SelectItem value="up">Up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fill mode</Label>
        <Select
          value={style.colorMode}
          onValueChange={(value) =>
            dispatch(
              updateDocumentStyle({
                colorMode: value as typeof style.colorMode,
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pastel">Pastel</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Style mode</Label>
        <Select
          value={style.styleMode}
          onValueChange={(value) =>
            dispatch(
              updateDocumentStyle({
                styleMode: value as typeof style.styleMode,
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shadow">Shadow</SelectItem>
            <SelectItem value="plain">Plain</SelectItem>
            <SelectItem value="watercolor">Watercolor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Typeface</Label>
        <Select
          value={style.typeface}
          onValueChange={(value) =>
            dispatch(
              updateDocumentStyle({
                typeface: value as typeof style.typeface,
              }),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rough">Rough</SelectItem>
            <SelectItem value="clean">Clean</SelectItem>
            <SelectItem value="mono">Mono</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold">Legend</h3>
            <p className="text-xs text-muted-foreground">
              Eraser-style key shown on the diagram surface.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setItems([
                ...items,
                buildLegendItem("connection", "New item", ">"),
              ])
            }
          >
            <Plus className="mr-1 size-3.5" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <Select
            value={legend?.position ?? "top-right"}
            onValueChange={(value) => {
              dispatch(clearLegendLayoutOverride());
              updateLegend({
                position: value as LegendPosition,
                items,
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEGEND_POSITIONS.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No legend items yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, index) => {
              const type = inferItemType(item);
              return (
                <li
                  key={`legend-item-${index}`}
                  className="space-y-2 rounded-md border border-border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Label className="text-xs">Item {index + 1}</Label>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Remove legend item"
                      onClick={() =>
                        setItems(items.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <Input
                    value={item.label}
                    onChange={(event) => {
                      const next = [...items];
                      next[index] = { ...item, label: event.target.value };
                      setItems(next);
                    }}
                    placeholder="Label"
                    aria-label="Legend label"
                  />
                  <Select
                    value={type}
                    onValueChange={(value) => {
                      const next = [...items];
                      next[index] = buildLegendItem(
                        value as LegendItemType,
                        item.label,
                        value === "connection"
                          ? ">"
                          : value === "icon"
                            ? "aws-lambda"
                            : value === "shape"
                              ? "rectangle"
                              : "red",
                      );
                      setItems(next);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEGEND_ITEM_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {type === "connection" ? (
                    <>
                      <Select
                        value={item.connection ?? ">"}
                        onValueChange={(value) => {
                          const next = [...items];
                          next[index] = {
                            label: item.label,
                            connection: value as EraserConnector,
                            ...(item.color ? { color: item.color } : {}),
                          };
                          setItems(next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ERASER_CONNECTOR_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={item.color ?? "inherit"}
                        onValueChange={(value) => {
                          if (!value) return;
                          const next = [...items];
                          const entry: EraserLegendItem = {
                            label: item.label,
                            connection: item.connection ?? ">",
                          };
                          if (value !== "inherit") entry.color = value;
                          next[index] = entry;
                          setItems(next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Line color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inherit">Default line color</SelectItem>
                          {COLOR_PRESETS.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : null}
                  {type === "color" ? (
                    <Select
                      value={item.color ?? "red"}
                      onValueChange={(value) => {
                        if (!value) return;
                        const next = [...items];
                        next[index] = { label: item.label, color: value };
                        setItems(next);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_PRESETS.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                  {type === "icon" ? (
                    <Input
                      value={item.icon ?? ""}
                      onChange={(event) => {
                        const next = [...items];
                        next[index] = {
                          label: item.label,
                          icon: event.target.value,
                        };
                        setItems(next);
                      }}
                      placeholder="aws-lambda"
                      aria-label="Icon id"
                    />
                  ) : null}
                  {type === "shape" ? (
                    <>
                      <Select
                        value={item.shape ?? "rectangle"}
                        onValueChange={(value) => {
                          const next = [...items];
                          next[index] = {
                            label: item.label,
                            shape: value as LegendShape,
                            color: item.color ?? "blue",
                          };
                          setItems(next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SHAPE_OPTIONS.map((shape) => (
                            <SelectItem key={shape} value={shape}>
                              {shape}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={item.color ?? "blue"}
                        onValueChange={(value) => {
                          if (!value) return;
                          const next = [...items];
                          next[index] = {
                            label: item.label,
                            shape: item.shape ?? "rectangle",
                            color: value,
                          };
                          setItems(next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Shape color" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLOR_PRESETS.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
