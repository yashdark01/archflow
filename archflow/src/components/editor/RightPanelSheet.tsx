"use client";

import { CodePanelEditor } from "@/components/code-panel/CodePanelEditor";
import { PropertiesPanelContent } from "@/components/properties/PropertiesPanelContent";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRightPanelTab, type RightPanelTab } from "@/store/slices/uiSlice";
import { Code2, MessageSquare } from "lucide-react";

interface RightPanelSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS: { id: RightPanelTab; label: string; icon: typeof MessageSquare }[] = [
  { id: "properties", label: "Properties", icon: MessageSquare },
  { id: "code", label: "Code", icon: Code2 },
];

export function RightPanelSheet({ open, onOpenChange }: RightPanelSheetProps) {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.ui.rightPanelTab);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="sr-only">
          <SheetTitle>Editor panel</SheetTitle>
          <SheetDescription>Properties and diagram code</SheetDescription>
        </SheetHeader>
        <div className="flex shrink-0 gap-1 border-b border-border p-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={tab === id ? "secondary" : "ghost"}
              className="h-8 gap-1.5"
              onClick={() => dispatch(setRightPanelTab(id))}
            >
              <Icon className="size-3.5" />
              {label}
            </Button>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {tab === "properties" ? (
            <PropertiesPanelContent />
          ) : (
            <CodePanelEditor />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
