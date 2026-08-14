"use client";

import { useEffect, useState } from "react";
import type { EraserIconCatalog } from "@/types/eraserIcons";
import { ERASER_CATALOG_PATH } from "@/constants/eraserIcons";

export function useEraserCatalog() {
  const [catalog, setCatalog] = useState<EraserIconCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(ERASER_CATALOG_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load icon catalog");
        return res.json() as Promise<EraserIconCatalog>;
      })
      .then((data) => {
        if (!cancelled) {
          setCatalog(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { catalog, loading, error };
}
