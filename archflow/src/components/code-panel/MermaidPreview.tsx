"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidPreviewProps {
  code: string;
  onParseError?: (message: string | null) => void;
}

export function MermaidPreview({ code, onParseError }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!containerRef.current || !code.trim()) {
        setRenderError(null);
        onParseError?.(null);
        if (containerRef.current) containerRef.current.innerHTML = "";
        return;
      }

      try {
        await mermaid.parse(code);
        onParseError?.(null);
        const id = `archflow-mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRenderError(null);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Invalid Mermaid syntax";
        if (!cancelled) {
          setRenderError(message);
          onParseError?.(message);
          if (containerRef.current) containerRef.current.innerHTML = "";
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [code, onParseError]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#111]">
      <div className="shrink-0 border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-white/40">
        Preview
      </div>
      {renderError ? (
        <p className="shrink-0 px-3 py-2 text-xs text-red-400">{renderError}</p>
      ) : null}
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 [&_svg]:max-w-full"
      />
    </div>
  );
}
