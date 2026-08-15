"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteStoredDiagram,
  listStoredDiagrams,
} from "@/lib/storage/diagramStorage";
import type { StoredDiagram } from "@/types/diagram";
import { useDiagrams } from "@/hooks/useDiagrams";

const MIGRATION_DISMISSED_KEY = "archflow-migration-dismissed";

export function GuestDiagramMigration() {
  const router = useRouter();
  const { migrateGuestDiagram } = useDiagrams();
  const [guestDiagrams, setGuestDiagrams] = useState<StoredDiagram[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(MIGRATION_DISMISSED_KEY) === "true";
    if (dismissed) return;

    const diagrams = listStoredDiagrams();
    if (diagrams.length > 0) {
      setGuestDiagrams(diagrams);
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(MIGRATION_DISMISSED_KEY, "true");
    setOpen(false);
  };

  const migrate = async () => {
    setPending(true);
    setError(null);

    try {
      let lastId: string | null = null;

      for (const diagram of guestDiagrams) {
        lastId = await migrateGuestDiagram(diagram);
        deleteStoredDiagram(diagram.id);
      }

      localStorage.setItem(MIGRATION_DISMISSED_KEY, "true");
      setOpen(false);

      if (lastId) {
        router.push(`/editor/${lastId}`);
      }
    } catch {
      setError("Could not save guest diagrams. Try again or keep them locally.");
    } finally {
      setPending(false);
    }
  };

  if (!open) return null;

  const primary = guestDiagrams[0];

  return (
    <Dialog open={open} onOpenChange={(value) => !value && dismiss()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save your guest diagrams?</DialogTitle>
          <DialogDescription>
            We found {guestDiagrams.length} diagram
            {guestDiagrams.length === 1 ? "" : "s"} saved in this browser
            {primary ? ` (including “${primary.title || "Untitled Diagram"}”)` : ""}. Move them
            to your account so they sync across devices.
          </DialogDescription>
        </DialogHeader>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={dismiss} disabled={pending}>
            Keep locally
          </Button>
          <Button type="button" onClick={migrate} disabled={pending}>
            {pending ? "Saving…" : "Save to account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
