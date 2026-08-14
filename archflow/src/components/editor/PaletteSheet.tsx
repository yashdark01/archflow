"use client";

import { SidebarPalette } from "@/components/sidebar/SidebarPalette";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PaletteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaletteSheet({ open, onOpenChange }: PaletteSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false} disablePointerDismissal>
      <SheetContent
        side="left"
        overlayClassName="pointer-events-none"
        className="pointer-events-auto w-full gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle>Insert</SheetTitle>
          <SheetDescription>
            Drag nodes or icons onto the canvas, or add icons via diagram-as-code.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          <SidebarPalette />
        </div>
      </SheetContent>
    </Sheet>
  );
}
