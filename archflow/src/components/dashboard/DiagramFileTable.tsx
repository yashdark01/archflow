"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { StoredDiagram } from "@/types/diagram";
import { formatDiagramDate } from "@/lib/storage/diagramStorage";
import { FileText, Trash2 } from "lucide-react";

interface DiagramFileTableProps {
  diagrams: StoredDiagram[];
  searchQuery: string;
  onDelete: (id: string) => void;
}

export function DiagramFileTable({
  diagrams,
  searchQuery,
  onDelete,
}: DiagramFileTableProps) {
  const filtered = diagrams.filter((diagram) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return diagram.title.toLowerCase().includes(q) || diagram.id.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          {searchQuery ? "No files match your search" : "Your list is empty"}
        </p>
        {!searchQuery ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Create a blank file or use a quick action above
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Location</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Created</th>
            <th className="px-4 py-3 font-medium">Edited</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Author</th>
            <th className="px-4 py-3 font-medium w-10" aria-label="Actions" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map((diagram) => (
            <tr
              key={diagram.id}
              className="group bg-card transition-colors hover:bg-muted/30"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/editor/${diagram.id}`}
                  className="flex items-center gap-2 font-medium hover:text-primary"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{diagram.title || "Untitled Diagram"}</span>
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                All Files
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                {formatDiagramDate(diagram.updatedAt)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDiagramDate(diagram.updatedAt)}
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                You
              </td>
              <td className="px-2 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100"
                  aria-label="Delete diagram"
                  onClick={() => onDelete(diagram.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
