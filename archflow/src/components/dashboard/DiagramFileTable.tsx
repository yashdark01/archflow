"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { DiagramListItem } from "@/types/api";
import { formatDiagramDate } from "@/lib/storage/diagramStorage";
import { Copy, FileText, Pencil, Trash2 } from "lucide-react";

interface DiagramFileTableProps {
  diagrams: DiagramListItem[];
  searchQuery: string;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, title: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<string>;
}

export function DiagramFileTable({
  diagrams,
  searchQuery,
  onDelete,
  onRename,
  onDuplicate,
}: DiagramFileTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<DiagramListItem | null>(null);
  const [renameTarget, setRenameTarget] = useState<DiagramListItem | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pending, setPending] = useState(false);

  const filtered = diagrams.filter((diagram) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return diagram.title.toLowerCase().includes(q) || diagram.id.toLowerCase().includes(q);
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setPending(true);
    try {
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setPending(false);
    }
  };

  const confirmRename = async () => {
    if (!renameTarget || !renameValue.trim()) return;
    setPending(true);
    try {
      await onRename(renameTarget.id, renameValue.trim());
      setRenameTarget(null);
    } finally {
      setPending(false);
    }
  };

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          {searchQuery ? "No files match your search" : "Create your first diagram"}
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
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Location</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Created</th>
              <th className="px-4 py-3 font-medium">Edited</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Author</th>
              <th className="px-4 py-3 font-medium w-28" aria-label="Actions" />
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
                  {formatDiagramDate(diagram.createdAt)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDiagramDate(diagram.updatedAt)}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                  You
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Rename diagram"
                      onClick={() => {
                        setRenameTarget(diagram);
                        setRenameValue(diagram.title);
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Duplicate diagram"
                      onClick={() => onDuplicate(diagram.id)}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete diagram"
                      onClick={() => setDeleteTarget(diagram)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete diagram?</DialogTitle>
            <DialogDescription>
              “{deleteTarget?.title || "Untitled Diagram"}” will be permanently removed. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={pending}>
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={renameTarget !== null}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename diagram</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            placeholder="Diagram title"
            aria-label="Diagram title"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameTarget(null)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmRename}
              disabled={pending || !renameValue.trim()}
            >
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
