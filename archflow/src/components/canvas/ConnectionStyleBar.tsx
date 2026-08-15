"use client";

import { COLOR_PRESETS } from "@/constants/nodeDefaults";
import {
  CONNECTION_STYLE_OPTIONS,
  DEFAULT_EDGE_COLOR,
  EDGE_STROKE_STYLES,
  EDGE_STROKE_WEIGHTS,
} from "@/constants/edgeDefaults";
import {
  ERASER_CONNECTOR_OPTIONS,
  connectorFromEdgeData,
  edgeDataFromConnector,
} from "@/lib/canvas/style/edgeDesign";
import type { EraserConnector } from "@/lib/canvas/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateEdgeData, updateEdgeType } from "@/store/slices/diagramSlice";
import {
  requestEdgeLabelEdit,
  setActiveArrowDirection,
  setActiveEdgeColor,
  setActiveEdgeType,
  setActiveStrokeStyle,
  setActiveStrokeWidth,
} from "@/store/slices/uiSlice";
import type { ArrowDirection, EdgeData, EdgeType } from "@/types/diagram";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ChevronDown,
  MessageSquarePlus,
  Minus,
  MoreHorizontal,
} from "lucide-react";

function StrokeWeightIcon({ weight }: { weight: number }) {
  const heights = weight <= 1.5 ? [1, 2, 3] : weight <= 2 ? [1.5, 2.5, 3.5] : [2, 3, 4];
  return (
    <span className="flex flex-col items-center justify-center gap-[2px] px-0.5" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className="block w-4 rounded-full bg-current"
          style={{ height: `${h}px` }}
        />
      ))}
    </span>
  );
}

export function ConnectionStyleBar() {
  const dispatch = useAppDispatch();
  const activeEdgeType = useAppSelector((state) => state.ui.activeEdgeType);
  const activeArrowDirection = useAppSelector((state) => state.ui.activeArrowDirection);
  const activeEdgeColor = useAppSelector((state) => state.ui.activeEdgeColor);
  const activeStrokeWidth = useAppSelector((state) => state.ui.activeStrokeWidth);
  const activeStrokeStyle = useAppSelector((state) => state.ui.activeStrokeStyle);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);
  const selectedEdge = useAppSelector((state) =>
    selectedEdgeId
      ? state.diagram.edges.find((edge) => edge.id === selectedEdgeId)
      : undefined,
  );

  const edgeData: EdgeData = selectedEdge?.data ?? {
    label: "",
    color: activeEdgeColor,
    arrowDirection: activeArrowDirection,
    strokeWidth: activeStrokeWidth,
    strokeStyle: activeStrokeStyle,
  };

  const currentType = (selectedEdge?.type ?? activeEdgeType) as EdgeType;
  const currentColor = edgeData.color ?? DEFAULT_EDGE_COLOR;
  const currentArrow = edgeData.arrowDirection ?? activeArrowDirection;
  const currentStrokeWidth = edgeData.strokeWidth ?? activeStrokeWidth;
  const currentStrokeStyle = edgeData.strokeStyle ?? activeStrokeStyle;

  const pathOption =
    CONNECTION_STYLE_OPTIONS.find((option) => option.value === currentType) ??
    CONNECTION_STYLE_OPTIONS[0];

  const applyEdgeType = (edgeType: EdgeType) => {
    dispatch(setActiveEdgeType(edgeType));
    if (selectedEdgeId) {
      dispatch(updateEdgeType({ id: selectedEdgeId, type: edgeType }));
    }
  };

  const applyEdgePatch = (patch: Partial<EdgeData>) => {
    if (patch.color) dispatch(setActiveEdgeColor(patch.color));
    if (patch.arrowDirection) dispatch(setActiveArrowDirection(patch.arrowDirection));
    if (patch.strokeWidth != null) dispatch(setActiveStrokeWidth(patch.strokeWidth));
    if (patch.strokeStyle) dispatch(setActiveStrokeStyle(patch.strokeStyle));
    if (selectedEdgeId) {
      dispatch(updateEdgeData({ id: selectedEdgeId, data: patch }));
    }
  };

  const applyConnector = (connector: EraserConnector) => {
    const attrs = edgeDataFromConnector(connector);
    applyEdgePatch({
      connector: attrs.connector,
      arrowDirection: attrs.arrowDirection,
      strokeStyle: attrs.strokeStyle,
    });
  };

  const currentConnector =
    edgeData.connector ??
    connectorFromEdgeData(currentArrow, currentStrokeStyle);

  const applyArrow = (direction: ArrowDirection) => {
    applyEdgePatch({ arrowDirection: direction });
  };

  const addLabel = () => {
    if (selectedEdgeId) {
      dispatch(requestEdgeLabelEdit(selectedEdgeId));
    }
  };

  return (
    <div
      className="panel-chrome absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border px-1 py-1 shadow-lg"
      role="toolbar"
      aria-label="Line controls"
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
              aria-label="Line color"
            >
              <span
                className="size-4 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent align="center" className="min-w-[140px]">
          <div className="grid grid-cols-4 gap-1.5 p-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "size-6 rounded-md border border-border transition-transform hover:scale-110",
                  currentColor === color && "ring-2 ring-primary ring-offset-1",
                )}
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
                onClick={() => applyEdgePatch({ color })}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
              aria-label="Path style"
            >
              <pathOption.icon className="size-4" />
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent align="center" className="min-w-[160px]">
          {CONNECTION_STYLE_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => applyEdgeType(option.value)}
              className={cn(currentType === option.value && "bg-accent")}
            >
              <option.icon className="size-4" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
              aria-label="Line weight"
            >
              <StrokeWeightIcon weight={currentStrokeWidth} />
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent align="center">
          {EDGE_STROKE_WEIGHTS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => applyEdgePatch({ strokeWidth: option.value })}
              className={cn(currentStrokeWidth === option.value && "bg-accent")}
            >
              <StrokeWeightIcon weight={option.value} />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-0.5 !h-6" />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          "size-8",
          currentArrow === "backward" && "bg-primary/15 text-primary",
        )}
        aria-label="Arrow at start"
        aria-pressed={currentArrow === "backward"}
        onClick={() => applyArrow("backward")}
      >
        <ArrowLeft className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          "size-8",
          currentArrow === "forward" && "bg-primary/15 text-primary",
        )}
        aria-label="Arrow at end"
        aria-pressed={currentArrow === "forward"}
        onClick={() => applyArrow("forward")}
      >
        <ArrowRight className="size-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8"
              aria-label="More arrow options"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="center">
          {ERASER_CONNECTOR_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => applyConnector(option.value)}
              className={cn(currentConnector === option.value && "bg-accent")}
            >
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={() => applyArrow("bidirectional")}
            className={cn(currentArrow === "bidirectional" && "bg-accent")}
          >
            <ArrowLeftRight className="size-4" />
            Bidirectional
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => applyArrow("none")}
            className={cn(currentArrow === "none" && currentStrokeStyle === "solid" && "bg-accent")}
          >
            <Minus className="size-4" />
            Line only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-0.5 !h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn(
                "size-8",
                currentStrokeStyle !== "solid" && "bg-primary/15 text-primary",
              )}
              aria-label="Line pattern"
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <line
                  x1="2"
                  y1="8"
                  x2="14"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={
                    currentStrokeStyle === "dotted"
                      ? "2 2"
                      : currentStrokeStyle === "dashed"
                        ? "4 2"
                        : undefined
                  }
                />
              </svg>
            </Button>
          }
        />
        <DropdownMenuContent align="center">
          {EDGE_STROKE_STYLES.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => applyEdgePatch({ strokeStyle: option.value })}
              className={cn(currentStrokeStyle === option.value && "bg-accent")}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-8"
        aria-label="Add label"
        disabled={!selectedEdgeId}
        onClick={addLabel}
      >
        <MessageSquarePlus className="size-4" />
      </Button>
    </div>
  );
}
