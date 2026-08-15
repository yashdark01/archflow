"use client";

import { useCallback } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type OnSelectionChangeParams,
} from "reactflow";
import { ConnectionLine } from "@/components/canvas/ConnectionLine";
import { CanvasLegend } from "@/components/canvas/legend/CanvasLegend";
import { FitViewOnLoad } from "@/components/canvas/FitViewOnLoad";
import { CanvasControls } from "@/components/canvas/controls/CanvasControls";
import { MiniMapControl } from "@/components/canvas/controls/MiniMapControl";
import { edgeTypes } from "@/lib/reactflow/edgeTypes";
import { MAX_ZOOM, SNAP_GRID, DEFAULT_VIEWPORT } from "@/lib/reactflow/defaultViewport";
import { nodeTypes } from "@/lib/reactflow/nodeTypes";
import { useCanvasDrop } from "@/hooks/useCanvasDrop";
import { useCanvasTextLabel } from "@/hooks/useCanvasTextLabel";
import { usePlacementPointer } from "@/hooks/usePlacementPointer";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addEdge,
  commitDragHistory,
  deselectAll,
  updateEdgeConnection,
  onEdgesChange,
  onNodesChange,
  syncLayoutOverridesFromNodes,
} from "@/store/slices/diagramSlice";
import {
  setSelectedEdge,
  setSelectedNode,
  setLayoutManual,
} from "@/store/slices/uiSlice";
import { createEdge } from "@/utils/edgeFactory";

interface CanvasBoardProps {
  readOnly?: boolean;
}

export function CanvasBoard({ readOnly = false }: CanvasBoardProps) {
  const dispatch = useAppDispatch();
  const { canvasRef, onDragOver, onDrop } = useCanvasDrop(readOnly);
  usePlacementPointer(canvasRef, readOnly);
  useCanvasTextLabel(canvasRef, readOnly);
  const nodes = useAppSelector((state) => state.diagram.nodes);
  const edges = useAppSelector((state) => state.diagram.edges);
  const placement = useAppSelector((state) => state.ui.placement);
  const colorScheme = useAppSelector((state) => state.ui.colorScheme);
  const snapToGrid = useAppSelector((state) => state.ui.snapToGrid);
  const minimapOpen = useAppSelector((state) => state.ui.minimapOpen);
  const activeEdgeType = useAppSelector((state) => state.ui.activeEdgeType);
  const activeArrowDirection = useAppSelector((state) => state.ui.activeArrowDirection);
  const activeStrokeWidth = useAppSelector((state) => state.ui.activeStrokeWidth);
  const activeStrokeStyle = useAppSelector((state) => state.ui.activeStrokeStyle);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) return false;
      return true;
    },
    [],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (readOnly || !connection.source || !connection.target) return;

      const duplicate = edges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle,
      );

      if (duplicate) return;

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const color = sourceNode?.data.color;

      dispatch(
        addEdge(
          createEdge(connection, activeEdgeType, color, {
            arrowDirection: activeArrowDirection,
            strokeWidth: activeStrokeWidth,
            strokeStyle: activeStrokeStyle,
          }),
        ),
      );
    },
    [
      activeArrowDirection,
      activeEdgeType,
      activeStrokeStyle,
      activeStrokeWidth,
      dispatch,
      edges,
      nodes,
      readOnly,
    ],
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, connection: Connection) => {
      if (readOnly || !connection.source || !connection.target) return;
      if (connection.source === connection.target) return;

      dispatch(
        updateEdgeConnection({
          id: oldEdge.id,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
        }),
      );
    },
    [dispatch, readOnly],
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: OnSelectionChangeParams) => {
      if (selectedNodes.length === 1) {
        dispatch(setSelectedNode(selectedNodes[0].id));
      } else if (selectedEdges.length === 1) {
        dispatch(setSelectedEdge(selectedEdges[0].id));
      } else if (selectedNodes.length === 0 && selectedEdges.length === 0) {
        dispatch(setSelectedNode(null));
        dispatch(setSelectedEdge(null));
      }
    },
    [dispatch],
  );

  const onPaneClick = useCallback(() => {
    if (placement && !readOnly) return;

    dispatch(deselectAll());
    dispatch(setSelectedNode(null));
    dispatch(setSelectedEdge(null));
  }, [dispatch, placement, readOnly]);

  return (
    <div
      ref={canvasRef}
      className={cn("relative h-full w-full", placement && "canvas-placement-active")}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodesChange={
          readOnly
            ? undefined
            : (changes) => {
                const resized = changes.some(
                  (change) =>
                    change.type === "dimensions" &&
                    "resizing" in change &&
                    change.resizing === false,
                );
                if (resized) dispatch(setLayoutManual(true));
                dispatch(onNodesChange(changes));
                if (resized) dispatch(syncLayoutOverridesFromNodes());
              }
        }
        onEdgesChange={
          readOnly ? undefined : (changes) => dispatch(onEdgesChange(changes))
        }
        onConnect={onConnect}
        onReconnect={onReconnect}
        reconnectRadius={24}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        onNodeDragStop={
          readOnly
            ? undefined
            : () => {
                dispatch(setLayoutManual(true));
                dispatch(syncLayoutOverridesFromNodes());
                dispatch(commitDragHistory());
              }
        }
        connectionMode={ConnectionMode.Loose}
        connectionRadius={48}
        connectionLineComponent={ConnectionLine}
        isValidConnection={isValidConnection}
        defaultEdgeOptions={{
          type: activeEdgeType,
          interactionWidth: 24,
          reconnectable: !readOnly,
        }}
        elevateNodesOnSelect
        autoPanOnNodeDrag
        autoPanOnConnect
        nodeDragThreshold={4}
        zoomActivationKeyCode={["Meta", "Control"]}
        panActivationKeyCode="Space"
        defaultViewport={DEFAULT_VIEWPORT}
        maxZoom={MAX_ZOOM}
        snapToGrid={snapToGrid && !readOnly}
        snapGrid={SNAP_GRID}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        panOnScroll
        panOnDrag={[1, 2]}
        zoomOnScroll
        zoomOnPinch
        selectionOnDrag={!readOnly}
        deleteKeyCode={readOnly ? null : "Delete"}
        proOptions={{ hideAttribution: true }}
        className={cn(
          "archflow-canvas",
          colorScheme === "light" ? "archflow-canvas-light" : "archflow-canvas-eraser",
        )}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={SNAP_GRID[0]}
          size={1}
          color={colorScheme === "light" ? "var(--canvas-dot-light)" : "#3f3f46"}
        />
        {minimapOpen ? (
          <MiniMap
            pannable
            zoomable
            className="!bottom-12 !right-3"
            nodeColor={(node) => node.data?.color ?? "#64748b"}
            maskColor="rgb(0 0 0 / 0.15)"
          />
        ) : null}
        {!readOnly ? <CanvasControls /> : null}
        {!readOnly ? <MiniMapControl /> : null}
        <FitViewOnLoad />
      </ReactFlow>
      <CanvasLegend readOnly={readOnly} />
    </div>
  );
}
