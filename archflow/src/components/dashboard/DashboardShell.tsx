"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DiagramFileTable } from "@/components/dashboard/DiagramFileTable";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoredDiagram } from "@/types/diagram";
import {
  createNewDiagramId,
  deleteStoredDiagram,
  listStoredDiagrams,
  seedBlankDiagram,
} from "@/lib/storage/diagramStorage";
import { cn } from "@/lib/utils";
import { Search, UserPlus } from "lucide-react";

type FilterTab = "all" | "recents";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recents", label: "Recents" },
];

export function DashboardShell() {
  const router = useRouter();
  const [diagrams, setDiagrams] = useState<StoredDiagram[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const openBlankFile = useCallback(() => {
    const id = createNewDiagramId();
    router.push(`/editor/${id}`);
  }, [router]);

  const openSampleDiagram = useCallback(() => {
    const id = createNewDiagramId();
    seedBlankDiagram(id, "VPC Architecture");
    router.push(`/editor/${id}`);
  }, [router]);

  const refresh = useCallback(() => {
    setDiagrams(listStoredDiagrams());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "n") {
        event.preventDefault();
        openBlankFile();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openBlankFile]);

  const handleDelete = (id: string) => {
    deleteStoredDiagram(id);
    refresh();
  };

  const displayDiagrams =
    activeTab === "recents" ? diagrams.slice(0, 20) : diagrams;

  return (
    <div className="flex h-full min-h-0 flex-1">
      <DashboardSidebar onNewFile={openBlankFile} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-border bg-card px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              {FILTER_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    activeTab === id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1 sm:w-64">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search"
                  className="pl-8"
                  aria-label="Search diagrams"
                />
              </div>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" disabled>
                <UserPlus className="size-3.5" />
                Invite
              </Button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <section className="mb-8">
            <QuickActionGrid
              onBlankFile={openBlankFile}
              onSampleDiagram={openSampleDiagram}
            />
          </section>

          <section>
            <DiagramFileTable
              diagrams={displayDiagrams}
              searchQuery={searchQuery}
              onDelete={handleDelete}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
