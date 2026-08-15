"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export function Sidebar({ open, onClose, children, className }: SidebarProps) {
  return (
    <>
      {open && onClose ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "z-40 flex shrink-0 flex-col border-r border-border bg-card",
          "fixed inset-y-0 left-0 w-72 transform transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:w-0 lg:border-r-0 lg:overflow-hidden",
          className,
        )}
        aria-label="Node palette"
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-3 lg:hidden">
          <span className="section-label">Nodes</span>
          {onClose ? (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
              onClick={onClose}
            >
              Close
            </button>
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </>
  );
}
