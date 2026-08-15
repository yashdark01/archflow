"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DiagramFileTable } from "@/components/dashboard/DiagramFileTable";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDiagrams } from "@/hooks/useDiagrams";
import {
  createNewDiagramId,
  seedBlankDiagram,
} from "@/lib/storage/diagramStorage";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type FilterTab = "all" | "recents";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recents", label: "Recents" },
];

export function DashboardShell() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    diagrams,
    loading,
    error,
    sortBy,
    createDiagram,
    deleteDiagram,
    renameDiagram,
    duplicateDiagram,
    changeSortBy,
  } = useDiagrams();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const openBlankFile = useCallback(async () => {
    try {
      const id = await createDiagram();
      router.push(`/editor/${id}`);
    } catch {
      // fallback if API fails
      const id = createNewDiagramId();
      router.push(`/editor/${id}`);
    }
  }, [createDiagram, router]);

  const openSampleDiagram = useCallback(async () => {
    try {
      const id = await createDiagram("VPC Architecture");
      router.push(`/editor/${id}`);
    } catch {
      const id = createNewDiagramId();
      seedBlankDiagram(id, "VPC Architecture");
      router.push(`/editor/${id}`);
    }
  }, [createDiagram, router]);

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

  const displayDiagrams =
    activeTab === "recents" ? diagrams.slice(0, 20) : diagrams;

  return (
    <div className="flex h-full min-h-0 flex-1">
      <DashboardSidebar
        onNewFile={openBlankFile}
        userEmail={session?.user?.email}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
      />

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
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  changeSortBy(value as "updated" | "created" | "title")
                }
              >
                <SelectTrigger className="w-[140px]" size="sm">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last updated</SelectItem>
                  <SelectItem value="created">Date created</SelectItem>
                  <SelectItem value="title">Name</SelectItem>
                </SelectContent>
              </Select>

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
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {error ? (
            <p className="mb-4 text-sm text-destructive">{error}</p>
          ) : null}

          <section className="mb-8">
            <QuickActionGrid
              onBlankFile={openBlankFile}
              onSampleDiagram={openSampleDiagram}
            />
          </section>

          <section>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-md bg-muted/50"
                  />
                ))}
              </div>
            ) : (
              <DiagramFileTable
                diagrams={displayDiagrams}
                searchQuery={searchQuery}
                onDelete={deleteDiagram}
                onRename={renameDiagram}
                onDuplicate={duplicateDiagram}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
