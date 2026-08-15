"use client";

import { useEffect, useRef } from "react";
import { useReactFlow } from "reactflow";
import { useAppSelector } from "@/store/hooks";

export function FitViewOnLoad() {
  const { fitView } = useReactFlow();
  const nodeCount = useAppSelector((state) => state.diagram.nodes.length);
  const fitted = useRef(false);

  useEffect(() => {
    const onFitView = () => {
      if (nodeCount === 0) return;
      fitView({ padding: 0.25, duration: 300 });
    };

    window.addEventListener("archflow:fit-view", onFitView);
    return () => window.removeEventListener("archflow:fit-view", onFitView);
  }, [fitView, nodeCount]);

  useEffect(() => {
    if (nodeCount === 0) {
      fitted.current = false;
      return;
    }
    if (fitted.current) return;

    fitted.current = true;
    requestAnimationFrame(() => {
      fitView({ padding: 0.25, duration: 350 });
    });
  }, [fitView, nodeCount]);

  return null;
}
