"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Archive,
  Bot,
  ChevronDown,
  FileStack,
  FolderOpen,
  Lock,
  Palette,
  Plus,
  Wand2,
} from "lucide-react";

interface DashboardSidebarProps {
  onNewFile: () => void;
}

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof FolderOpen;
  shortcut?: string;
  badge?: string;
}[] = [
  { href: "/dashboard", label: "All Files", icon: FolderOpen, shortcut: "A" },
  { href: "/dashboard/private", label: "Private Files", icon: Lock, badge: "Soon" },
  { href: "/dashboard/archive", label: "Archive", icon: Archive, shortcut: "E" },
];

export function DashboardSidebar({ onNewFile }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-full w-[240px] shrink-0 flex-col border-r border-border bg-card"
      aria-label="Dashboard sidebar"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Link href="/" className="text-sm font-bold tracking-tight hover:text-primary">
          ArchFlow
        </Link>
        <button
          type="button"
          className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          aria-label="Workspace"
        >
          Yash&apos;s Team
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 p-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, shortcut, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0 opacity-70" />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {badge}
                </span>
              ) : shortcut ? (
                <span className="text-[10px] text-muted-foreground/60">{shortcut}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mt-3 rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-xs font-medium text-foreground">ArchFlow</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Open-source diagram editor. Diagrams are saved locally in your browser.
        </p>
        <p className="mt-2 text-[10px] text-muted-foreground">Local storage · Free</p>
      </div>

      <div className="mt-auto flex flex-col gap-0.5 p-2">
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <Wand2 className="size-4 opacity-70" />
          AI Presets
          <span className="ml-auto text-[10px] text-muted-foreground/60">T</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <Palette className="size-4 opacity-70" />
          Custom Styles
          <span className="ml-auto text-[10px] text-muted-foreground/60">S</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <FileStack className="size-4 opacity-70" />
          MCP
          <span className="ml-auto text-[10px] text-muted-foreground/60">C</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <Bot className="size-4 opacity-70" />
          ArchBot
          <span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            Soon
          </span>
        </button>
      </div>

      <div className="border-t border-border p-3">
        <Button className="w-full gap-2" onClick={onNewFile}>
          <Plus className="size-4" />
          New File
          <span className="ml-auto text-[10px] opacity-70">⌃ N</span>
        </Button>
      </div>
    </aside>
  );
}
