"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CodeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function CodeSheet({ open, onOpenChange, children }: CodeSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-full flex-col gap-0 p-0 sm:max-w-lg lg:max-w-xl"
      >
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle>Diagram as code</SheetTitle>
          <SheetDescription>
            Edit Eraser DSL or Mermaid — the canvas updates as you type.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
