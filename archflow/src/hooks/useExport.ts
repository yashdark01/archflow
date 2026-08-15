"use client";

import { useCallback, useState } from "react";
import { toPng } from "html-to-image";
import { useAppSelector } from "@/store/hooks";
import { downloadFile } from "@/utils/downloadFile";

export type ExportBackground = "transparent" | "white";

export function useExport() {
  const diagramTitle = useAppSelector((state) => state.ui.diagramTitle);
  const [exporting, setExporting] = useState(false);

  const capturePng = useCallback(
    async (background: ExportBackground = "white") => {
      const viewport = document.querySelector(".react-flow__viewport") as HTMLElement | null;
      if (!viewport) throw new Error("Canvas not found");

      return toPng(viewport, {
        backgroundColor: background === "white" ? "#ffffff" : undefined,
        pixelRatio: 2,
        filter: (node) => {
          if (node.classList?.contains("react-flow__minimap")) return false;
          if (node.classList?.contains("react-flow__controls")) return false;
          return true;
        },
      });
    },
    [],
  );

  const exportPng = useCallback(
    async (background: ExportBackground = "white") => {
      setExporting(true);
      try {
        const dataUrl = await capturePng(background);
        const date = new Date().toISOString().slice(0, 10);
        const safeTitle = diagramTitle.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
        const suffix = background === "transparent" ? "-transparent" : "";
        downloadFile(dataUrl, `${safeTitle || "diagram"}${suffix}-${date}.png`);
      } finally {
        setExporting(false);
      }
    },
    [capturePng, diagramTitle],
  );

  const copyPngToClipboard = useCallback(
    async (background: ExportBackground = "white") => {
      if (!navigator.clipboard?.write) {
        throw new Error("Clipboard API not available");
      }

      setExporting(true);
      try {
        const dataUrl = await capturePng(background);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
      } finally {
        setExporting(false);
      }
    },
    [capturePng],
  );

  return { exportPng, copyPngToClipboard, exporting };
}
