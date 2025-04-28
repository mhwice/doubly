"use client";

import { useTransition } from "react";
import { BaseModal } from "./base-modal";
import { deleteLink } from "@/actions/safe-delete-link";

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteAccountModal({ isOpen, onOpenChange }: CustomDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleOnDelete = async () => {
    startTransition(async () => {
      // delete account server action here
    });
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Final Warning"
      description="You will delete all link and click data associated with your account. All short links will stop working. This action is unreversable."
      onSubmit={handleOnDelete}
      isPending={isPending}
      submitLabel="Delete"
      isDelete={true}
    />
  );
}
