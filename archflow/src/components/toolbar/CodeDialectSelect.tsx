"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCodeDialect, type CodeDialect } from "@/store/slices/uiSlice";

const DIALECTS: { id: CodeDialect; label: string }[] = [
  { id: "eraser", label: "Eraser DSL" },
  { id: "mermaid", label: "Mermaid" },
];

export function CodeDialectSelect() {
  const dispatch = useAppDispatch();
  const dialect = useAppSelector((state) => state.ui.codeDialect);

  const activeLabel =
    DIALECTS.find((item) => item.id === dialect)?.label ?? "Language";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hidden sm:inline-flex"
        render={
          <Button variant="ghost" size="sm" className="text-xs">
            {activeLabel}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {DIALECTS.map(({ id, label }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => dispatch(setCodeDialect(id))}
          >
            {label}
            {dialect === id ? " · active" : ""}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
