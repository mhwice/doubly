"use client";

import { useTransition } from "react";
import { BaseModal } from "./base-modal";
import { deleteLink } from "@/actions/safe-delete-link";

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  ids: number[];
}

export function DeleteLinkModal({ isOpen, onOpenChange, ids }: CustomDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleOnDelete = async () => {
    startTransition(async () => {
      const response = await deleteLink(ids);
      if (response) onOpenChange(false);
      else throw new Error("failed to delete");
    });
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Link"
      description="Permanently delete this link and all associated analytics data. This action is non-reversible."
      onSubmit={handleOnDelete}
      isPending={isPending}
      submitLabel="Delete"
      isDelete={true}
    />
  );
}
