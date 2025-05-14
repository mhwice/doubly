"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button as ShadButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "./doubly/ui/button";

interface BaseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: () => void;
  isPending?: boolean;
  children?: ReactNode;
  submitLabel?: string;
  disableSubmit?: boolean;
  isDelete?: boolean;
  submitIcon?: React.ReactNode;
}

export function BaseModal({
  isOpen,
  onOpenChange,
  title,
  description,
  onSubmit,
  isPending,
  children,
  submitLabel = "Submit",
  disableSubmit = false,
  isDelete = false,
  submitIcon
}: BaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}> */}
      <DialogContent
        onCloseAutoFocus={() => {}}
        className="sm:max-w-lg border-[#dedede] p-0 overflow-hidden sm:rounded-xl shadow-custom"
      >
        <DialogHeader className="px-6 pb-2 pt-7">
          <DialogTitle className="text-vprimary text-2xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-vsecondary">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children && <div className="px-6 py-4">
          {children}
        </div>}
        <DialogFooter className="flex border-t border-vborder bg-[var(--dashboard-bg)] p-4 px-6">
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              type="submit"
              variant={isDelete ? "destructive" : "default"}
              loading={isPending}
              disabled={disableSubmit && !isPending}
              onClick={onSubmit}
              >{!isPending && submitIcon}{submitLabel}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
      {/* </form> */}
    </Dialog>
  );
}
