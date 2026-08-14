"use client";

import { useExport } from "@/hooks/useExport";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardCopy, Download } from "lucide-react";

export function ExportButton() {
  const { exportPng, copyPngToClipboard, exporting } = useExport();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button variant="secondary" size="sm" disabled={exporting} aria-label="Export">
                  <Download className="size-3.5" />
                  {exporting ? "Exporting…" : "Export"}
                </Button>
              }
            />
          }
        />
        <TooltipContent>Export PNG (Ctrl+E)</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuItem onClick={() => exportPng("white")}>
          Download PNG (white background)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPng("transparent")}>
          Download PNG (transparent)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => copyPngToClipboard("white")}>
          <ClipboardCopy className="size-3.5" />
          Copy to clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
