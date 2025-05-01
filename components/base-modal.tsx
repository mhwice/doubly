"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

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
        <DialogFooter className="flex sm:justify-between border-t border-vborder bg-[var(--dashboard-bg)] p-4 px-6">
          <Button size="lg" variant="flat" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            variant={isDelete ? "destructiveFlat" : "defaultFlat"}
            disabled={disableSubmit || isPending}
            onClick={onSubmit}
          >
            {isPending ? <Loader2 className="animate-spin mr-2" /> : submitIcon}
            {/* {submitIcon} */}
            {submitLabel}
            {/* {isPending && <Loader2 className="animate-spin mr-2" />} */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
